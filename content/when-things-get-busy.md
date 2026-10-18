+++
title = "When Things Get Busy"
description = "What happens when everyone shows up at once, and the tricks (more servers, more copies, fewer questions) that keep the answers coming."
weight = 80
aliases = ["/chapter-7/"]

[extra]
chapter = 8
+++

Every request in this book so far has arrived alone and been answered at leisure. Real servers don't get that luxury. A link to your page turns up somewhere popular, and a few thousand people click it in the same minute, each of them sending the same little `GET` you met in Chapter 1.

You don't have to wait for fame to find out what happens next. You can send the crowd yourself.

{% try() %}
You need a load generator, a program that fires requests as fast as you let it. `hey` is a small one (`brew install hey`, or download a binary from its GitHub page). `ab`, short for ApacheBench, ships with macOS and lives in the `apache2-utils` package on Debian and Ubuntu.

In a folder with an `index.html` in it, start the server from Chapter 4 on a spare port:

```console
$ python3 -m http.server 8400
```

Then, in a second terminal, send it two thousand requests, ten at a time:

```console
$ hey -n 2000 -c 10 http://localhost:8400/
```

The `ab` version is `ab -n 2000 -c 10 http://127.0.0.1:8400/`.
{% end %}

## A crowd of ten

Here's what came back on my laptop, trimmed. Your numbers will differ, possibly by a lot: they depend on your machine and on what else it's doing at the time.

```console
Summary:
  Total:	0.6511 secs
  Slowest:	0.0979 secs
  Fastest:	0.0003 secs
  Average:	0.0029 secs
  Requests/sec:	3071.8962
...
Status code distribution:
  [200]	2000 responses
```

Three thousand requests a second, from a server that Python includes as a convenience and whose documentation says not to use in production. Every one got a `200`, and the average answer took three milliseconds. At that rate you could serve 265 million requests a day, which is more than most websites see in their lifetime.

Now be less kind. Five hundred at a time, ten thousand in total:

```console
$ hey -n 10000 -c 500 http://localhost:8400/

Summary:
  Total:	16.6101 secs
  Slowest:	6.1695 secs
  Fastest:	0.0002 secs
  Average:	0.0736 secs
  Requests/sec:	602.0436

Response time histogram:
  0.000 [1]	|
  0.617 [9420]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  1.234 [59]	|
  1.851 [27]	|
  2.468 [42]	|
  3.085 [0]	|
  3.702 [0]	|
  4.319 [45]	|
  4.936 [0]	|
  5.553 [0]	|
  6.170 [38]	|
...
Status code distribution:
  [200]	9632 responses

Error distribution:
  [368]	Get "http://localhost:8400/": dial tcp [::1]:8400: connect: operation timed out
```

More traffic, and the server got *slower* at handling it: about 600 requests a second instead of 3,000. The big bar says most people were still answered in a blink. But a tail of them waited one, two, four, six seconds, and 368 never got in at all.

Those clumps aren't random. Your operating system keeps a short waiting line for new connections that a program hasn't picked up yet, and Python's server asks for a line five places long. Five hundred crabs at a door with room for five: when the line is full, new knocks are ignored, and the knocking side waits a second, then longer, then longer again, before trying once more. Some gave up.

That's what overload looks like from the outside. Not a crash, not a red error page: a server that is up, answering most people quickly and some people never. It's also why "works for me" is the least useful sentence anyone can say during an outage.

## Where the ceiling is

A server under load runs out of something. It might be CPU, memory, network bandwidth or disk speed, or, as here, the program's own ability to accept and juggle connections. My laptop wasn't anywhere near out of CPU. The bottleneck was the software.

{% try() %}
Run the same crowd against Caddy, the server you used as a proxy in Chapter 6. In the same folder:

```console
$ caddy file-server --listen :8401
```

```console
$ hey -n 10000 -c 500 http://localhost:8401/
```
{% end %}

```console
Summary:
  Total:	0.2550 secs
  Slowest:	0.1305 secs
  Fastest:	0.0001 secs
  Average:	0.0105 secs
  Requests/sec:	39220.8388
...
Status code distribution:
  [200]	10000 responses
```

Same files, same laptop, same crowd: sixty-five times the throughput, no errors, and the slowest answer took an eighth of a second. (This is flattering. `hey` and the server shared one machine and never touched a real network, so a server across the internet will do worse. Not 600-requests-a-second worse.)

So the first rule of scaling is unglamorous: before you buy more machines, check that you aren't running the wrong program on the one you have.

## Bigger, or more?

When the program is fine and the machine really is full, you have two ways out.

**Vertical scaling** means a bigger machine: more cores, more memory, a faster network card. Nothing about your setup changes, which is why it's always the first thing people try. But there's a biggest machine you can buy, its price climbs faster than its size, and it's still one machine. One failed disk, one botched update, one reboot, and the whole site is gone.

**Horizontal scaling** means more machines of the same size, each with a copy of the site. There's no hard ceiling, and losing one machine leaves the others running. The price is that something now has to decide which machine answers which request, and the machines have to agree about anything they share, like who is logged in or what's in a shopping cart.

That second part is where HTTP's design pays off. Every request carries everything needed to answer it (the path, the `Host` header, any cookies), so any copy of the site can answer any request. The hard part is the data behind the site. Ten web servers are easy; ten copies of one database that all agree with each other are a career. Most real setups end up in the middle: a few sensible machines rather than one giant or a thousand tiny ones.

## Spreading the load

The something that decides is a **load balancer**, and you've already run one. In Chapter 6 you stood Caddy at the door with `caddy reverse-proxy --from :8080 --to :8000`. The `--to` flag can be repeated.

{% try() %}
Make two folders with different pages, so you can tell the servers apart:

```console
$ mkdir a b
$ echo "hello from server A" > a/index.html
$ echo "hello from server B" > b/index.html
```

Start one server in each folder, each in its own terminal: `python3 -m http.server 8411` inside `a`, and `python3 -m http.server 8412` inside `b`. Then, in a third terminal, put a proxy in front of both:

```console
$ caddy reverse-proxy --from :8410 --to :8411 --to :8412
```

And from a fourth, ask the proxy six times:

```console
$ for i in 1 2 3 4 5 6; do curl -s http://localhost:8410/; done
```
{% end %}

```console
hello from server A
hello from server B
hello from server A
hello from server B
hello from server A
hello from server A
```

One address, two servers, and `curl` has no way of knowing. The shisa at the door is now also deciding which room to send each visitor to. Caddy picks at random by default, which evens out over many requests. Other strategies are a config line away: strict turns (`round_robin`), whoever is least busy (`least_conn`), or always the same server for the same visitor, for applications that keep state in one place.

## When a server falls over

Now stop server B with <kbd>Ctrl</kbd>+<kbd>C</kbd> and ask the proxy twenty more times, printing only the status codes:

```console
$ for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code} " http://localhost:8410/; done
200 502 502 200 502 502 502 502 200 502 502 502 502 502 502 200 200 502 200 200
```

More than half the visitors just got `502 Bad Gateway`, the status from Chapter 2 that means "the server behind me didn't answer". Server A is alive and well, and the proxy keeps sending people to B anyway, because nobody told it B is gone.

The fix is a **health check**: the proxy asks each server a small question every few seconds and stops sending traffic to any that don't answer. Stop the proxy (<kbd>Ctrl</kbd>+<kbd>C</kbd>), restart server B, and save this as a file called `Caddyfile`:

```text
:8410 {
	reverse_proxy localhost:8411 localhost:8412 {
		health_uri /
		health_interval 2s
	}
}
```

Start it with `caddy run --config Caddyfile`, then stop server B again and give the proxy a few seconds to notice:

```console
$ for i in $(seq 1 10); do curl -s -o /dev/null -w "%{http_code} " http://localhost:8410/; done
200 200 200 200 200 200 200 200 200 200
```

Every visitor lands on A. Caddy's log fills up with complaints that `localhost:8412` refused the connection, and when you start B again, it's back in rotation within a couple of seconds. Nobody outside the building noticed a thing. (Caddy can also do *passive* health checks, judging servers by how real requests go instead of by sending test questions. Most load balancers do both.)

You can stop everything now: <kbd>Ctrl</kbd>+<kbd>C</kbd> in each terminal.

Health checks handle a server that's gone. Sometimes the whole back end is in trouble, and then the goal is **graceful degradation**: fail in pieces rather than all at once. A shop can hide its "customers also bought" box and keep the checkout working. A news site can serve a slightly stale cached front page. And when there's nothing left to give, an honest `503 Service Unavailable` with a `Retry-After` header beats a request that hangs for a minute.

## The fastest request is the one you don't answer

Everything so far adds servers. Caching removes work instead: answer once, keep the answer, and hand out copies until it goes stale.

Chapter 1's `curl` output had two headers we skipped. Here they are again:

```console
$ curl -sI https://example.com
HTTP/2 200
date: Sun, 18 Oct 2026 18:27:28 GMT
content-type: text/html; charset=utf-8
server: cloudflare
last-modified: Tue, 13 Oct 2026 20:08:28 GMT
...
age: 11267
cf-cache-status: HIT
cf-ray: a4c998e59e2323bc-ZRH
```

(`-I` sends a `HEAD` request, which asks for the headers without the body.) `age: 11267` says this copy has been sitting in a cache for 11,267 seconds, a little over three hours. `cf-cache-status: HIT` says the cache had it, so the computer that actually owns `example.com` wasn't asked at all. My question was answered by a copy.

The interesting thing missing is a `Cache-Control` header, the server's instructions to caches. Without one, caches fall back on their own rules and guesses (an old page that hasn't changed in a while is probably fine to keep for a bit). Sites that care say what they mean:

```console
$ curl -sI https://www.wikipedia.org
HTTP/2 200
date: Sun, 18 Oct 2026 11:05:32 GMT
cache-control: s-maxage=86400, must-revalidate, max-age=3600
server: ATS/9.2.15
...
age: 26516
x-cache: cp6016 miss, cp6011 hit/280822
```

`max-age=3600` tells your browser it may reuse this page for an hour without asking. `s-maxage=86400` gives *shared* caches, the ones that serve many people, a full day. `must-revalidate` means that once a copy is past its date, it has to be checked before anyone gets it. The `date` is seven hours older than my request, which matches the `age`: I was handed a page made that morning.

`x-cache` shows two layers of Wikipedia's own caches. The first one, `cp6016`, didn't have the page. The second, `cp6011`, did, and by its counter had handed out that same copy 280,822 times.

## Caches all the way down

There's a cache at nearly every step between you and the server:

- **Your browser** keeps copies on your own disk. That's why a site loads faster the second time.
- **A CDN** (more on those in a moment) keeps copies near you, shared by everyone in your region.
- **A reverse proxy** in front of the server can keep copies, so repeated requests never reach the application.
- **The application** can save expensive work, like a finished page or a database result, in memory and reuse it.

Even when a copy goes stale, it doesn't have to be thrown away. The cache can ask the server whether it changed, and if it didn't, the server says so in a few bytes instead of resending everything.

{% try() %}
With `caddy file-server --listen :8401` running again, ask for the headers and note the `Etag`, a fingerprint of the file:

```console
$ curl -sI http://localhost:8401/
```

Then ask again, quoting your own fingerprint (mine is below; yours will differ):

```console
$ curl -sI -H 'If-None-Match: "dm86biu4lckm2a"' http://localhost:8401/
HTTP/1.1 304 Not Modified
Etag: "dm86biu4lckm2a"
Server: Caddy
...
```

That's Chapter 2's `304`: "you already have it". Edit `index.html` and try again; the fingerprint changes and you get a `200` with the new page.
{% end %}

The hard part of caching is not keeping copies, it's knowing when they're wrong. Phil Karlton's line that there are only two hard things in computer science, cache invalidation and naming things, has outlived most of the software written in his era. Static sites have a neat way around it: put a fingerprint in the file name (`style.3f9a1c.css`), tell every cache to keep it for a year, and when the file changes, it gets a new name. Nothing ever needs to be invalidated, because nothing old is ever asked for again.

## Copies all over the world

Look at the end of that `cf-ray` header: `ZRH`. That's the airport code for Zurich, and it's where the copy of `example.com` that answered me lives. Run the command yourself and you'll most likely see a code for an airport near you.

That's a **content delivery network**: a company with servers in hundreds of cities, each keeping cached copies of its customers' sites. It exists because light is fast but not instant. Zurich to Sydney is about 16,500 kilometres in a straight line, light in fibre covers roughly 200,000 kilometres a second, and cables don't run straight. That's well over 160 milliseconds for every round trip, and setting up a new HTTPS connection takes several. An edge server in your own city answers before the far one has heard the question.

How does your request end up at the nearby copy? Partly with the trick from Chapter 3's root servers: thirteen names, more than a thousand machines. A CDN announces the same IP address from all its locations, and the internet's routing delivers you to the closest one. The `104.20.23.154` you saw in Chapter 1 is a different building in Zurich and in Tokyo. (Some CDNs use DNS instead, handing out a different address depending on where the question came from.)

CDNs shine for things that are the same for everyone: images, stylesheets, scripts, video, whole static pages. A page that's different for each visitor still has to come from the origin, the server where the site actually lives, but the CDN can at least hold the connection close to you. Because they sit in front of everything, CDNs also soak up floods of junk traffic that would flatten a single server.

## You probably don't need any of this

Here's the part the cloud brochures leave out. Caddy on my laptop did 39,000 requests a second serving static files. A small rented server will do less, but take a tenth of that, 4,000 a second, and every person in Switzerland could load your page in under forty minutes. For most personal sites, the busiest day ever is a rounding error.

What actually knocks small sites over is rarely static files. It's a page that runs a slow database query for every visitor, or a server program that, like `http.server`, was never meant to face a crowd. So the order of operations is: serve static files where you can, use a proper server, send sensible `Cache-Control` headers, maybe put a CDN in front. Load balancers and health checks are for the day you've measured that one machine isn't enough, and that day may never come.

Which is good news, because one small machine is exactly what you're about to rent.
