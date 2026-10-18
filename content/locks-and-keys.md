+++
title = "Locks, Keys, and Quiet Conversations"
description = "How two computers that have never met agree on a secret in public, and what the padlock does and doesn't promise."
weight = 70
aliases = ["/chapter-6/"]

[extra]
chapter = 7
+++

Every request in this book so far has gone out as plain text. You've read them yourself, `Host` header and all, and so could the café Wi-Fi, your internet provider and every router in between. Time to add one letter:

```console
$ curl -v https://example.com -o /dev/null
```

The `-o /dev/null` throws the page away, because this time the interesting part comes before it. A whole new block of lines appears between "Connected" and `GET`. That block is two computers that have never met agreeing on a secret, in public, in a few milliseconds, with anyone listening welcome to listen.

{% try() %}
Run it and find the lines with `TLS handshake` in them, then the block starting `Server certificate:`. Then run the same command with `http://` and notice the whole block is gone.
{% end %}

## The new lines

Here's the middle of what came back for me:

```console
* Connected to example.com (2606:4700:10::ac42:93f3) port 443
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* (304) (IN), TLS handshake, Server hello (2):
* (304) (IN), TLS handshake, Unknown (8):
* (304) (IN), TLS handshake, Certificate (11):
* (304) (IN), TLS handshake, CERT verify (15):
* (304) (IN), TLS handshake, Finished (20):
* (304) (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256 / [blank] / UNDEF
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=example.com
*  start date: Sep 26 22:49:11 2026 GMT
*  expire date: Dec 25 22:56:35 2026 GMT
*  subjectAltName: host "example.com" matched cert's "example.com"
*  issuer: C=US; O=SSL Corporation; CN=Cloudflare TLS Issuing ECC CA 3
*  SSL certificate verify ok.
* using HTTP/2
...
< HTTP/2 200
< content-type: text/html; charset=utf-8
< server: cloudflare
```

First, the port is 443, not 80. That's the default home of HTTPS, the same way 80 is home for HTTP. Then come seven messages, marked `OUT` when your computer sent them and `IN` when the server did. This is the **TLS handshake**. When it's done, curl reports `TLSv1.3` and a cipher name, prints the server's certificate, and only then sends its ordinary `GET`.

(The numbers in brackets are message types from the TLS specification. `Unknown (8)` is "Encrypted Extensions"; the curl that ships with macOS doesn't have a name for it, and other builds may print one. The `ALPN` lines are a side negotiation about which HTTP version to speak afterwards: curl offered HTTP/2, the server accepted, and that's why the response headers come back in lowercase.)

**TLS** stands for Transport Layer Security. **HTTPS** is ordinary HTTP sent inside a TLS connection, nothing more: the same `GET`, the same headers, the same `200`. (You'll also hear "SSL", TLS's predecessor. The name outlived the protocol, which is why curl still says `SSL connection`.)

## Postcards

Plain HTTP is a postcard. It gets where it's going, but everyone who handles it on the way can flip it over and read it, and nothing stops them from writing on it either. For a page about cats, that's fine. For `POST /login` with your password in the body, or a response with your bank balance in it, it's not.

HTTPS puts the postcard in a sealed envelope. Same postal system, same routes, same handlers, but they only see the outside. The envelope does three jobs at once: nobody along the way can read it (**confidentiality**), nobody can change it without the recipient noticing (**integrity**), and you can be sure who it's addressed to (**authentication**). The handshake is where all three get set up.

## A secret agreed in public

Here's the puzzle. Your laptop and Cloudflare's server have never met. Every message between them passes through networks neither of them controls. And yet by the end of the handshake, they share a secret key that nobody listening knows. How?

The trick is a piece of mathematics called **key agreement**, descended from an idea by Whitfield Diffie and Martin Hellman in 1976. Each side picks a random private number that never leaves the machine and computes a public "share" from it. They swap shares in the open. Each side then combines *its own* private number with the *other's* public share, and the maths guarantees both arrive at the same result. Someone who saw both public shares can't work it out, because doing so would mean undoing a calculation that is easy in one direction and impractically hard in the other.

Notice what never happened: nobody sent the secret. It was computed separately on both ends. Here's how that maps onto curl's lines:

```text
laptop                               server
  │── Client hello ───────────────────▶│  my key share, ciphers,
  │                                    │  "I want example.com"
  │◀─────────────────── Server hello ──│  my key share
  │                                    │
  │    both compute the same secret    │
  │┈┈┈┈┈┈ encrypted from here on ┈┈┈┈┈┈│
  │◀─────────── Encrypted Extensions ──│
  │◀──────────────────── Certificate ──│  "I am example.com"
  │◀──────────────────── CERT verify ──│  proof I hold its key
  │◀─────────────────────── Finished ──│
  │── Finished ───────────────────────▶│
  │── GET / ──────────────────────────▶│
```

In TLS 1.3, the version curl used, this takes a single round trip: one message out, one batch back, and the laptop's `Finished` can travel together with the first request. The `Finished` messages are each side's checksum over the whole conversation so far, so if anyone tampered with a hello along the way, the handshake fails.

But key agreement alone has a hole. You've agreed a secret with *someone*. If an attacker sat in the middle and swapped in their own key shares, you'd have a perfectly private conversation with the attacker. That's what the next two messages are for. **Certificate** says who the server claims to be, and **CERT verify** is a signature over the handshake made with the private key that matches the certificate. Only the real owner of that key can produce it.

{% note(title="Pedantry corner") %}
Curl's summary line doesn't say which key agreement was used, but `openssl s_client` (below) does. For me it printed `Negotiated TLS1.3 group: X25519MLKEM768`: a classic elliptic-curve exchange (X25519) and a newer post-quantum one (ML-KEM) run side by side, so an attacker would have to break both. People are already preparing for computers that don't exist yet.
{% end %}

## Reading the certificate

A **certificate** is a small signed document that says: this public key belongs to this name, from this date to that date, and here's who vouches for it. You can ask any HTTPS server to show you its own.

{% try() %}
```console
$ openssl s_client -connect example.com:443 -servername example.com </dev/null
```

The `</dev/null` makes openssl hang up as soon as the handshake is done, instead of waiting for you to type a request. Scroll up to the section called `Certificate chain`.
{% end %}

```console
Certificate chain
 0 s:CN=example.com
   i:C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
   v:NotBefore: Sep 26 22:49:11 2026 GMT; NotAfter: Dec 25 22:56:35 2026 GMT
 1 s:C=US, O=SSL Corporation, CN=Cloudflare TLS Issuing ECC CA 3
   i:C=US, O=SSL Corporation, CN=SSL.com TLS Transit ECC CA R2
   v:NotBefore: May 29 19:49:45 2025 GMT; NotAfter: May 27 19:49:44 2035 GMT
 2 s:C=US, O=SSL Corporation, CN=SSL.com TLS Transit ECC CA R2
   i:C=US, O=SSL Corporation, CN=SSL.com TLS ECC Root CA 2022
   v:NotBefore: Oct 21 17:02:23 2022 GMT; NotAfter: Oct 17 17:02:22 2037 GMT
 3 s:C=US, O=SSL Corporation, CN=SSL.com TLS ECC Root CA 2022
   i:C=GB, ST=Greater Manchester, L=Salford, O=Comodo CA Limited, CN=AAA Certificate Services
   ...
```

Each entry has an `s:` (**subject**, who this certificate is about) and an `i:` (**issuer**, who signed it). Read it top to bottom and the issuer of each line is the subject of the next. Certificate 0 is example.com's own, signed by an intermediate called "Cloudflare TLS Issuing ECC CA 3". That one is signed by another intermediate, which is signed by "SSL.com TLS ECC Root CA 2022". The last entry is that root again, this time vouched for by an older root, so that devices which only know the older one can still follow along.

The `v:` line is the validity window. example.com's certificate runs from 26 September to 25 December: ninety days. The intermediates last a decade or more, which is why they're kept locked away and only ever used to sign other certificates.

Why trust any of this? Because the chain has to end somewhere you already trust. Your operating system and your browser ship with a list of well over a hundred **root certificates** belonging to **certificate authorities** (CAs), organisations that are audited and allowed to vouch for names. Curl told you where it keeps its list: `CAfile: /etc/ssl/cert.pem`. If the chain leads back to a root on that list, every signature checks out, the name matches and the dates are current, you get `SSL certificate verify ok`. If not, you get a warning page.

{% try() %}
The people behind badssl.com keep deliberately broken sites around for exactly this:

```console
$ curl https://expired.badssl.com/
$ curl https://wrong.host.badssl.com/
$ curl https://self-signed.badssl.com/
```

Each one fails with `curl: (60)` and a different reason: `certificate has expired`, `no alternative certificate subject name matches target host name`, and `self signed certificate`. Open the same addresses in a browser to see its version of the same complaint.
{% end %}

One thing the padlock never promised: that the site is *nice*. A certificate for `paypa1-login-secure.com` proves you're talking to `paypa1-login-secure.com`, with total cryptographic confidence. Whether you should be is up to you.

## Free certificates, on a timer

For years, certificates cost money and a renewal meant someone remembering, every year or two, to click through a CA's website and copy files onto a server. Plenty of small sites didn't bother, which is how most of the web stayed on postcards well into the 2010s.

**Let's Encrypt** changed the economics. It's a non-profit CA that began issuing certificates to the public at the end of 2015, charges nothing, and has no website to click through. Instead, your server talks to it with a protocol called **ACME**: it asks for a certificate, proves it controls the domain (typically by serving a token Let's Encrypt asks for, over HTTP, at a well-known path), and receives one. A program can do that unattended forever.

Its certificates have been valid for 90 days, short on purpose: if renewing is automatic, a short life costs nothing, and a stolen key is useful for less time. They're getting shorter. Let's Encrypt has offered 45-day certificates as an opt-in since May 2026, and its plan moves the default to 64 days in February 2027 and to 45 days in February 2028. (There's also a six-day option for the truly committed.) Nobody renews by hand on that schedule. That's the point.

Caddy, the doorman from the last chapter, does all of this by default: give it a domain name instead of a bare port, and it fetches a certificate, renews it, and redirects HTTP to HTTPS without being asked. You'll watch it happen in Chapter 9.

## What the envelope hides, and what it doesn't

TLS protects everything inside the connection. It does not hide the fact that the connection exists.

| An observer on the path **can't** see | An observer on the path **can** see |
|------|------|
| The path (`/account/statement`) and query string | The IP address you connected to |
| All headers, including cookies and `Authorization` | Usually the hostname, in the Client hello |
| Request and response bodies: passwords, pages, forms | Your DNS lookups, unless you use DoH or DoT |
| The status code | When you connected, for how long, and roughly how much data moved |

The hostname leaks because the Client hello has to say which site you want before any encryption exists, so a server hosting many sites knows which certificate to present. That's the `-servername` flag you gave openssl, a field called **SNI** (Server Name Indication). A newer extension, Encrypted Client Hello, hides the real name where both sides support it. And as Chapter 3 warned, the DNS question you asked a moment earlier may have gone out as a postcard of its own.

Sizes and timing say more than you'd think. An observer who can't read the envelope can still see that it's the size of a particular page, or that it arrives every thirty seconds like a chat app checking in.

And once the envelope arrives, TLS is done. What the server does with your password after decrypting it is between you and the server's owners.

## Who's holding the key

Look at the certificate issuer one more time: *Cloudflare* TLS Issuing ECC CA 3. The machine that completed your handshake wasn't example.com's own server. It was the doorman from Chapter 6, holding a certificate for example.com and the private key that goes with it.

This is **TLS termination**, and it's the most common way HTTPS is deployed. The encrypted connection from the visitor ends at the proxy. The proxy decrypts the request, makes its decisions (cache, route, block), and forwards it to the origin server, often over plain HTTP on a private network, or over a second, separate TLS connection when the path is less private. The `X-Forwarded-Proto: https` header you saw Caddy add is how the server behind the door finds out that the visitor's side was encrypted.

It's a reasonable trade, but it is a trade. The envelope is opened at the door, so whoever runs the door can read everything: every password, every cookie. When you put a site behind a CDN, you are handing them that key. That's often the right choice, and it should always be a deliberate one.

On your own laptop, none of this matters. Curl talking to Python over `localhost` never leaves the machine, so there is nobody in between to keep secrets from. The envelope is for the long trip.

With the conversation sealed, the remaining problem is volume: what happens to the doorman, the server and everyone's patience when ten thousand visitors show up in the same minute.
