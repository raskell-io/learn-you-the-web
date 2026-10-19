+++
title = "Running Your Own Corner"
description = "A rented machine, a domain, four lines of config and a padlock: putting your own page on the web, step by step."
weight = 90
aliases = ["/chapter-8/"]

[extra]
chapter = 9
+++

For eight chapters you've been asking other people's computers for things, and answering only yourself, on `localhost`. This chapter closes the gap. By the end of it, a page you wrote will be on the public internet, at your own name, behind a padlock, served by a machine you rent for about the price of a sandwich a month.

Here's the shopping list:

- **A domain name.** Around ten to fifteen a year for a `.com`, from any registrar. As Chapter 3 put it, you're renting a line in the `.com` zone.
- **A small virtual server**, usually called a VPS. Plenty of providers rent them by the month, and the smallest plans cost a few euros or dollars. One CPU and a gigabyte or two of memory is more than enough: Chapter 8 showed what a single machine can serve.
- **Something to serve.** An `index.html` will do. So will the output of a static site generator.
- **An hour**, most of which is waiting for things to install.

The walk-through below uses Debian or Ubuntu, the most common choices, and placeholder addresses: `example.org` for your domain, `203.0.113.10` and `2001:db8::10` for your server. (Those addresses are reserved for documentation, so they can't belong to anyone. Swap in your own.)

## A key, not a password

You'll talk to your server over **SSH**, a remote terminal that runs over an encrypted connection, much like the TLS from Chapter 7. You could log in with a password, but every server on the internet is constantly guessed at by strangers' programs, so you'll use a key instead. Make one before you rent anything.

{% try() %}
Check whether you already have a key with `ls ~/.ssh/*.pub`. If not, make one:

```console
$ ssh-keygen -t ed25519 -C "you@laptop"
```

Press Enter to accept the default location, and choose a passphrase (it protects the key if your laptop is stolen).
{% end %}

```console
Generating public/private ed25519 key pair.
...
Your public key has been saved in /Users/you/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:uU/bgwF+iSGwgcEEAviTnOJt1+orV3UMhRc9TxHuQFg you@laptop
```

That made two files. `id_ed25519` is the private half, and it never leaves your laptop. `id_ed25519.pub` is the public half, a single line starting with `ssh-ed25519`, and you can hand it to anyone. A server that has your public key can check that you hold the private one without the private one ever crossing the network: the same trick a certificate plays in Chapter 7, with you as your own certificate authority.

## Renting the machine

Every provider's sign-up looks slightly different and asks the same things:

- **Where.** Pick a region near the people who'll visit. Chapter 8 explained why distance costs milliseconds.
- **Which operating system.** A current Debian or Ubuntu LTS release.
- **How you'll log in.** Paste the contents of your `.pub` file here.

A minute later you get an IP address, and usually an IPv6 one too. Log in:

```console
$ ssh root@203.0.113.10
The authenticity of host '203.0.113.10 (203.0.113.10)' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

That question is SSH admitting there's no certificate authority here: it has never met this machine and can't vouch for it. Type `yes`, and it remembers the server's fingerprint and will complain loudly if it ever changes. (Some providers log you in as `root`, others as a user called `debian` or `ubuntu` who can use `sudo`. The commands below use `sudo`; as root you can leave it off.)

Before anything else, install the updates that came out since the provider built its image:

```console
$ sudo apt update && sudo apt upgrade
```

Then make sure passwords can't be used to log in at all. Many images already turn them off once you've supplied a key, but check rather than hope:

```console
$ sudo sshd -T | grep passwordauthentication
```

If that says `passwordauthentication yes`, set `PasswordAuthentication no` in `/etc/ssh/sshd_config` and run `sudo systemctl restart ssh`. If the setting won't budge, a file in `/etc/ssh/sshd_config.d/` is overriding it; `sshd -T` always shows the final word. Keep your current session open until you've confirmed, from a second terminal, that you can still log in.

## Pointing your name at it

Now Chapter 3 becomes your problem. At your registrar (or whoever hosts your domain's DNS), add two records:

```text
example.org.    300    IN    A       203.0.113.10
example.org.    300    IN    AAAA    2001:db8::10
```

The control panel will show these as form fields rather than a line of text, but the parts are the same: name, TTL, type, address. If you want `www.example.org` to work too, add the same pair for `www`, or a `CNAME` pointing `www` at `example.org`.

Set the TTL low, 300 seconds, while you're setting things up. If you mistype an address, resolvers around the world will only hold on to your mistake for five minutes. Once everything works you can raise it.

{% try() %}
From your laptop, check that the world can see your record:

```console
$ dig +short example.org
```

It should print the address you just entered. If it prints nothing or an old address, a resolver is still holding a previous answer. That's the TTL at work, not a broken setup; wait it out.
{% end %}

Do this step early. Caddy will ask for a certificate as soon as it starts, and Let's Encrypt will only issue one once your name points at your server.

## Three doors open

A fresh server answers on whatever ports its programs happen to open. You want exactly three: 22 for SSH, 80 for plain HTTP, and 443 for HTTPS. Port 80 stays open even though you'll serve everything over HTTPS, because that's where visitors who type `http://` arrive to be redirected, and one of the ways Let's Encrypt checks that you control the name.

This is the shisa's oldest job: three doors, and a wall everywhere else. Ubuntu comes with a simple firewall called `ufw`; on Debian, install it with `sudo apt install ufw`.

```console
$ sudo ufw allow 22/tcp
$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
$ sudo ufw enable
```

Order matters: allow SSH *before* you enable the firewall, or the first thing it blocks is you. If you'd like HTTP/3 (Chapter 5), which Caddy speaks and which travels over UDP, add `sudo ufw allow 443/udp` as well. (Many providers also offer a firewall in their control panel. Using one is fine; using both means you have two places to forget about.)

## Installing Caddy

Caddy's install page, [caddyserver.com/docs/install](https://caddyserver.com/docs/install), has a short block of commands for Debian and Ubuntu that adds Caddy's own package repository. Paste those, and they finish with:

```console
$ sudo apt install caddy
```

The package sets Caddy up as a system service: it starts now, starts again after every reboot, and reads its configuration from `/etc/caddy/Caddyfile`. Out of the box it serves a welcome page on port 80, so visit `http://203.0.113.10` in your browser. If you see Caddy's welcome page, your machine is on the web. It doesn't have your name or your page yet.

## Your page, your name

First, a home for your files. Create the directory and make it yours, so you can copy things in without `sudo`:

```console
$ sudo mkdir -p /var/www/site
$ sudo chown $USER /var/www/site
```

Then, from your laptop, copy your page across. `scp` is `cp` over SSH, using the same key:

```console
$ scp index.html root@203.0.113.10:/var/www/site/
```

Back on the server, replace the contents of `/etc/caddy/Caddyfile` (`sudo nano /etc/caddy/Caddyfile` works) with this:

```text
example.org {
	root * /var/www/site
	file_server
}
```

Four lines. The first is the site's address. `root` says where its files live, and the `*` means "for every request". `file_server` says to answer requests with those files, handing out `index.html` when someone asks for `/`, as in Chapter 4. Check your typing, then tell Caddy to reload:

```console
$ caddy validate --config /etc/caddy/Caddyfile
...
Valid configuration
$ sudo systemctl reload caddy
```

What you didn't write is the interesting part. Because the address is a domain name, Caddy assumes you want HTTPS. It asks Let's Encrypt for a certificate, proves it controls `example.org` (that's why the DNS and the open ports had to come first), installs the certificate, starts redirecting `http://` to `https://`, and renews the certificate on its own, well before it expires. All of Chapter 7, from four lines. (`caddy adapt` prints the full configuration Caddy builds from your Caddyfile, if you'd like to see what those four lines expand into: there's a server listening on `:443` in there that you never asked for.)

If something goes wrong, the logs say why:

```console
$ sudo journalctl -u caddy --no-pager | tail -20
```

The usual suspects are a DNS record that hasn't reached Let's Encrypt yet or a closed port 80 or 443. Look for a line saying `certificate obtained successfully`. Then open `https://example.org` in your browser. That's your page, at your name, with a padlock.

## Keeping it alive

A server is a bit like a houseplant: it doesn't need much, but it does need *something*, and the something is mostly the same every month.

- **Updates.** Turn on `unattended-upgrades`, which installs your distribution's security fixes on its own (Ubuntu ships with it switched on; on Debian, `sudo apt install unattended-upgrades`, then `sudo dpkg-reconfigure unattended-upgrades` to enable it). It leaves other repositories alone, so still run `sudo apt update && sudo apt upgrade` now and then: that's what brings new Caddy releases from the repository you added. Some updates, like a new kernel, only take effect after `sudo reboot`; on Ubuntu, a file appears at `/var/run/reboot-required` to tell you.
- **Backups.** Your site's real home is your laptop, ideally in version control, and the server only holds a copy. The things that exist *only* on the server are the Caddyfile and anything your site collects there. Copy those somewhere else, or use your provider's snapshot feature. Restore from a backup once, on purpose, so the first time isn't an emergency.
- **A look at the logs.** Run `sudo journalctl -u ssh` a day after setting up and you'll see strangers' programs trying passwords for users called `admin` and `test`. That's not personal. Every address on the internet gets this, and it's why you turned passwords off. (Caddy doesn't keep an access log unless you ask: add a `log` line inside your site block.)
- **Someone to notice.** Plenty of services will request your page every few minutes and email you when it stops answering. You want to hear about an outage before your friends tell you.

That's the whole job. Minutes a month, and most of those spent reading what an update changed.

## Other ways in

Caddy isn't the only path. Nginx or Apache with Certbot fetching the certificates is the classic setup, documented in a thousand tutorials. If your corner grows an application behind it, you'll want a reverse proxy in front, and Caddy, Nginx, HAProxy and Zentinel all do that job, as you saw in Chapter 6. And if you'd rather not run a machine at all, static hosting services will take a folder of files and run the servers for you. That's a fine choice, and you now know what they're doing on your behalf.

## One more time

Back on your laptop, ask your own server for your own page, the same way you asked `example.com` at the start of this book:

```console
$ curl -v https://example.org
```

I can't show you yours, but here's the same request to `caddyserver.com`, which is served by Caddy too, trimmed:

```console
* Host caddyserver.com:443 was resolved.
* IPv6: 2604:a880:2:d0::21b0:6001
* IPv4: 165.227.20.207
*   Trying [2604:a880:2:d0::21b0:6001]:443...
* Connected to caddyserver.com (2604:a880:2:d0::21b0:6001) port 443
...
* Server certificate:
*  subject: CN=caddyserver.com
*  issuer: C=US; O=Let's Encrypt; CN=YE1
*  SSL certificate verify ok.
...
> GET / HTTP/2
> Host: caddyserver.com
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/2 200
< content-type: text/html; charset=utf-8
< server: Caddy
```

It's the wall of text from Chapter 1, and you can read every line of it now. A name turned into a number. A connection to a port. A certificate, signed by someone your computer trusts, for exactly the name you asked for. Then a `GET`, a `Host` header, a blank line, and a `200` coming back.

Somewhere, sometime soon, a person you've never met will type your name. Their computer will send those same few lines across the world to the machine you rented, and that machine will answer. It's still one request and one response. One of the two computers is now yours.
