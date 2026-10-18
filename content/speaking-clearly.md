+++
title = "Speaking Clearly"
description = "HTTP is a language simple enough to type by hand, so let's type some."
weight = 50
aliases = ["/chapter-4/"]

[extra]
chapter = 5
+++

You've read HTTP. Now you're going to write it, by hand, to a real server on the internet, with no browser and no curl to do the talking for you.

The tool is `nc` (netcat), which opens a connection to a port and then gets out of the way: whatever you type goes down the wire, and whatever comes back gets printed. It doesn't know anything about HTTP. That part is your job.

{% try() %}
Run this, then type the three lines below it exactly, pressing Enter after each. The last line is empty: press Enter a second time.

```console
$ nc example.com 80
GET / HTTP/1.1
Host: example.com
Connection: close

```

Type promptly. A server waiting for you to finish your sentence will only wait so long. On Windows, `nc` isn't built in; use WSL, or read along.
{% end %}

Here's what came back for me, trimmed:

```console
HTTP/1.1 200 OK
Date: Sun, 18 Oct 2026 18:25:40 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: close
Server: cloudflare
Last-Modified: Tue, 13 Oct 2026 20:08:28 GMT
...
alt-svc: h3=":443"; ma=86400

241
<!doctype html><html lang=en><head><meta charset=utf-8>...</html>

0
```

You spoke HTTP to a machine you've never met, and it understood you. Apart from the connection `nc` opened, nothing was sent that you didn't type. Those three lines were the whole request.

Two odd things in the answer. `Transfer-Encoding: chunked` means the server is sending the body in pieces, each one preceded by its size in hexadecimal: `241` is 577 bytes, which is exactly the size of the page, and the `0` at the end means "no more chunks". And `Connection: close` is the server agreeing to your request to hang up afterwards. Without it, HTTP/1.1 keeps the connection open in case you want something else, and `nc` would sit there with you until the server got bored.

## The fine print about line endings

HTTP's rulebook says every line ends with two invisible characters: a carriage return and a line feed, written `\r\n`. It's a habit inherited from teletypes, where one character moved the print head back to the left and another moved the paper up. Your Enter key only sends `\n`. Most servers forgive this, which is why your typed request worked, but a strict one is within its rights not to.

To send the proper endings, give `nc` a flag (`-c` on macOS, `-C` on most Linux versions), or write the whole request with `printf`, which turns `\r\n` into the real characters:

```console
$ (printf 'GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n'; sleep 2) | nc example.com 80
HTTP/1.1 200 OK
...
```

The `sleep 2` is there because some versions of `nc` hang up the moment their input runs out, before the answer has had time to arrive. The parentheses keep the input open for two more seconds.

## Leaving things out

Since you're the one typing, you can also get it wrong on purpose. Drop the `Host` line:

```console
$ (printf 'GET / HTTP/1.1\r\nConnection: close\r\n\r\n'; sleep 2) | nc example.com 80
HTTP/1.1 400 Bad Request
Server: cloudflare
...
```

`400` means "I couldn't make sense of that", and here the server is right: HTTP/1.1 makes `Host` mandatory, because the machine answering for `example.com` answers for an enormous number of other names too. Without `Host`, it has no idea which site you're knocking for.

Your own server from Chapter 4 is more forgiving. Start it again (`python3 -m http.server 8000` in your `my-site` folder) and talk to it directly:

```console
$ printf 'GET / HTTP/1.1\r\n\r\n' | nc localhost 8000
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.9.6
Date: Sun, 18 Oct 2026 18:25:28 GMT
Content-type: text/html
Content-Length: 30
Last-Modified: Sun, 18 Oct 2026 18:25:12 GMT

<h1>Hello from my laptop</h1>
```

No `Host`, no complaint. It only serves one site, so it never needed to ask. (Notice it answers in `HTTP/1.0`, an older version that closes the connection after every response. That's also why the `sleep` wasn't needed this time.)

{% try() %}
Ask your server to do something it's never heard of:

```console
$ printf 'BREW / HTTP/1.1\r\n\r\n' | nc localhost 8000
HTTP/1.0 501 Unsupported method ('BREW')
...
```

And for a trip back to 1991, send `GET /` with no version at all: `printf 'GET /\r\n\r\n' | nc localhost 8000`. You get the body with no status line and no headers. That's HTTP/0.9, the first version, which had exactly one method and no headers, and Python still speaks it.
{% end %}

## Why text

A **protocol** is an agreement about what bytes to send, in what order, and what they mean. HTTP is the agreement the web runs on, and you've now seen almost all of its grammar: a request line, some headers, a blank line, maybe a body; then a status line, some headers, a blank line, a body.

It's plain text because Tim Berners-Lee made it that way from the start, and that choice has paid off ever since. Anyone can read it, as you have. Anyone can write a program that speaks it, in any language, on any machine. When something breaks, you can look at the actual bytes and see what went wrong. Your browser, your Python server and Cloudflare's machines were all written by different people who never talked to each other, and they interoperate because they all read the same few documents.

## Verbs

The first word of a request is the **method**. You've used `GET`. There are a handful more, and each one promises something about what it does:

| Method   | Means                                | Safe | Idempotent |
|----------|--------------------------------------|------|------------|
| `GET`    | Give me this                         | yes  | yes        |
| `HEAD`   | Same as GET, but headers only        | yes  | yes        |
| `POST`   | Here's some data, do something with it | no | no         |
| `PUT`    | Store this, replacing what's there   | no   | yes        |
| `PATCH`  | Change part of this                  | no   | not necessarily |
| `DELETE` | Remove this                          | no   | yes        |

**Safe** means asking doesn't change anything on the server. You can `GET` a page a thousand times and the page is no different afterwards (the server may count your visits, but it's not supposed to change anything that matters to you). **Idempotent** means doing it twice has the same effect as doing it once. Deleting a thing twice still leaves you with one deleted thing. `PUT` the same file twice and you've stored that file. `POST` an order twice and you may have two orders.

These promises are why your browser asks "Confirm form resubmission?" when you reload a page you got by submitting a form: it was a `POST`, and the browser has no way to know whether repeating it is harmless. They're also why a server should never delete anything in response to a `GET`. Programs assume GET is safe and follow links freely. In 2005, Google's Web Accelerator started prefetching every link on the pages its users visited, and web apps whose "delete" buttons were plain links found out what that means.

`HEAD` is what `curl -I` sends, which you met in Chapter 2. It's how you ask "how big is it, and when did it change?" without downloading the thing.

## Sending something

`GET` carries nothing but the request. When you submit a form, the data goes in a **body** after the blank line, usually with `POST`. `curl -d` sends one. The test service httpbin.org will echo back whatever it receives:

```console
$ curl -v -d 'name=tanuki&snack=dumplings' http://httpbin.org/post
> POST /post HTTP/1.1
> Host: httpbin.org
> User-Agent: curl/8.7.1
> Accept: */*
> Content-Length: 27
> Content-Type: application/x-www-form-urlencoded
>
< HTTP/1.1 200 OK
< Content-Type: application/json
...
{
  ...
  "form": {
    "name": "tanuki",
    "snack": "dumplings"
  },
  ...
}
```

Giving curl a body made it switch to `POST` on its own, and add two headers. `Content-Type` says what format the body is in: `application/x-www-form-urlencoded` is the format HTML forms use, `name=value` pairs joined by `&`. `Content-Length: 27` is the body's size in bytes. Count the characters in `name=tanuki&snack=dumplings` if you don't believe it.

`Content-Length` is how the other side knows where the body ends. There's no closing marker; the reader counts bytes (or, with `chunked`, reads one counted piece at a time). Get the number wrong and the server either waits forever for bytes that aren't coming or cuts your message short.

Your Python server, by the way, only knows `GET` and `HEAD`. Send it a POST with `curl -d hello http://localhost:8000/` and it answers `501 Unsupported method ('POST')`. Accepting data means deciding what to do with it, and a file server has no opinion.

## Headers worth knowing

There are dozens of standard headers and countless unofficial ones. These are the ones you'll meet every day:

| Header           | Sent by  | Says |
|------------------|----------|------|
| `Host`           | client   | Which site you want (required in HTTP/1.1) |
| `User-Agent`     | client   | Which program is asking |
| `Accept`         | client   | Which formats it would like back |
| `Cookie`         | client   | Tokens the server asked it to keep |
| `Content-Type`   | both     | What format the body is in |
| `Content-Length` | both     | How many bytes the body has |
| `Cache-Control`  | mostly server | How long the answer may be reused |
| `Set-Cookie`     | server   | "Keep this and send it back next time" |
| `Location`       | server   | Where to go instead (with a redirect) |

Header names are case-insensitive: `Content-type` from Python and `Content-Type` from Cloudflare mean the same thing.

The last chapter promised you the mechanism that lets a stateless server remember you. Here it is in one exchange:

```console
$ curl -i 'http://httpbin.org/cookies/set?flavour=matcha'
HTTP/1.1 302 FOUND
...
Location: /cookies
Set-Cookie: flavour=matcha; Path=/
...
```

The server says two things at once. `Set-Cookie` asks the client to remember `flavour=matcha` and send it back with every request to this site. `Location` with a `302` says "now go to `/cookies`". A browser would do both without asking you. Curl does neither unless told to.

{% try() %}
Give curl a file to keep cookies in (`-c` to save, `-b` to send) and tell it to follow redirects (`-L`):

```console
$ curl -c jar.txt -b jar.txt -L 'http://httpbin.org/cookies/set?flavour=matcha'
{
  "cookies": {
    "flavour": "matcha"
  }
}
```

The second request, to `/cookies`, carried a `Cookie: flavour=matcha` header, and the server read it back to you. That's every "remember me" checkbox on the web. Look inside `jar.txt` afterwards.
{% end %}

`Cache-Control` decides whether a response can be reused without asking again. `Cache-Control: max-age=60` means "this is good for 60 seconds". It's the HTTP cousin of DNS's TTL from Chapter 3, and it'll matter a lot in Chapter 8.

## HTTP/2 and HTTP/3

Ask for the same page over HTTPS and look at the first lines:

```console
$ curl -v https://example.com -o /dev/null
...
> GET / HTTP/2
> Host: example.com
...
< HTTP/2 200
< date: Sun, 18 Oct 2026 18:26:44 GMT
< content-type: text/html; charset=utf-8
< server: cloudflare
...
```

Same method, same path, same headers, same status code, though the header names are now all lowercase. What curl printed is a translation. On the wire, HTTP/2 isn't text at all: it's binary, chopped into small labelled frames, with headers compressed. That makes it impossible to type into `nc`, and much better at one thing: carrying many requests and responses over one connection at the same time, interleaved, instead of one after another. For a page that needs forty files, that's a big deal.

HTTP/3 keeps the same idea and moves it onto a new transport called QUIC, which runs over UDP instead of TCP and copes better with lost packets and flaky mobile connections. Remember the `alt-svc: h3=":443"` header in the reply to your hand-typed request? That was the server mentioning, in passing, that it also speaks HTTP/3 on port 443, should your client care to switch.

The versions differ in packaging, not in meaning. Methods, headers, status codes, cookies and caching all work the same in all three. Everything you typed by hand in this chapter is still what's being said; it's only the envelope that changed.

## Out in the open

One more thing about your hand-typed request: every byte of it crossed the internet as readable text. Your Wi-Fi, your provider, and every network in between could read it as easily as you did. That's fine for `example.com`. It's less fine for a password.

There's also an assumption we've been making all along: that the program answering is the server itself. Often it isn't. Remember `Server: cloudflare`. Someone usually stands at the door, and the next chapter is about who.
