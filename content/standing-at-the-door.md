+++
title = "Standing at the Door"
description = "The server you talk to is often not the server that answers. Meet the reverse proxy, then run one."
weight = 60
aliases = ["/chapter-5/"]

[extra]
chapter = 6
+++

Back in Chapter 1, example.com answered your `curl` with a header that didn't quite fit:

```console
< Server: cloudflare
```

Cloudflare doesn't own example.com. It wasn't the machine that wrote the page, and it isn't where the page lives. It was standing between you and that machine, taking your request, getting the answer and handing it back as if it had written it itself. You never noticed, because noticing isn't the point.

That thing in the middle is a **reverse proxy**, and a large share of the web's traffic goes through one. The quickest way to understand it is to put one in front of your own server.

## Hiring a doorman

You'll need the little Python server from Chapter 4 and a program called **Caddy**, a web server that is also a handy reverse proxy. (`brew install caddy` on a Mac, `apt install caddy` on Debian and Ubuntu, or a single download from caddyserver.com. It's one file.)

{% try() %}
In one terminal, go to the folder with your `index.html` and start the server from Chapter 4:

```console
$ python3 -m http.server 8000
```

In a second terminal, put Caddy in front of it:

```console
$ caddy reverse-proxy --from :8080 --to :8000
```

Caddy prints a few lines of JSON log and then waits. Now, in a third terminal, ask both of them for the same page:

```console
$ curl -v http://localhost:8000/
$ curl -v http://localhost:8080/
```
{% end %}

`--from :8080` means "listen on port 8080", and `--to :8000` means "pass everything to port 8000". Because `--from` names only a port and no hostname, Caddy stays on plain HTTP. (Give it a real domain name instead and it will try to get an HTTPS certificate for it. That's Chapter 9.)

## Spot the difference

Here's what the Python server said when asked directly, trimmed to the response:

```console
< HTTP/1.0 200 OK
< Server: SimpleHTTP/0.6 Python/3.9.6
< Date: Sun, 18 Oct 2026 18:25:19 GMT
< Content-type: text/html
< Content-Length: 30
< Last-Modified: Sun, 18 Oct 2026 18:25:17 GMT
<
<h1>Hello from my laptop</h1>
```

And here's the same page, fetched through Caddy on port 8080:

```console
< HTTP/1.1 200 OK
< Content-Length: 30
< Content-Type: text/html
< Date: Sun, 18 Oct 2026 18:25:19 GMT
< Last-Modified: Sun, 18 Oct 2026 18:25:17 GMT
< Server: SimpleHTTP/0.6 Python/3.9.6
< Via: 1.0 Caddy
<
<h1>Hello from my laptop</h1>
```

Same body, byte for byte. But look at the edges. The first line went from `HTTP/1.0` to `HTTP/1.1`: Python speaks the older version, Caddy speaks the newer one, and you only ever talked to Caddy. The headers came back in a different order, and `Content-type` got a capital T. There's a new header, `Via: 1.0 Caddy`, which is the proxy signing the guest book: "this message came via me, and the hop behind me spoke HTTP/1.0."

The lesson is that a proxy doesn't pass your bytes along like a pipe. It reads the whole request, makes a *new* request of its own to the server behind it, reads that answer, and writes a new answer to you. Two complete HTTP conversations, glued together in the middle.

Python's log in the first terminal agrees. It shows two requests: the first from `::1` (that was curl), the second from `::ffff:127.0.0.1` (IPv6's way of writing `127.0.0.1`), which was Caddy. As far as Python is concerned, its second visitor was the proxy.

## What the server behind the door sees

If the server only ever meets the proxy, how does it know who the real visitor was? The proxy tells it, with headers. You can watch this with `nc` from Chapter 5, playing the part of the server.

{% try() %}
Stop the Python server with <kbd>Ctrl</kbd>+<kbd>C</kbd>, leave Caddy running, and listen on port 8000 with `nc` instead:

```console
$ nc -l 8000
```

(On some Linux versions of `nc` it's `nc -l -p 8000`.) Then, from the other terminal, send a request through Caddy:

```console
$ curl http://localhost:8080/hello
```

The `nc` window shows the request exactly as Caddy sent it. Curl will sit there waiting for an answer; type one into `nc` if you like, or press <kbd>Ctrl</kbd>+<kbd>C</kbd> in both.
{% end %}

Here's what arrived at the "server":

```http
GET /hello HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.7.1
Accept: */*
Via: 1.1 Caddy
X-Forwarded-For: ::1
X-Forwarded-Host: localhost:8080
X-Forwarded-Proto: http
Accept-Encoding: gzip
```

The first four lines are curl's, passed along unchanged. The rest Caddy added. `X-Forwarded-For` is the visitor's real address (`::1` is IPv6 for "this same machine"). `X-Forwarded-Host` and `X-Forwarded-Proto` say which name and which scheme the visitor originally used, which matters once the proxy is speaking HTTPS to the world and plain HTTP to the server. `Accept-Encoding: gzip` is Caddy offering to take a compressed answer from the server, on its own behalf.

Notice that these headers are claims, not facts. Anyone can send an `X-Forwarded-For` header with any address in it. A server should only believe them when they come from a proxy it trusts.

## Forward and reverse

A **forward proxy** works for the client: your company or your VPN app sits in front of *you*, and every site you visit sees the proxy instead of you. A **reverse proxy** works for the server: it sits in front of *the site*, and every visitor sees the proxy instead of the server.

Same trick, opposite side of the conversation. When people say "proxy" in the context of running a website, they almost always mean the reverse kind, and so does the rest of this book.

## The shisa at the gate

On Okinawa, roofs and gateposts are guarded by **shisa**, the curly-maned lion-dogs you might recognise from this book's cover. They come in pairs, they don't own the house, and they don't cook dinner. Their whole job is the doorway: everyone who comes in passes them first, and some people don't get past.

A reverse proxy has exactly that job description. The server behind it owns the content and does the real work. The proxy owns the doorway. Because every single request has to walk past it, the doorway turns out to be the best place to do a surprising number of chores, each one taken off the server's plate.

One chore is telling you, honestly, when the house is empty.

{% try() %}
With Caddy still running and nothing at all on port 8000 (stop `nc` or Python if they're still going), ask again:

```console
$ curl -v http://localhost:8080/
```
{% end %}

```console
< HTTP/1.1 502 Bad Gateway
< Server: Caddy
< Content-Length: 0
```

There's the `502` from Chapter 2, and now you know exactly who says it. The door was open, the proxy answered, and the proxy reported that the server behind it didn't. This time `Server: Caddy` is the only name on the reply, because there was no upstream answer to pass along. Caddy's log, meanwhile, says `dial tcp :8000: connect: connection refused`, which is the same news from the inside.

Whenever you see a 502 or 504 on a real website, picture this: a doorman, standing in a perfectly working doorway, shrugging at an empty hallway.

## What a doorman is for

Here are the chores that make proxies worth the extra hop. Most real setups use several at once.

**TLS termination.** The proxy holds the site's certificate and does the encryption with visitors, then talks plain HTTP to the server over a short, private link. One program to configure, one place where certificates get renewed. That's what `X-Forwarded-Proto` was hinting at, and it's the subject of the next chapter.

**Caching.** If a thousand people ask for the same logo, the proxy can fetch it from the server once, keep a copy, and hand out the other 999 itself. The server sets the rules with headers like `Cache-Control`, saying what may be kept and for how long. Chapter 8 is largely about this.

**Load balancing.** Repeat the `--to` flag (`--to :8000 --to :8001`) and Caddy spreads requests across both servers. Visitors still see one address. When one server falls over, a proxy with health checks stops sending people to it.

**Routing by path or host.** One doorway can serve several houses. A few lines of Caddy's config file (the Caddyfile) send `/api/` to one program and everything else to another:

```text
:8080 {
	handle /api/* {
		reverse_proxy localhost:9000
	}
	handle {
		reverse_proxy localhost:8000
	}
}
```

From outside it looks like one website. Behind the door it's two programs that have never met. Routing by `Host` header works the same way, which is how one machine with one IP address serves many domains, the Chapter 1 `Host` header earning its keep.

**Rate limiting and blocking.** The doorway is where you notice that one address has asked for `/wp-login.php` four hundred times in a minute (on a site that has never run WordPress). A proxy can slow down or refuse clients that ask too often, drop requests that don't parse as proper HTTP, and turn away known-bad patterns before they reach code that might be fooled by them. A **web application firewall** is this idea taken seriously, with a rulebook of attacks.

None of this is impossible for the server itself. But a program that's good at building your pages is rarely also good at fending off a botnet, and keeping the chores in one well-tested program in front means you don't have to teach every server behind it the same tricks.

## Who stands at doors

You'll keep running into the same handful of names. They overlap a lot; the differences are mostly emphasis.

| Proxy | Known for |
|-------|-----------|
| **Nginx** | Web server and reverse proxy in front of a large part of the web. Fast, everywhere, terse configuration. |
| **Caddy** | Automatic HTTPS by default and a short config file. What this book uses. |
| **HAProxy** | Load balancing specialist, with very fine control over how traffic is spread and checked. |
| **Traefik** | Built for containers; discovers services in Docker or Kubernetes and routes to them as they come and go. |
| **Envoy** | Programmable proxy common inside large service meshes. |
| **CDNs** (Cloudflare, Fastly, Akamai, CloudFront…) | Reverse proxies as a service, run on thousands of machines around the world. |

That last row is the one you met in Chapter 1. When a site sits behind a CDN, its DNS points at the CDN's machines (Chapter 3's walk ended at `ns.cloudflare.com` for a reason), so your request lands at whichever of the CDN's doorways is nearest to you. That doorway serves from its cache when it can and fetches from the site's real server, the **origin**, when it can't. It's the same pattern you just built on your laptop, scaled up until it covers the planet.

{% note(title="Full disclosure") %}
The author works on [Zentinel](https://github.com/zentinelproxy/zentinel), an open-source reverse proxy that focuses on the security chores: filtering, rate limiting and blocking at the door. It's for people who run their own servers and want that protection on their own machines rather than inside someone else's network. It's one option among those above, and nothing in this book depends on it.
{% end %}

## Stop the doorman

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the Caddy terminal and in any other server you still have running. Port 8080 is a plain empty port again.

On your laptop, the trip from curl to the doorman was a few centimetres of memory. On the real internet it's a long stretch of cables, routers and other people's Wi-Fi, and so far everything you've sent down it has been plain text. Every request in this book, `Host` header and all, could have been read by anyone along the way. The next chapter is about how the web learned to seal the envelope, and why the doorman is usually the one holding the key.
