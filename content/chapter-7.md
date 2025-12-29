+++
title = "When Things Get Busy"
description = "How the web handles crowds: more servers, smart routing, and caching."
weight = 8
draft = true
+++

> **Metaphor:** A busy café or post office
> **Mental image:** "More helpers, same rules."

---

This chapter addresses scale — what happens when many people want the same thing at the same time.

## One Server Has Limits

- Like one librarian can only help so many people at once
- CPU, memory, network bandwidth — all finite
- At some point, requests start waiting or failing

## The Solution Isn't Magic — It's Multiplication

- Run more than one server
- Each handles a portion of the requests
- The rules don't change, just the number of workers

## Load Balancing: The Traffic Director

- A load balancer distributes incoming requests across servers
- Round-robin, least connections, or smarter algorithms
- This is often what a reverse proxy does (revisit Chapter 5)

## Horizontal vs. Vertical Scaling

- **Vertical:** make one server bigger (more RAM, faster CPU)
- **Horizontal:** add more servers
- Horizontal is usually more resilient and cost-effective at scale

## Caching: Answering Without Asking

- Some responses don't change often
- Cache them at the edge (CDN, reverse proxy)
- Serve the cached copy instead of bothering the origin server
- Metaphor: photocopying popular books instead of fetching from the archive each time

## CDNs: Servers Closer to You

- Content Delivery Networks: copies of your content distributed globally
- When you request a page, you get it from a server nearby
- Faster responses, less load on the origin

## Resilience: What if One Server Fails?

- With multiple servers, one can fail and the others continue
- Health checks: the load balancer pings servers to ensure they're alive
- Graceful degradation vs. total outage

---

### Tone for this chapter

Practical and demystifying. Scale shouldn't sound like a problem only "big tech" faces. Even small sites benefit from understanding these concepts. The metaphors (café, post office) should keep it grounded.

---

### Bridge to Chapter 8

We've covered how the web works at scale. But what about *your* corner of it? The final chapter brings it back to the reader — running and owning your own piece of the web.

---

*Status: Work in progress*
