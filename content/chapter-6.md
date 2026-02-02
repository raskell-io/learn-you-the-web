+++
title = "Locks, Keys, and Quiet Conversations"
description = "HTTPS and TLS keep web conversations private, like a sealed envelope only the recipient can open."
weight = 7

+++

Up to this point, we've been talking about the web as a polite, structured conversation. The browser asks, the server answers, and the reverse proxy manages the door. We've explored the language they speak (HTTP), the place that answers (the server), and the helpful intermediary that keeps things running smoothly (the reverse proxy). It's all very civilized.

But there's something we haven't addressed, and it's a big one: anyone can listen in.

The HTTP conversations we've described so far happen in plain text. When your browser sends a request and a server sends a response, those messages travel across the internet — through cables, routers, Wi-Fi access points, and internet service providers — and at every step along the way, anyone who handles the message can read it. Not just the destination, not just the sender, but every intermediary in between.

For public information, this isn't a problem. If you're reading a Wikipedia article or browsing a news site, there's nothing secret about the content. Anyone who intercepts the message would see the same article you're reading — not exactly thrilling espionage material.

But the web isn't just public articles and blog posts. It's also banking. It's medical records. It's private messages. It's passwords, credit card numbers, and personal information. And for all of that, sending messages in plain text across the open internet is a very bad idea.

This chapter is about how the web learned to keep its conversations private.

## HTTP is a Postcard

Here's a metaphor that makes the problem vivid. Think of a regular HTTP request as a postcard. You write your message on one side (the request or response data), you write the address on the other (the URL and headers), and you drop it in the mail. It travels through the postal system — handled by mail carriers, sorted at distribution centers, loaded onto trucks — and eventually arrives at its destination.

The thing about postcards is that they're completely open. There's no envelope. Anyone who handles the postcard along the way can flip it over and read your message. The mail carrier, the sorting facility worker, the nosy neighbor who happens to glance at it — they can all see exactly what you wrote. You trust the postal system not to do this, mostly, but the *option* is there. The content is exposed.

HTTP works the same way. When your browser sends a plain HTTP request, the data travels through multiple networks and systems on its way to the server. Your internet service provider can see it. The operator of any network your traffic passes through can see it. Anyone on the same Wi-Fi network as you (say, at a coffee shop) who knows how to look can potentially see it. The request and the response are right there, in readable text, for anyone positioned along the route.

For a request that says "GET /about.html" — who cares? That's public information. But for a request that says "POST /login" with a body containing your username and password? Or a response containing your bank account balance? Suddenly, the postcard model is deeply uncomfortable.

This was the web's reality for its first several years. HTTP was designed for sharing documents between researchers — postcards were fine when the content was academic papers. But as the web grew into a platform for commerce, communication, and personal data, the open postcard became a serious liability.

## HTTPS is a Sealed Envelope

The solution was elegant and, in concept, simple: put the postcard in an envelope. Seal it so that only the intended recipient can open it. Let the postal system carry it as before — through all the same routes and intermediaries — but now, anyone who handles the envelope along the way sees only the outside. The address is visible (the message still needs to get where it's going), but the contents are hidden.

This is HTTPS. The "S" stands for Secure, and what it means in practice is that the HTTP conversation — the request and the response, with all their methods and headers and bodies — is wrapped in a layer of encryption before being sent. The data still travels across the same internet, through the same routers and cables, but it's scrambled in a way that makes it unreadable to anyone except the browser and the server that are having the conversation.

That little padlock icon in your browser's address bar? That's your browser telling you, "This conversation is happening inside a sealed envelope. The contents are encrypted. Nobody between you and the server can read them."

When you see `https://` at the beginning of a URL instead of `http://`, that's the difference. The URL, the server, the conversation — they're all the same. The only change is that the conversation is encrypted. It's the same postcard, in the same postal system, but now it's inside an envelope that only you and the server can open.

Today, HTTPS is the norm. Most websites use it by default, and most browsers will warn you if you try to visit a site that doesn't. This wasn't always the case — for a long time, HTTPS was mainly used for banking and shopping, while the rest of the web ran on plain HTTP. But over the past decade, the web community has pushed hard to make encryption the default everywhere, and it's largely succeeded. The sealed envelope is now the standard, not the exception.

## TLS: The Sealing Mechanism

HTTPS isn't a protocol in its own right — it's just HTTP with an encryption layer wrapped around it. That encryption layer is called **TLS**, which stands for Transport Layer Security. (You might also hear the older name **SSL**, which stands for Secure Sockets Layer. SSL is the predecessor of TLS, and while the name still gets used colloquially, the actual technology in use today is TLS. Think of "SSL" as the old brand name that stuck around.)

TLS is the mechanism that does the actual sealing of the envelope. It's a set of cryptographic techniques that scramble the data so that only the intended recipient can unscramble it. Here's the basic idea, without getting into the mathematics:

Before any actual web content is exchanged, the browser and the server have a brief, private negotiation. They agree on a way to encrypt their conversation — specifically, they agree on a shared secret that only the two of them know. Once they have this shared secret, they use it to encrypt every message they send to each other. The browser encrypts its requests before sending them; the server encrypts its responses before sending them back. Anyone intercepting the traffic sees only gibberish — scrambled data that's useless without the secret key.

Think of it as two people who want to exchange letters privately. Before writing their first letter, they meet briefly and agree on a secret code — say, "shift every letter three positions in the alphabet." From then on, every letter they exchange is written in this code. Anyone who intercepts a letter sees nonsense ("khoor" instead of "hello"), but the two correspondents can decode each other's messages easily because they both know the code.

Real TLS encryption is vastly more sophisticated than a simple letter shift, of course. It uses advanced mathematics that would take the world's fastest computers billions of years to crack by brute force. But the principle is the same: agree on a secret, use that secret to scramble and unscramble messages, and anyone without the secret sees only noise.

The important thing to understand is that TLS doesn't change what HTTP is. The request still has a method, a path, headers, and a body. The response still has a status line, headers, and a body. HTTP is the conversation; TLS is the envelope around it. The content of the conversation is identical — it's just protected in transit.

## Certificates: Proving You Are Who You Say You Are

Encryption solves the eavesdropping problem: nobody along the route can read your messages anymore. But there's a second problem that encryption alone doesn't solve: how do you know you're talking to the right server?

Imagine you want to send a private letter to your bank. You seal it in an envelope — great, nobody can read it in transit. But what if someone set up a fake mailbox that looks exactly like your bank's? You'd be sending your sealed envelope to an imposter, who would open it, read your account details, and do whatever they pleased. The encryption protected the letter in transit, but it didn't verify who was at the other end.

This is where **certificates** come in.

A TLS certificate is like an ID card for a server. It's a digital document that says, "I am the server for www.example.com, and here's proof." The certificate contains the server's identity information, a cryptographic key, and — crucially — a signature from a trusted third party vouching for the server's identity.

These trusted third parties are called **Certificate Authorities** (CAs). They're organizations whose job is to verify that a server really is who it claims to be before issuing a certificate. Think of them like the government agency that issues passports. When you show your passport at a border, the officer doesn't know you personally — but they trust the agency that issued the passport, and the passport confirms your identity. Similarly, your browser doesn't know the server personally, but it trusts the Certificate Authority that issued the server's certificate.

Your browser comes pre-loaded with a list of Certificate Authorities it trusts. When you connect to a website over HTTPS, one of the first things that happens is the server presenting its certificate. Your browser examines this certificate: Was it issued by a trusted CA? Is it for the correct domain name? Has it expired? Has it been revoked? If everything checks out, the browser accepts the certificate and proceeds with the encrypted connection. If something's wrong — if the certificate is expired, or for the wrong domain, or issued by an untrusted authority — the browser shows you a warning, usually a full-page alert saying something like "Your connection is not private."

You might have seen these warnings before. They're your browser saying, "I can't verify who's on the other end of this conversation. The ID card looks suspicious. You can proceed if you want, but I wouldn't recommend it." It's not always a sign of malice — sometimes certificates expire because someone forgot to renew them — but it's always a sign that something isn't as it should be.

### Let's Encrypt: Certificates for Everyone

For a long time, getting a TLS certificate was a bit of a hassle. You had to buy one from a Certificate Authority, go through a verification process, install it on your server, and remember to renew it before it expired. The cost wasn't enormous, but it was enough to discourage hobbyists and small website operators from bothering. As a result, a lot of smaller websites stuck with plain HTTP — not because they didn't care about security, but because getting a certificate felt like an unnecessary expense and burden.

**Let's Encrypt** changed that. Launched in 2016, Let's Encrypt is a free, automated Certificate Authority run as a nonprofit. It issues TLS certificates at no cost, and the entire process — verification, issuance, installation, and renewal — can be fully automated. You can set up a server to obtain and renew its certificate automatically, without any human intervention, without paying a cent.

The impact was transformative. Suddenly, there was no financial or practical barrier to using HTTPS. A personal blog, a hobby project, a small community site — all could have the same level of encryption as a major bank's website. Let's Encrypt has issued billions of certificates and is a major reason why HTTPS adoption went from a fraction of the web to the overwhelming majority in just a few years.

Let's Encrypt is worth mentioning specifically because it represents the same spirit as the web itself: open, accessible, and designed to benefit everyone. Just as HTTP was deliberately made simple so anyone could implement it, Let's Encrypt made encryption free so anyone could use it. The sealed envelope is no longer a luxury — it's available to everyone who wants one.

If you're using a reverse proxy like Caddy (which we mentioned in Chapter 5), Let's Encrypt integration is often built right in. Caddy will automatically obtain a Let's Encrypt certificate for your domain and renew it as needed, with zero configuration on your part. Even with other tools, setting up Let's Encrypt is straightforward. The barrier to encrypted web traffic has effectively been removed.

## The Handshake

We've talked about encryption and certificates as separate concepts, but in practice, they work together in a coordinated sequence that happens every time you connect to an HTTPS website. This sequence is called the **TLS handshake**, and it happens in the brief moment between when your browser initiates a connection and when the actual web content starts flowing.

Here's what happens, step by step, translated into human terms:

**Browser:** "Hello! I'd like to have a private conversation. Here are the encryption methods I support."

**Server:** "Hello! Let's use this encryption method. And here's my certificate — my ID card — so you know who I am."

**Browser:** *(examines the certificate)* "Let me check this ID... Issued by a trusted authority? Yes. For the right domain? Yes. Still valid? Yes. Okay, I trust you."

**Browser:** "Great. Let's agree on a shared secret for this conversation." *(sends the information needed to establish a shared encryption key)*

**Server:** "Agreed. I have the shared secret too."

**Both:** "From now on, everything we say is encrypted with this secret. Let's talk."

And then the normal HTTP conversation proceeds — GET requests, 200 OK responses, headers, bodies — all wrapped in encryption. The handshake is over. It happened in milliseconds, invisibly, before a single byte of web content was exchanged.

You never see this handshake. Your browser handles it automatically, behind the scenes, every time you visit an HTTPS website. The only visible evidence is that padlock icon appearing in the address bar, signaling that the handshake succeeded and the conversation is encrypted. If the handshake fails — because the certificate was invalid, or the encryption methods didn't match, or something else went wrong — your browser shows an error instead of the page. No handshake, no conversation. Your browser won't talk to a server it can't verify.

The handshake metaphor is apt: just as two people meeting for the first time might shake hands, introduce themselves, and establish a basis for trust before diving into conversation, the browser and server do the same thing digitally. They introduce themselves, verify each other's identity (well, mainly the server's identity — the browser usually remains anonymous), agree on the rules of their private conversation, and then proceed. It's polite, it's orderly, and it's over before you've even noticed it happened.

### Speed and Invisibility

One of the remarkable things about TLS is how fast it is. The handshake — the negotiation, the certificate verification, the key exchange — typically takes only tens of milliseconds. Modern TLS versions (TLS 1.3, the latest as of this writing) have been optimized to minimize the number of back-and-forth messages needed, making the handshake even faster. In many cases, a browser that has connected to a server before can resume the encrypted connection with an abbreviated handshake, saving even more time.

The engineers who designed TLS understood that if encryption slowed down the web noticeably, people wouldn't use it. So they worked hard to make it as close to invisible as possible. The result is that HTTPS is, for all practical purposes, as fast as HTTP. You don't feel the encryption. You don't wait for it. It just works, silently, in the background, protecting every byte of your conversation.

## What TLS Protects (and What It Doesn't)

TLS is powerful, but it's not magic. It's worth understanding exactly what it protects and where its limits are, so you have an accurate mental model rather than a false sense of invulnerability.

### What TLS Protects

**The content of the conversation.** This is the big one. The body of your HTTP requests and responses — your login credentials, your personal data, the pages you're viewing, the forms you're submitting — all of this is encrypted. Anyone intercepting the traffic sees scrambled data. They can't read your passwords, your messages, your bank balance, or anything else that flows between the browser and the server.

**The headers of the conversation.** HTTP headers, including cookies, authentication tokens, and other metadata, are also encrypted. An eavesdropper can't see what specific page you're requesting or what cookies your browser is sending.

**The integrity of the conversation.** TLS doesn't just encrypt — it also ensures that the data hasn't been tampered with in transit. If someone tried to modify the encrypted data as it passed through a network, the recipient would detect the modification and reject the message. You can't just change a few bytes in an encrypted message and hope nobody notices; the math catches you.

### What TLS Doesn't Protect

**The fact that a conversation is happening.** TLS encrypts the *content* of the communication, but not the *existence* of it. An observer can still see that your computer is connecting to a particular server's IP address. They can see how much data is being exchanged and when. They can often figure out which website you're visiting based on the IP address alone, even if they can't see the specific pages. This kind of information — data about data — is called *metadata*, and TLS doesn't hide it.

Think of our sealed envelope again. The envelope hides what you wrote, but the postal system still sees that you sent a letter, who you sent it to, when you sent it, and roughly how thick the envelope is. Those facts can be quite revealing on their own, even without reading the contents.

**The identity or intentions of the server.** TLS verifies that the server is who it *claims* to be, but it doesn't vouch for the server's character. A phishing website — a fraudulent site designed to trick you into entering your password — can have a perfectly valid TLS certificate. The padlock icon means "this connection is encrypted and the server has been verified as the domain it claims to be." It does *not* mean "this website is trustworthy" or "this website is safe." A scammer can get a certificate for `totally-real-bank-login.com` and the padlock will appear, because the certificate correctly identifies the server as `totally-real-bank-login.com`. TLS verified the identity; it's up to you to decide whether to trust that identity.

This is a common misunderstanding. The padlock means encrypted and verified, not safe and trustworthy. It's the difference between knowing that the person you're talking to really is who they say they are, versus knowing whether that person has good intentions. TLS handles the first part; the second part is on you.

**Your traffic after it reaches the server.** TLS protects data *in transit* — while it's traveling between your browser and the server. Once the data arrives at the server and is decrypted, TLS's job is done. What the server does with your data after that — how it stores it, who it shares it with, whether it handles it responsibly — is outside TLS's scope. Encryption protects the journey, not the destination.

## Where Does the Reverse Proxy Fit?

In the last chapter, we mentioned that reverse proxies often handle TLS termination. Now that you understand what TLS is, let's see how that works in practice.

In many web setups, the reverse proxy is the program that holds the TLS certificate and manages the encrypted connection with the browser. The browser connects to the reverse proxy over HTTPS, completes the TLS handshake, and sends its encrypted requests. The reverse proxy decrypts the requests and then forwards them to the actual web server over the internal network — typically as plain HTTP, without encryption.

This might sound counterintuitive. Why would you decrypt the request before it reaches the server? Isn't the whole point to keep things encrypted?

The answer is about trust boundaries. The connection between the browser and the reverse proxy crosses the open internet — it passes through untrusted networks where eavesdropping is a real risk. That connection needs to be encrypted. But the connection between the reverse proxy and the web server is usually on a private, internal network — a local connection within the same data center, or even on the same physical machine. The risk of eavesdropping on that internal connection is vastly lower, so encryption is often considered unnecessary there.

Think of it this way: you seal your letter in an envelope for the journey through the postal system. But once it arrives at the reception desk of the building you're sending it to, the receptionist (the reverse proxy) opens the envelope and passes the letter directly to the intended resident (the server). The letter travels unsealed within the building because the building itself is a trusted environment. The dangerous part of the journey — the open postal system — was protected. The safe part — the internal hallway — doesn't need the same level of protection.

This arrangement has practical benefits. The web server doesn't need to manage certificates, handle encryption, or deal with the computational overhead of TLS. All of that is offloaded to the reverse proxy, which can specialize in it. The server just receives plain HTTP requests and sends plain HTTP responses, blissfully unaware that encryption was involved at all. This simplifies the server's configuration and lets it focus on what it does best: preparing content.

Of course, there's a trade-off. By terminating TLS at the reverse proxy, you're trusting the reverse proxy to handle your visitors' data responsibly during the brief moment between decryption and forwarding. For most setups, this is a perfectly reasonable trust decision — you control the reverse proxy, it's on your own infrastructure, and the internal network is short and private. But in environments with very high security requirements, some operators choose to encrypt the connection between the reverse proxy and the server as well, adding an extra layer of protection at the cost of some complexity.

## Encryption as a Reasonable Precaution

It's easy for conversations about security to veer into fear. Eavesdroppers! Hackers! Intercepted data! And while these risks are real, it's important to keep them in perspective. HTTPS and TLS are not about living in fear of the internet. They're about taking a reasonable, straightforward precaution — like locking your front door when you leave the house. You don't lock your door because you live in a dangerous neighborhood (maybe you do, maybe you don't). You lock it because it's easy, it costs nothing, and it removes a risk that's simple to mitigate.

HTTPS is the same. It's easy to set up (especially with Let's Encrypt and tools like Caddy). It costs nothing. And it removes the risk of someone casually reading your web traffic. It's the digital equivalent of using an envelope instead of a postcard — such an obvious good idea that the only real question is why you wouldn't do it.

For local development — when you're running a server on your own laptop and testing in your own browser — you typically don't need HTTPS. You're the only one on the network. There's nobody to eavesdrop. Using plain HTTP locally is perfectly fine and far simpler. The encryption matters when data travels across the open internet, not when it loops back to the same machine.

And that's the right way to think about TLS: it's a precaution for the journey, not a judgment on the destination. It protects the space between here and there — the cables, the routers, the Wi-Fi signals — where your data is most vulnerable. It's quiet, efficient, and largely invisible. You don't need to understand the cryptographic details to benefit from it. You just need to know it's there, what it does, and why it matters.

## What's Next?

We've now secured the web's conversation. The browser asks, the server answers, the reverse proxy manages the door, and TLS wraps the whole exchange in an envelope that only the two parties can open. The conversation is polite, structured, and private. That covers a lot of ground.

But there's one more challenge we haven't tackled: what happens when the shop gets crowded?

So far, we've been thinking about one server handling requests. But what happens when a website becomes popular — really popular? What happens when thousands, or millions, of visitors all show up at once? The server is patient, as we learned in Chapter 3, but patience has limits. At some point, a single server simply can't keep up.

In the next chapter, we'll look at how the web handles crowds: how you can run multiple servers behind a load balancer, how caching prevents unnecessary work, how content delivery networks bring pages closer to visitors, and how a well-designed system can survive even when individual parts of it fail. The web was built to scale, and once you see how, the biggest websites in the world will start to make a lot more sense.
