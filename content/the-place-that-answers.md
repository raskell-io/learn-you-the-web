+++
title = "The Place That Answers"
description = "A server is a program that waits by a numbered door for someone to knock. You're about to run one."
weight = 40
aliases = ["/chapter-3/"]

[extra]
chapter = 4
+++

So far, every answer in this book came from somebody else's computer. Let's fix that. Make a folder, put one file in it, and start a web server:

```console
$ mkdir my-site
$ cd my-site
$ echo '<h1>Hello from my laptop</h1>' > index.html
$ python3 -m http.server 8000
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

The terminal now looks stuck. It isn't. It's waiting, which is the entire job description.

{% try() %}
Leave that terminal alone and open <http://localhost:8000> in your browser. Your page appears. Now look back at the terminal: a new line has shown up for every request your browser made.

No `python3`? It comes with macOS and most Linux distributions. On Windows, install Python from python.org and use `python` or `py` instead of `python3`.
{% end %}

Here's what mine printed after one visit:

```console
::1 - - [18/Oct/2026 20:28:35] "GET / HTTP/1.1" 200 -
::1 - - [18/Oct/2026 20:28:35] code 404, message File not found
::1 - - [18/Oct/2026 20:28:35] "GET /favicon.ico HTTP/1.1" 404 -
```

That middle bit in quotes is the request line from Chapter 1, word for word: `GET`, a path, a version. After it comes the status code the server chose to send back. The `::1` at the start is who was asking (you, more on that in a moment), and the two dashes are blank slots in a log format older than most websites.

The second request (most browsers make it) is your browser, unprompted, asking for `/favicon.ico`: the little icon it would put in the tab. You don't have one, so the server said `404` and the browser shrugged. Browsers have been asking websites for this file, uninvited, since 1999.

Congratulations are not in order, because nothing difficult happened. That's the point. You are now running a web server, and it came free with Python.

## A server is a program, not a box

People say "server" and picture a humming black cabinet. The cabinet is optional. A **server** is a program that opens a connection point, waits for someone to connect, reads a request, and writes a response. The computer it runs on gets called a server too, by association, the way a building gets called a bakery.

Ask your own server something with curl, from a second terminal:

```console
$ curl -v http://localhost:8000/
...
* Connected to localhost (::1) port 8000
> GET / HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.7.1
> Accept: */*
>
< HTTP/1.0 200 OK
< Server: SimpleHTTP/0.6 Python/3.9.6
< Date: Sun, 18 Oct 2026 18:25:13 GMT
< Content-type: text/html
< Content-Length: 30
< Last-Modified: Sun, 18 Oct 2026 18:25:12 GMT
<
<h1>Hello from my laptop</h1>
```

It's the same shape as the exchange with `example.com` in Chapter 1. The `Server:` header is your Python introducing itself. `Content-Length: 30` is the size of your file in bytes (29 characters plus the newline `echo` added). `Last-Modified` is when you created it. Every header there came from looking at a file on your disk.

The server that answers `example.com` is a different program, quite possibly on a different continent, but it does the same four things in the same order. The machines at big companies are faster and more numerous, not different in kind.

## Doors with numbers

Look at the address you typed: `localhost:8000`. That `:8000` is a **port**.

An IP address gets a request to the right computer. But one computer can run many programs that want to receive connections: a web server, a database, a game, the thing your printer uses to talk to your laptop. So each program claims a numbered door, from 1 to 65535, and a connection names both. If the IP address is the building, the port is the door number.

Some doors have conventional numbers, so nobody has to ask:

| Port  | Usually                     |
|-------|-----------------------------|
| `80`  | HTTP                        |
| `443` | HTTPS (Chapter 7)           |
| `22`  | SSH, for logging in remotely |
| `53`  | DNS, from Chapter 3          |

When an address leaves the port out, the scheme fills it in. `http://example.com` means port 80, and `https://example.com` means 443. That's why curl said `Connected to example.com ... port 80` in Chapter 1 without being asked, and why `http://example.com:80/` gets you exactly the same page.

We picked 8000 because it's out of the way. On Linux, ports below 1024 traditionally need administrator rights, and port 80 may already be taken by something else on your machine anyway. Speaking of which:

{% try() %}
Leave your server running and try to start a second one on the same port, from another terminal in the same folder:

```console
$ python3 -m http.server 8000
...
OSError: [Errno 48] Address already in use
```

One door, one program. (The error number differs between systems; the message doesn't.) To see who's holding a port on macOS or Linux, ask `lsof -nP -iTCP:8000 -sTCP:LISTEN`.
{% end %}

Knocking on a door where nobody's listening goes one of two ways. On your own machine, the answer comes back instantly: curl says `Couldn't connect to server`, because your operating system knows nobody is there and says so. Out on the internet, a firewall often throws such knocks away without a word, and curl stands outside trying different addresses until it gives up:

```console
$ curl -v --max-time 4 http://example.com:8201/
...
*   Trying 104.20.23.154:8201...
* ipv4 connect timeout after 1898ms, move on!
...
* Connection timed out after 4006 milliseconds
```

A refusal is fast and a silence is slow, which is a useful thing to know at 2 a.m. when something hangs.

## The name for yourself

`localhost` is the name every computer has for itself. You saw it in `/etc/hosts` in Chapter 3, mapped to `127.0.0.1`, and your computer checks that file before asking DNS. So this request never touched the network: it went out of your browser, turned around inside your operating system, and came back in to Python.

The `::1` in the log is the IPv6 spelling of the same idea. Your machine tried IPv6 first, and Python was listening there too.

That raises a question worth asking about any server: listening *where*? The startup line said `Serving HTTP on ::`, and `::` means "every address this machine has". That includes the one your Wi-Fi router gave it. Unless a firewall stops them, anyone on the same network who knows your laptop's address can read your folder right now. For experiments, keep the door on the inside:

```console
$ python3 -m http.server 8000 --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

Now only programs on your own machine can reach it.

## Asking for the front door

You asked for `/` and got a file called `index.html`. You never mentioned `index.html`. The server decided.

This is a convention, not a law. When a request's path points at a folder, many servers look inside for a file named `index.html` and send that. If there isn't one, they either refuse or, like Python's, generate a page listing what's in the folder.

{% try() %}
Make an empty subfolder and ask for it:

```console
$ mkdir drafts
$ curl http://localhost:8000/drafts/
...
<title>Directory listing for /drafts/</title>
...
```

That page doesn't exist on your disk. The server wrote it on the spot. Rename your `index.html` and reload `/` in the browser to see the same thing happen to your homepage. (Rename it back afterwards.)
{% end %}

This is why you'll see `index.html` everywhere, and also why "the URL path is a file path" is only true when the server feels like it. A path is a question. The server is free to answer it with a file, a folder listing, a redirect, a page it builds from a database, or a `404`. Your browser can't tell which, and doesn't need to.

## Files, or made to order

That distinction has names. A **static** server hands out files that already exist: what's on disk is what you get, and everyone asking for `/` gets the same bytes. Your Python server is static, apart from those folder listings. So are a lot of real websites, including this book: it's a folder of HTML files that a program generated once, before you ever arrived.

A **dynamic** server runs code for each request and builds the answer then and there. A search results page, your inbox, a shopping basket: none of these exist as files anywhere. The server receives `GET /search?q=tanuki`, asks a database, assembles some HTML, and sends it. To the browser, the response looks identical to a static one. Same status line, same headers, same body. The difference is entirely on the server's side of the door.

Static is fast, cheap, and hard to break, because there's nothing to run. Dynamic is how anything personal or up-to-the-second works. Most big sites are a mix: dynamic pages that pull in static images, scripts and stylesheets.

## Where servers live

Anywhere a computer can stay switched on and connected.

Yours lives on your laptop and dies when you close the lid. In the early web, plenty of sites lived on a desktop machine in a university closet, and some still live under someone's desk, in what hobbyists call a home lab. Most of the web lives in **data centres**: buildings full of racks of computers, with backup power, several internet connections, and enough air conditioning to chill a small town.

"The cloud" is those same data centres, rented by the hour instead of owned. When a site "runs in the cloud", it runs on someone else's computer, which you can rent for an afternoon or a decade. The program inside behaves exactly like the one in your terminal. It waits, it reads, it answers.

## Every request is a stranger

Load your page a few times and watch the log. Each line is complete in itself. The server read a request, answered it, and forgot about it. It has no idea that the request for `/favicon.ico` came from the same browser that asked for `/` a millisecond earlier, and it doesn't care.

This is called being **stateless**: each request carries everything the server needs to answer it, and nothing carries over to the next one. It sounds like a limitation, and it is one of the best decisions in the web's design. Because no request depends on the last, any copy of a server can answer any request. That's how a big site spreads its traffic across hundreds of identical machines (Chapter 8), and it's why a server can crash, restart, and carry on without anyone noticing.

So how does a website remember that you're logged in? The server hands your browser a small token called a **cookie**, and your browser attaches it to every later request, so each request still carries everything needed, including who you are. You'll see the headers that do this in the next chapter.

The other thing a plain HTTP server never does is start a conversation. It can't push a page at you or wonder where you went. It sits by its door and waits for a knock. Everything happens because a client asked.

{% try() %}
Stop your server with <kbd>Ctrl</kbd>+<kbd>C</kbd> in its terminal, then reload the page in your browser. The site is gone. Nothing was wrong with the files; nobody was at the door.
{% end %}

## What it was listening for

Look at that log line one more time: `"GET / HTTP/1.1" 200`. Your browser and a Python module, written by strangers who never met, agreed on every character of that exchange. That's because both were speaking the same language, and it's a language simple enough that you can type it with your own fingers. Next chapter, you will.
