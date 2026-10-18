+++
title = "Getting an Answer"
description = "Every reply starts with a three-digit number, and the first digit tells you whose fault it is."
weight = 20
aliases = ["/chapter-2/"]

[extra]
chapter = 2
+++

In Chapter 1 the server said `200 OK` and we moved on. That's what it says nearly all the time, which is exactly why it's boring. The interesting answers are the other ones. Try this:

```console
$ curl -I http://github.com
HTTP/1.1 301 Moved Permanently
Content-Length: 0
Location: https://github.com/
```

That's the entire reply. Three lines. No page, no HTML, not even an apology. GitHub received your request, decided it was asking in the wrong place, and told you where to go instead.

The `-I` flag makes curl send a `HEAD` request instead of `GET`. `HEAD` means "give me the status line and headers, but not the thing itself", which makes it the fastest way to see what a server thinks of a URL without downloading anything. (`-i`, lowercase, sends a normal `GET` and shows the headers *and* the body. You'll use both in this chapter.)

{% try() %}
Ask the same question, but tell curl to follow wherever it's sent with `-L`:

```console
$ curl -sIL http://github.com
```

You'll see two replies stacked on top of each other: the `301` from before, then a second answer from the new address. That second one starts with `HTTP/2 200`. A browser does this hop for you so quickly that you never notice it happened.
{% end %}

## Three digits, five families

That `301` is a **status code**, and the words after it (`Moved Permanently`) are the **reason phrase**. The phrase is there for humans reading logs; programs ignore it and look only at the number. A server could send `301 Bananas` and every browser on earth would still follow the redirect.

The number is three digits, and the first one carries most of the meaning:

```text
1xx   Hold on           informational, the real answer is still coming
2xx   Here you go       it worked
3xx   Try over there    what you want is somewhere else
4xx   You messed up     the problem is with the request
5xx   I messed up       the problem is with the server
```

This is the most useful thing in the chapter. There are dozens of official codes, and you'll meet ones you've never seen before, but you'll always know which family they belong to. If a client receives a code it doesn't recognise, the rules say to treat it like the `x00` of its family: an unknown `471` is handled as a `400`, an unknown `599` as a `500`. So the first digit is not a convention, it's a promise.

The `1xx` family is the one you'll see least. Those are interim messages sent *before* the real answer: `100 Continue` ("go ahead, send the rest of your upload"), `101 Switching Protocols` (used when a page upgrades its connection to a WebSocket), and `103 Early Hints` ("while I think, you could start fetching this stylesheet"). They never stand alone: a real answer from one of the other families follows, except after `101`, where the conversation stops being HTTP altogether.

{% note(title="Why it says HTTP/2 now") %}
When curl talks to an `https://` address, it usually negotiates a newer version of HTTP, and the replies look slightly different: `HTTP/2 302` with no reason phrase, and header names in lowercase. The meaning is identical. Chapter 5 explains what changed; for now, read the number and carry on.
{% end %}

## 2xx: here you go

`200 OK` is the workhorse. It means the request worked and the thing you asked for is in the body. Browsers never show it to you, which is how you know it's doing its job.

Its quieter sibling is `204 No Content`: "it worked, and I have nothing to say about it." Google runs a URL that does nothing else:

```console
$ curl -i http://www.google.com/generate_204
HTTP/1.1 204 No Content
Content-Length: 0
Cross-Origin-Resource-Policy: cross-origin
Date: Sun, 18 Oct 2026 18:25:31 GMT
```

That looks pointless until you learn who uses it. Android phones request a URL like this when they join a Wi-Fi network. If a `204` comes back, the internet is really there. If something else comes back, usually a `200` with a login page, the phone knows it's stuck behind a hotel or airport "please accept our terms" screen and pops that page up for you. A reply with nothing in it turns out to be very informative.

## Not every answer has a body

You might have read somewhere that every HTTP response comes with a body. It doesn't, and you've already seen three counterexamples:

- A reply to a `HEAD` request never has a body. That's the point of `HEAD`.
- A `204 No Content` never has a body. It says so in the name.
- A `304 Not Modified` never has a body, for reasons coming up in a moment.

Plenty of others, like the `301` from GitHub, *could* have one and choose not to. GitHub's said `Content-Length: 0`: here are the headers, and the body is zero bytes long. When a server does include a body with a redirect or an error, it's usually a small HTML page for any human who happens to be looking. The status code is for the machine; the body is for you.

## 3xx: try over there

A redirect is an answer that says "not here" and, in the `Location` header, says where. GitHub's `301` pointed from `http://` to `https://`, which is one of the most common redirects on the web: the site only wants to talk over an encrypted connection (Chapter 7), so it bounces anyone who knocks on the old, unencrypted door.

`301 Moved Permanently` means *update your bookmarks*. Search engines transfer the old address's reputation to the new one, and browsers remember it, sometimes for a very long time. The next time you type the old address, the browser may skip the server entirely and go straight to the new one. (This makes a mistaken `301` surprisingly hard to take back. People who run websites learn this once.)

`302 Found` means *it's over there, for now*. Keep using the old address. Wikipedia has a page that shows a different random article every time, and it can't possibly be a permanent redirect:

```console
$ curl -sI https://en.wikipedia.org/wiki/Special:Random | grep -iE '^(HTTP|location)'
HTTP/2 302
location: //en.wikipedia.org/wiki/Helene_Clarkson
$ curl -sI https://en.wikipedia.org/wiki/Special:Random | grep -iE '^(HTTP|location)'
HTTP/2 302
location: //en.wikipedia.org/wiki/Pakistan_Academy_of_Sciences
```

Same question, same status, different `location` each time. (The `//` at the start means "same scheme you're already using", so the browser fills in `https:`.)

There are two more you'll meet: `307 Temporary Redirect` and `308 Permanent Redirect`. They mean the same as `302` and `301`, with one difference that matters when you're submitting a form: they promise the browser will repeat the request exactly as it was, instead of quietly turning it into a plain `GET`. Chapter 5 is where requests stop being only `GET`.

{% try() %}
Find a redirect chain in the wild. Many sites redirect the bare name to `www.`, or the other way round:

```console
$ curl -sIL http://google.com | grep -iE '^(HTTP|location)'
```

Count the hops. Then try a few sites you use every day. The browser has been following these for you for years.
{% end %}

## 304: you already have it

The strangest-sounding code in the 3xx family isn't a redirect at all. It points you somewhere you've already been: your own cache.

When a browser downloads a page, it keeps a copy. The server's headers said when the page last changed. Here's example.com's:

```console
$ curl -sI http://example.com | grep Last-Modified
Last-Modified: Tue, 13 Oct 2026 20:08:28 GMT
```

Next time, instead of asking for the page again, the browser can ask a conditional question: "send it to me *only if* it has changed since then." You can ask that too, with an extra header:

```console
$ curl -i http://example.com -H 'If-Modified-Since: Tue, 13 Oct 2026 20:08:28 GMT'
HTTP/1.1 304 Not Modified
Date: Sun, 18 Oct 2026 18:25:16 GMT
...
Last-Modified: Tue, 13 Oct 2026 20:08:28 GMT
ETag: "6ace8fbc-241"
...
```

Nothing has changed, so the server says `304` and sends no body at all. The browser uses the copy it already has. On a page this small the saving is a few hundred bytes. On a site with a 2 MB image and a million visitors, it's the difference between sending the image once per visitor and once per visit. (The `ETag` is the server's fingerprint for this exact version; browsers can ask "has it changed since this fingerprint?" instead of using a date. Chapter 8 is all about this.)

{% try() %}
Open DevTools, go to the **Network** tab, and load any site twice. On the second load, look at the **Status** column. Some rows say `304`: the browser asked "has this changed?", the server said "no", and nothing was downloaded. Rows marked "(memory cache)" or "(disk cache)" didn't even ask.
{% end %}

## 4xx: you messed up

A `4xx` means the server is fine and understood you perfectly; the problem is with what you asked. You met the most famous one in Chapter 1:

```console
$ curl -sI http://example.com/this-page-does-not-exist | head -1
HTTP/1.1 404 Not Found
```

`404 Not Found` means there's nothing at that path. Wrong address, typo, a page someone deleted, a link that was right in 2009. It's not the server being broken; it's the server correctly reporting a fact.

`403 Forbidden` is different: "I know what you're asking for, and the answer is no." The Apache web server, by default, refuses to hand out any file whose name starts with `.ht`, because that's where it keeps its own configuration and passwords. Apache's own website follows its own rule:

```console
$ curl -sI https://httpd.apache.org/.htaccess
HTTP/2 403
server: Apache
content-type: text/html; charset=iso-8859-1
...
content-length: 199
```

This is the shisa's code. It stands at the door, it has heard your request, and it is not moving.

Its close cousin is `401 Unauthorized`, which despite its name means *unauthenticated*: "I don't know who you are; log in and try again." A `403` means "I know who you are, and it doesn't help." There's also `400 Bad Request` (the request itself was garbled), `405 Method Not Allowed` (that path exists but doesn't accept that kind of request), and `429 Too Many Requests` (slow down; you'll see this one in Chapter 8).

## When 404 means 403

Here's a subtlety that matters if you ever run a website. A `403` tells the world that *something is there*. Sometimes that alone is a leak.

So servers sometimes lie on purpose. Ask GitHub for a private repository you don't have access to, and it answers `404`, exactly as if the repository didn't exist. If it said `403`, strangers could probe names (`acme/secret-merger-plans`, anyone?) and learn which ones are real. GitHub's API documentation says so plainly: it sends a `404` instead of a `403` "to avoid confirming the existence of private repositories".

It works in the other direction too. Apache's `.ht` rule from above is about the *name*, not the file, so it refuses names that don't exist either:

```console
$ curl -sI https://httpd.apache.org/.htsomethingmadeup | head -1
HTTP/2 403
```

There is no such file. The `403` proves nothing. The lesson for reading status codes: they're the server's claim about what happened, and the server gets to decide what to claim.

## 418: I'm a teapot

On 1 April 1998, the IETF, the body that publishes internet standards, published RFC 2324: the *Hyper Text Coffee Pot Control Protocol*. It describes how to brew coffee over the network, and it defines one status code for a server that is asked to brew coffee but happens to be a teapot: `418 I'm a teapot`.

It was a joke. Programmers loved it, and it ended up in real software. When someone proposed removing it from popular libraries in 2017, people objected loudly enough that it stayed, and the current HTTP standard reserves the number so it can never be given a serious meaning. Google, naturally, has one:

```console
$ curl -si https://www.google.com/teapot | head -1
HTTP/2 418
```

(Ask with `-I` instead and it answers `200`. Apparently the teapot only objects when you actually ask it for something.) Open it in a browser for the full experience. The body is short and stout.

## 5xx: I messed up

A `5xx` means your request was fine and the server failed to answer it. You can't fix these by changing your request; you can only wait, retry, or tell someone. The common ones:

- **`500 Internal Server Error`**: something broke while handling your request. A bug, a crash, a missing file the code expected. It's the server's equivalent of a shrug, and the useful details are in the server's logs, not in the reply.
- **`502 Bad Gateway`**: the server you talked to was a go-between, and the server *behind* it sent back garbage or nothing at all. When a big site goes down, this is often the code you see, because the front door is still standing and the building behind it isn't.
- **`503 Service Unavailable`**: "too busy" or "closed for maintenance". It may come with a `Retry-After` header saying when to try again.
- **`504 Gateway Timeout`**: the go-between waited for the server behind it and eventually gave up.

`502` and `504` only make sense once you know there can be more than one server between you and the answer. That's Chapter 6. `503` is what happens when too many people show up at once, which is Chapter 8.

{% try() %}
You can't easily make a real website fail on command (and please don't try). The test service httpbin.org will return any status you ask for:

```console
$ curl -i https://httpbin.org/status/503
```

Swap `503` for any code from this chapter. And when you only care about the number, ask curl to print nothing else:

```console
$ curl -s -o /dev/null -w '%{http_code}\n' http://example.com/this-page-does-not-exist
404
```
{% end %}

## The number can be wrong

One last thing about status codes: they're only as honest as the server sending them. A common mistake is a site that shows a "Sorry, page not found" message with a status of `200 OK`. A human sees an error page; a search engine sees a perfectly good page that happens to say "not found", and may file it as real content. These are called **soft 404s**, and they're why it's worth checking the status of your own error pages with `curl -I` rather than with your eyes.

The reverse happens too: a `500` page that contains a cheerful illustration and a "we're on it!" message is still a `500`. The machines read the number, the people read the body, and a well-behaved server makes them agree.

So when something on the web goes wrong, read the first line before anything else. The first digit tells you whose problem it is. The next two tell you what kind. Everything below that is detail.
