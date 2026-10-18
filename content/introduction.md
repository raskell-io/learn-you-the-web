+++
title = "Introduction"
description = "In 1989 a physicist wanted to find his colleagues' notes. The rest of us got the web."
weight = 1

[extra]
kicker = "Before we begin"
+++

In March 1989, Tim Berners-Lee, a computer scientist at CERN, handed his boss a proposal called *Information Management: A Proposal*. His boss, Mike Sendall, read it and wrote three words across the top: "Vague but exciting". Then he let him build it anyway, which may be the best-value management decision ever made.

The problem Berners-Lee wanted to solve was not glamorous. CERN was full of brilliant people from dozens of countries, using every kind of computer ever sold, each with its own way of storing files. People joined a project, wrote things down, and left. Their notes stayed behind on machines nobody could find, in formats nobody could read. The laboratory was forgetting things faster than it learned them.

## The modest idea

He didn't propose to replace everyone's computers or make them agree on a filing system. He proposed two small things.

First, documents should be able to point at other documents, anywhere, with a link. Second, there should be a protocol so simple that any computer could implement it in an afternoon: one machine asks for a document by name, the other sends it back. The very first version of that protocol was a single line of text, `GET` followed by the document you wanted. The server replied with the document and hung up.

By the end of 1990 the first web server was running on a NeXT computer in his office, with a handwritten label stuck to it: "This machine is a server. DO NOT POWER IT DOWN!!". In 1993 CERN put the software in the public domain. No licence fee, no permission needed, no company to ask. That turned out to matter more than anything technical. Anyone could run a server, anyone could write a browser, and so, within a few years, everyone did.

{% try() %}
The first website is still online. Open this in your browser:

[http://info.cern.ch](http://info.cern.ch)

Click through to "Browse the first website". It's a restored copy from 1992: grey, plain, and almost entirely links. It's also a page that any browser made in the last thirty years can still open, which is not something you can say about many 1992 file formats.
{% end %}

## How it got far away

The web succeeded, and success brought crowds. Crowds brought new problems, and every problem got a sensible fix. Conversations needed privacy, so encryption was added. Popular sites needed to serve millions of people, so caches and load balancers moved in between you and them. Some doors needed locks, some needed guards, and some needed a guard standing in front of a guard.

Each layer earned its place. But layers hide the thing they were built around. Today "put a website online" sounds like a job for a specialist, and the vocabulary has drifted from *pages* and *links* to *edge*, *origin*, *ingress* and *zero-trust posture*. The original exchange is still in there, one machine asking and another answering. You can't see it anymore.

## What this book does

This book peels the layers back one at a time and has you poke each one with your own hands. You'll ask a server for a page and read its reply line by line. You'll learn what the server's numbers mean, follow a name like `example.com` down a tree of servers to the number behind it, run a web server on your own laptop, put a guard at its door, give it a lock and key, and watch what happens when a lot of people show up at once. At the end, you'll put a real site on the real internet.

Every chapter has you run something within the first screen or two, and then explains what you just saw. The explanations are short. The commands are real, and the output you'll see in this book came from running them.

You need two things: a **terminal** and a **web browser**. That's all. The tools we use (`curl`, `dig`, Python, a few others) either ship with your computer already or are one install command away, and all of them are free. You don't need to know how to program. You do need to be willing to type things and see what happens.

Underneath every layer we're about to take apart, the web still does what it did in 1990 on that NeXT box with the sticker: one computer asks another for something, and gets an answer. So let's ask.
