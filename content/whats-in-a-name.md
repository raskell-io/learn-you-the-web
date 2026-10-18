+++
title = "What's in a Name?"
description = "Computers don't know what example.com means. Something has to translate, and that something is DNS."
weight = 30

[extra]
chapter = 3
+++

Back in Chapter 1, before curl sent a single word of HTTP, it printed this:

```console
* Host example.com:80 was resolved.
* IPv4: 104.20.23.154, 172.66.147.243
```

You typed a name. Curl went off and came back with a number. Nobody asked you to approve this, nothing flashed on screen, and yet without that one step the request would never have left your computer, because the internet doesn't actually know what `example.com` is. The internet knows numbers.

This chapter is about how names turn into numbers. It's one of the oldest, most quietly heroic systems on the internet, and you can poke at every part of it from your terminal.

## Computers call each other by number

Every machine on the internet has an **IP address**, which is to computers roughly what a phone number is to you. The classic kind (IPv4) is four numbers from 0 to 255 separated by dots, like `104.20.23.154`. There are only about four billion of those, which seemed like plenty in 1981 and turned out to be roughly one per person, minus everyone's phone, laptop, fridge and doorbell. So there's a newer kind (IPv6) that looks like `2606:4700:10::6814:179a` and comes in quantities large enough that we could give every grain of sand its own address and still have some left for the beach.

When your computer wants to talk to another one, it needs that number. Humans are bad at remembering numbers and good at remembering words, so we put a translation layer in between. That layer is the **Domain Name System**, or DNS.

{% try() %}
Ask DNS a question yourself:

```console
$ dig example.com
```

On Windows, use `nslookup example.com` or, in PowerShell, `Resolve-DnsName example.com`. Look for the **ANSWER SECTION**.
{% end %}

Here's the interesting part of what came back for me:

```console
;; ANSWER SECTION:
example.com.		300	IN	A	172.66.147.243
example.com.		300	IN	A	104.20.23.154

;; Query time: 8 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
```

Read the answer lines left to right: the name you asked about, then `300` (how many seconds you're allowed to remember this answer; hold that thought), then `IN` (for "Internet", a relic from when other networks were a possibility), then `A` (the type of record: an **A**ddress), and finally the number itself. There are two, so your computer can pick either one. Those are the same numbers curl found.

Below that: the question took 8 milliseconds, and it was answered by `8.8.8.8`. That server is not the one that owns `example.com`. It's a middleman who went and found out. We'll get to who it is.

## Once upon a time, a text file

In the 1970s, the internet's ancestor (ARPANET) solved the name problem the obvious way: a single text file called `HOSTS.TXT` listed every computer's name next to its address. One office, the Network Information Center at SRI in California, maintained it. If you added a machine, you contacted them, they updated the file, and everyone downloaded the new copy every so often.

This worked beautifully for a few hundred computers and became a comedy for a few thousand. The file grew, copies went stale, two people would want the same name, and that one office became the bottleneck for the entire network. In 1983 Paul Mockapetris designed DNS to replace it, and the key idea was simple: *don't keep one big list; split it up and let everyone keep their own part.*

The old file never fully went away, though. Your computer still has one.

{% try() %}
```console
$ cat /etc/hosts
```

On Windows it lives at `C:\Windows\System32\drivers\etc\hosts`. You'll probably see `localhost` mapped to `127.0.0.1`, which is your computer's name for itself. Your machine checks this file *before* asking DNS, which is why developers sometimes add lines to it to make a name point at their own laptop. (Editing it needs administrator rights, and it's a good way to confuse yourself next week. Look, don't touch, for now.)
{% end %}

## Reading a name backwards

The trick that makes DNS scale is that names are a hierarchy, and you read them right to left.

```text
          www.example.com.
                          └── the root (that invisible final dot)
                      └────── .com: a "top-level domain"
              └────────────── example: one name under .com
          └────────────────── www: one name under example.com
```

Yes, there's a dot at the end. Every fully written domain name ends with one, standing for the **root** of the whole tree. Everyone leaves it off because it's always there, the way nobody bothers typing the full stop at the end of a text message.

Each level only needs to know about the level directly below it. The root knows who's in charge of `.com`, `.org`, `.ch`, `.dev` and the rest, and nothing else. The `.com` servers know who's in charge of `example.com`, and nothing about what's inside it. The servers for `example.com` know the actual addresses. Nobody holds the whole map, which means nobody is the bottleneck.

## Doing it by hand

Normally that whole walk down the tree happens for you, invisibly. But `dig` can be told to ask one specific server and not to cheat by asking around (`+norecurse`). So let's be the resolver.

First, ask a root server. There are thirteen root server names, `a.root-servers.net` through `m.root-servers.net`, and the first one lives at `198.41.0.4`:

```console
$ dig +norecurse @198.41.0.4 example.com

;; AUTHORITY SECTION:
com.			172800	IN	NS	l.gtld-servers.net.
com.			172800	IN	NS	j.gtld-servers.net.
com.			172800	IN	NS	h.gtld-servers.net.
...
```

No answer section. The root doesn't know where `example.com` is and doesn't pretend to. What it gives you is a referral: "I don't know, but these are the servers for `.com`, ask them." `NS` means **N**ame **S**erver.

So we ask one of those (`a.gtld-servers.net` lives at `192.5.6.30`):

```console
$ dig +norecurse @192.5.6.30 example.com

;; AUTHORITY SECTION:
example.com.		172800	IN	NS	hera.ns.cloudflare.com.
example.com.		172800	IN	NS	elliott.ns.cloudflare.com.
```

Another referral, one level down: "`.com` doesn't know the address either, but `example.com` is handled by these two servers." So we ask one of those:

```console
$ dig +norecurse @hera.ns.cloudflare.com example.com

;; ANSWER SECTION:
example.com.		300	IN	A	172.66.147.243
example.com.		300	IN	A	104.20.23.154
```

There it is. Three questions, three servers, each one more specific than the last, and the final one is **authoritative**: it's the server the owner of `example.com` actually configured, so its word is final.

## You don't usually do the walking

Your laptop doesn't do all of that every time you open a page. It hands the question to a **resolver**, a server whose whole job is walking the tree on behalf of other people. Your home router usually points you at one run by your internet provider; some people choose a public one instead, like Google's `8.8.8.8` or Cloudflare's `1.1.1.1`. That's who answered my `dig` earlier.

What makes resolvers fast is that they remember. Every answer comes with a **TTL**, a "time to live" in seconds: the root said `.com`'s servers were good for 172,800 seconds (two days), and `example.com`'s address was good for 300 (five minutes). Within that window, a resolver that gets asked again answers from memory without asking anyone. Since millions of people share the same few resolvers, the root servers hardly ever hear about `.com`. Its answer is almost always already sitting in someone's cache.

This also explains one of the internet's great folk myths. When you change your domain's address and someone tells you to "wait for DNS to propagate", nothing is actually propagating. Resolvers around the world are holding the old answer until its TTL runs out, and then they ask again. If your TTL was a day, the world can take a day to notice. If you know a change is coming, lower the TTL first.

{% note(title="One more thing about privacy") %}
Classic DNS questions travel unencrypted, so anyone on the network path (your Wi-Fi, your provider) can see which names you look up, even when the website itself uses HTTPS. Newer variants, DNS over HTTPS and DNS over TLS, wrap the question in encryption. Most browsers can use them now; look for "secure DNS" in your browser settings.
{% end %}

## Not just addresses

An `A` record is the most common kind of DNS record, but a name can carry other kinds of information too. You'll meet these the moment you own a domain:

| Type    | Means                                        | Example use |
|---------|----------------------------------------------|-------------|
| `A`     | IPv4 address                                 | `example.com → 104.20.23.154` |
| `AAAA`  | IPv6 address (four times the A's)            | `example.com → 2606:4700:10::6814:179a` |
| `CNAME` | "This name is an alias for that other name"  | `www.example.com → example.com` |
| `MX`    | Where to deliver email for this domain       | `example.com → mail.example.com` |
| `TXT`   | Free-form text, mostly for proving things    | "Yes, I own this domain, signed, me" |
| `NS`    | Which servers are authoritative for the name | what we followed in the walk above |

{% try() %}
Ask for specific record types by putting the type after the name:

```console
$ dig +short example.com AAAA
$ dig +short gmail.com MX
$ dig +short example.com NS
```

`+short` drops everything but the answer. Try your own favourite sites. Some have surprisingly chatty `TXT` records.
{% end %}

## Where your own name fits

When you "buy" a domain, you're really renting a line in the `.com` (or `.org`, or `.ch`) zone for a year at a time, through a company called a **registrar**. What that line says is: "for this name, ask these name servers." Then, on those name servers, you write the records yourself: this name points to that address, mail goes here, `www` is an alias for the bare name.

That's all a domain is. It's not a website, and it's not a server. It's a signpost in a very large, very old, surprisingly polite tree, pointing at a number. The computer living at that number is the subject of the next chapter.
