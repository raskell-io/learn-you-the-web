+++
title = "Standing at the Door"
description = "A reverse proxy receives requests on behalf of your server, deciding what gets through."
weight = 6

+++

So far, our picture of the web has been a two-party conversation. A browser asks, a server answers. One side of the desk, the other side of the desk. The customer walks in, the shopkeeper helps them, the customer leaves. Clean, simple, direct.

But imagine you're running a popular shop. Not just a quiet corner store anymore — business is picking up. More and more customers are arriving every day. Some are regulars, some are new, and some... well, some you'd rather not deal with. A few are trying to shoplift. A few are asking for things you moved to a different location months ago. And during peak hours, the line is so long that everyone's getting frustrated, including you.

At some point, it makes sense to put someone at the door. Not a bouncer with crossed arms and a scowl — more like a friendly, competent receptionist. Someone who greets visitors, checks that they're heading to the right place, turns away the obviously problematic ones, and keeps the flow moving smoothly so you can focus on doing what you do best: serving your customers.

On the web, that someone at the door is called a *reverse proxy*. And once you understand what it does and why it exists, you'll start to see it everywhere.

## Not Every Request Should Go Straight to the Server

In the simple model we've been building, every request from the internet goes directly to the server. Browser sends request, server receives it, server sends response. No middlemen, no intermediaries — just a straight line from asker to answerer.

This works perfectly well for small, low-traffic websites. If you're running a personal blog that gets a handful of visitors a day, there's no reason to complicate things. The server can handle everything on its own, and adding anything between the browser and the server would just be unnecessary overhead.

But as a website grows — in traffic, in complexity, in importance — the direct model starts to show its limits. Not because there's anything wrong with the model itself, but because the server is being asked to do too many different things at once. It's not just answering requests for pages anymore. It's also fending off malicious traffic, managing encryption, deciding how to route requests to different parts of the application, and trying to stay responsive under increasing load. That's a lot of hats for one program to wear.

This is where the idea of an intermediary becomes useful. Instead of having every request hit your server directly, you put something in front of the server — a program that receives requests first, does some initial processing, and then either forwards the request to the server or handles it on its own. The server still does the core work of preparing responses, but it's shielded from a lot of the noise and complexity that comes with being directly exposed to the internet.

This isn't about paranoia or distrust. It's practical. Think of it as the difference between a small café where the owner takes orders, makes coffee, handles complaints, and sweeps the floor, versus a slightly larger operation where a front-of-house person handles the counter while the barista focuses on making excellent coffee. The barista hasn't been replaced — they've been supported. The front-of-house person is there to make everyone's life easier, including the customers'.

## What is a Reverse Proxy?

A reverse proxy is a program that sits between the internet and your server (or servers). When a request arrives from a browser, it goes to the reverse proxy first. The reverse proxy examines the request, decides what to do with it, and then — in most cases — forwards it to the actual server behind the scenes. When the server sends back a response, the reverse proxy receives it, possibly does some additional processing, and sends it along to the browser.

From the browser's perspective, the reverse proxy *is* the server. The browser doesn't know (and doesn't need to know) that there's another program behind the reverse proxy doing the real work. As far as the browser is concerned, it sent a request to a certain address, and it got a response back from that address. The reverse proxy is invisible to the outside world — it presents itself as the destination, while quietly coordinating with the actual server behind the curtain.

The word "reverse" in "reverse proxy" distinguishes it from a regular (or "forward") proxy, which is a different concept. A forward proxy sits in front of the *client* — it's something you install on your side to route your own requests through an intermediary. A VPN is a kind of forward proxy: it handles your outgoing traffic before it reaches the wider internet. A reverse proxy, by contrast, sits in front of the *server*. It handles incoming traffic before it reaches the server. The "reverse" just means it's on the other side of the conversation.

Don't worry too much about the terminology. The important thing is the role: a reverse proxy is a helpful program that stands at the door of your server, managing incoming traffic so the server doesn't have to deal with everything itself.

### How It Actually Works

Let's walk through the sequence concretely. Say your website is hosted at `www.example.com`, and you have a reverse proxy set up in front of your server.

1. A browser somewhere in the world sends a request: "GET /about.html from www.example.com."
2. That request arrives at the reverse proxy — because the DNS record for www.example.com points to the reverse proxy's address, not directly to the server.
3. The reverse proxy receives the request and examines it. Is it well-formed? Is it coming from a suspicious source? Is it asking for something the proxy can handle on its own?
4. Assuming everything looks fine, the reverse proxy forwards the request to the actual web server, which might be running on a different port on the same machine, or on a completely different machine in the same network.
5. The web server processes the request normally — finds the file, generates the page, whatever it needs to do — and sends its response back to the reverse proxy.
6. The reverse proxy receives the response, possibly adds or modifies some headers, and sends it along to the browser.
7. The browser receives the response and displays the page. It has no idea a reverse proxy was involved.

The whole process adds a tiny amount of time (the request made an extra stop), but the benefits — which we're about to discuss — usually far outweigh that small cost.

## The Doorman Metaphor

Let's make this tangible with a metaphor that fits the role perfectly: a doorman at an apartment building.

Imagine a nice apartment building with a doorman stationed at the entrance. Residents live upstairs, going about their business. Visitors arrive at the front door throughout the day — friends, delivery drivers, postal workers, the occasional stranger who's lost, and once in a while, someone with bad intentions.

The doorman's job is to manage this flow. When a friend of a resident arrives, the doorman greets them, maybe checks a list, and buzzes them through. When a delivery arrives, the doorman might accept the package and hold it for the resident, rather than sending the delivery driver up to their apartment. When someone shows up who clearly doesn't belong — maybe they're trying doors at random, or they're being aggressive — the doorman turns them away at the entrance, before they ever reach the building's interior.

The doorman doesn't *own* the building. They don't live in the apartments. They don't make the meals or do the laundry. Their role is specific and well-defined: manage who comes in, make sure things flow smoothly, and protect the building's residents from having to deal with every single person who walks up to the front door.

A reverse proxy is this doorman.

The residents are your servers — the programs actually doing the work of preparing and serving web content. The visitors are the incoming requests from browsers all over the internet. And the doorman — the reverse proxy — sits at the entrance, managing the flow so the residents can focus on their lives in peace.

Some visitors get waved through immediately. Some get redirected ("Oh, you're looking for the other entrance — let me point you there"). Some get turned away ("Sorry, you're not on the list"). And some are handled entirely at the door — the doorman accepts a package without ever buzzing upstairs, because the resident already said "Just leave deliveries with the front desk."

This metaphor captures something important about the reverse proxy's character: it's not adversarial. It's not there to make life harder for visitors. It's there to make life easier for everyone — visitors get directed to the right place more efficiently, and the servers behind the proxy get to focus on their actual job without being overwhelmed by the raw chaos of unfiltered internet traffic.

## Why You Might Want One

Now that we know what a reverse proxy is and how it works, let's look at the specific reasons you'd want one. There are several, and they tend to compound — most people who set up a reverse proxy end up using it for multiple purposes simultaneously.

### Security: A Shield for Your Server

The internet is a big, busy, occasionally hostile place. If your web server is directly exposed to the internet, every request — good, bad, or malicious — hits it directly. Automated bots scanning for vulnerabilities, scripts trying common attack patterns, floods of junk traffic designed to overwhelm your server — all of this arrives at your server's doorstep, and your server has to deal with every bit of it while also trying to serve legitimate visitors.

A reverse proxy acts as a shield. Because it sits in front of the server, it can inspect incoming requests and filter out the obviously bad ones before they ever reach the server. Requests with known attack patterns can be blocked. Traffic from suspicious sources can be rate-limited or rejected. Malformed requests that don't follow HTTP rules properly can be dropped. The server never sees any of this — it only receives the requests that the reverse proxy has already vetted.

Think of it as the doorman recognizing known troublemakers and turning them away before they can even knock on your apartment door. The residents don't need to know about every person who tried to get in and was stopped. They just go about their day, undisturbed.

This is particularly valuable because your web server's primary job is to serve web content, not to be a security guard. Most web servers can be configured with basic security measures, but they're not specialized for it. A reverse proxy, on the other hand, can be configured specifically for security — with rules, filters, and rate limits that are tailored to protecting the applications behind it.

### Load Balancing: Sharing the Work

Remember our shopkeeper from Chapter 3, who could serve many customers at once but eventually had a breaking point? What if, instead of one shopkeeper, you had three? And what if someone at the door directed each incoming customer to whichever shopkeeper currently had the shortest line?

That's load balancing, and it's one of the most common uses of a reverse proxy.

When a website gets too much traffic for a single server to handle, the solution is often to run multiple servers, each capable of handling requests independently. But the browsers don't know about these multiple servers — they just know the website's address. So something needs to sit at that address, receive the incoming requests, and distribute them across the available servers. That something is the reverse proxy.

The reverse proxy accepts each incoming request and forwards it to one of the servers behind it, choosing based on some strategy — maybe round-robin (take turns), maybe "least connections" (send it to whichever server is currently least busy), maybe geographic proximity (send it to the nearest server). The browser never knows there are multiple servers; it just sees fast responses, because the load is being shared.

We'll talk more about scaling and load balancing in Chapter 7, but the reverse proxy is the piece that makes it possible. It's the traffic director at a busy intersection, keeping everything moving by distributing the flow.

### Caching: Answering Without Asking

Here's a clever trick that reverse proxies are particularly good at: caching.

Imagine our doorman at the apartment building. Every day, dozens of visitors come by asking for the same thing — say, a copy of the building's visitor policy. The first time someone asks, the doorman buzzes the manager upstairs, who sends down a copy. But the doorman, being smart, keeps a copy at the desk. The next time someone asks for the visitor policy, the doorman just hands them the copy — no need to bother the manager again. If the policy changes, the manager sends down an updated version, and the doorman replaces their copy. But for as long as the policy stays the same, the doorman can handle these requests instantly, without involving anyone else.

A reverse proxy does the same thing with web content. When it forwards a request to the server and gets a response, it can store a copy of that response. The next time a browser asks for the same thing, the reverse proxy can serve the cached copy directly, without forwarding the request to the server at all. The server doesn't even know the request happened — it's handled entirely at the proxy level.

This is especially effective for content that doesn't change often: images, stylesheets, JavaScript files, and even entire pages on static websites. The server builds the response once, the proxy caches it, and from then on, the proxy serves it at lightning speed to anyone who asks. The server's workload drops dramatically, and visitors get faster responses. Everyone wins.

Of course, caching has to be managed carefully. You don't want the proxy serving stale content when the server has been updated. That's why HTTP includes cache-control headers (remember those from Chapter 4?) — the server can tell the proxy how long to keep a cached copy, when to check for updates, and when not to cache at all. It's a cooperative system: the server sets the rules, and the proxy follows them.

### TLS Termination: Handling Encryption at the Edge

This one is a preview of the next chapter, where we'll talk about HTTPS and encryption in detail. But it's worth mentioning here because it's one of the most practical reasons people use reverse proxies.

When your website uses HTTPS (which most websites do today, and should), every conversation between the browser and the server is encrypted. That encryption has to be set up and managed by something — and that something is often the reverse proxy rather than the web server itself.

The reverse proxy handles the encryption on the internet-facing side: it establishes the secure connection with the browser, decrypts the incoming request, and then forwards the plain (unencrypted) request to the server over a trusted internal network. When the server responds, the reverse proxy encrypts the response before sending it back to the browser. This is called "TLS termination" — the encrypted connection terminates (ends) at the proxy.

Why is this useful? Because managing encryption certificates, keeping up with security standards, and handling the computational overhead of encryption are all tasks that the reverse proxy can specialize in, freeing the server to focus purely on generating content. It's the doorman handling the security checkpoint so the residents don't need to install their own locks on the building entrance.

We'll explore this more in the next chapter. For now, just know that the reverse proxy is often the one responsible for the padlock icon you see in your browser's address bar.

### Routing: Directing Traffic to the Right Place

One more common role for a reverse proxy: routing requests to different servers based on what's being asked for.

Imagine a large office building with multiple businesses inside. The receptionist at the front desk doesn't just let visitors wander the halls — they ask who you're here to see and direct you to the right floor. "Looking for the accounting firm? Third floor. Here for the dentist? Second floor, turn left."

A reverse proxy can do the same thing for a website. If your site has different components — maybe the main website is one application, the blog is another, and the API is a third — the reverse proxy can look at the incoming request's path and route it to the appropriate server. Requests for `/blog/` go to the blog server. Requests for `/api/` go to the API server. Everything else goes to the main web server. From the outside, it all looks like one seamless website, but behind the scenes, multiple specialized servers are each handling their part.

This is incredibly useful as applications grow more complex. Instead of one monolithic server trying to do everything, you can break your application into pieces, each running on its own server, with the reverse proxy acting as the single point of entry that ties them all together.

## Common Reverse Proxies

If you're wondering what actual reverse proxy software looks like, there are several well-known options, each with its own personality and strengths. You don't need to memorize these — this is just to give you a sense of the landscape.

**Nginx** (pronounced "engine-x") is probably the most widely used reverse proxy in the world. Originally built as a web server designed to handle enormous amounts of traffic efficiently, Nginx quickly became popular as a reverse proxy too. It's fast, reliable, battle-tested, and has been running in front of some of the busiest websites on the internet for years. Its configuration can be a bit terse and intimidating at first, but there's a massive community around it and no shortage of guides. If you hear someone talking about reverse proxies, there's a good chance Nginx is what they're using.

**Caddy** is a newer option that's gained a lot of fans for its simplicity. Where Nginx requires you to configure things like HTTPS certificates manually (or at least set up a separate tool to handle it), Caddy does it automatically. You point Caddy at your domain, and it obtains and renews TLS certificates on its own, with no extra configuration. For someone setting up a small website who wants HTTPS without the hassle, Caddy is remarkably friendly. Its configuration file is simpler and more readable than Nginx's, which makes it a great choice for people who are newer to this.

**HAProxy** is the heavyweight of load balancing. If your primary concern is distributing traffic across many servers with fine-grained control over how that distribution works, HAProxy is the specialist tool for the job. It's been around for a long time, it's incredibly performant, and it's the backbone of some of the largest web operations in existence. It's more focused on the load-balancing and routing aspects than on serving files or handling TLS (though it can do those too).

**Traefik** is designed for more modern, container-based environments. If your servers are running in Docker containers or on Kubernetes (don't worry if those words don't mean anything to you yet), Traefik can automatically discover them and route traffic to them without you having to manually update configuration files every time something changes. It's the reverse proxy that adapts to a dynamic environment.

Then there are cloud-based services that provide reverse proxy functionality at a different scale. **Cloudflare** operates a global network of servers that can sit in front of your website, providing caching, security, and performance benefits. When you use Cloudflare, visitors' requests hit Cloudflare's servers first (whichever one is geographically closest), and Cloudflare handles caching, DDoS protection, and TLS before forwarding what's needed to your actual server. **AWS Application Load Balancer** and similar services from other cloud providers offer load balancing and routing as managed services — you configure them through a dashboard rather than editing configuration files on a server.

Each of these tools fills the same fundamental role: standing at the door, managing traffic, and supporting the server behind it. They differ in features, complexity, and philosophy, but the core concept is always the same.

### Sentinel: Security as Care

There's one more reverse proxy worth mentioning, and it connects to the broader philosophy of this book. **Sentinel** is a security-focused reverse proxy designed for people who want to protect their own corner of the web.

Most of the reverse proxies listed above are general-purpose tools. They can do security, but security is one of many features, and configuring it well often requires expertise. Sentinel takes a different approach: it's built from the ground up with security as the primary concern, specifically for individuals and small operators who are running their own websites and want to protect them without needing to become security specialists.

The philosophy behind Sentinel aligns with something we've been building toward throughout this book: understanding your infrastructure rather than outsourcing it blindly. Using a massive cloud service for protection is one option, but it means routing all your traffic through someone else's network and trusting them with your visitors' data. Sentinel is the alternative for people who'd rather keep that control themselves — who want a doorman they've hired and trained, not one provided by the mall management.

This isn't about being anti-cloud or anti-service. There are excellent reasons to use cloud-based solutions, especially at scale. But there's also value in being able to run your own protective layer, understanding what it does, and knowing that your visitors' traffic stays within infrastructure you control. Sentinel is designed for that ethos — not paranoia, but care. Not surveillance, but stewardship.

We mention Sentinel here not because it's the only option or even necessarily the best one for every situation, but because it represents an approach to web infrastructure that this book champions: you can understand these layers, you can run them yourself, and doing so is an act of taking responsibility for your little piece of the web.

## The Reverse Proxy is Not a Barrier

It's easy to hear about reverse proxies and think they're about restriction — about blocking things, filtering things, saying no. And yes, a reverse proxy does filter and block when necessary. But that's not really what it's about.

A reverse proxy is about *support*. It supports the server by handling tasks the server shouldn't have to worry about. It supports visitors by directing them efficiently and serving content faster. It supports the person running the website by providing a single, manageable point of control for security, routing, and performance.

Think about our doorman one last time. A good doorman doesn't make the building feel like a fortress. They make it feel *well-managed*. Visitors feel welcomed and directed. Residents feel safe and unbothered. The building runs smoothly not because the doorman is tough, but because they're attentive. They notice things. They handle the small stuff so nobody else has to.

That's the reverse proxy's role in the web's architecture. It's a layer of care — a program whose job is to make the whole operation run more smoothly. Once you start thinking about it that way, the reverse proxy stops being a scary technical concept and starts being an obviously good idea. Of course you'd want someone at the door. Not to keep people out, but to welcome them in properly.

## What's Next?

We've added a new character to our web story. The browser is the visitor. The server is the shopkeeper. And now the reverse proxy is the doorman — greeting visitors, checking credentials, directing traffic, and shielding the server from the raw exposure of the open internet.

But there's something we've only hinted at so far, something the doorman handles but we haven't fully explored: encryption. When your browser talks to a website, how do you know nobody's listening in? How does the server prove it is who it claims to be? And what does that padlock icon in your browser's address bar actually mean?

The conversation between browser and server is polite and structured, as we've seen. But until now, it's also been happening in the open — like talking in a public place where anyone could overhear. In the next chapter, we'll talk about how the web learned to whisper: how HTTPS and TLS turn an open conversation into a private one, keeping your data safe from prying eyes as it travels across the internet.
