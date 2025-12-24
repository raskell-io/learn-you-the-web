# Chapter 5

## Standing at the Door

> **Metaphor:** A doorman / receptionist
> **Mental image:** "Let me check that for you."

---

### Key Ideas

This is the pivotal chapter where we introduce the concept of intermediaries — specifically the reverse proxy. This is also where Sentinel naturally fits into the story, though the chapter shouldn't feel like a pitch.

**Core concepts to cover:**

1. **Not every request should go straight to the server**
   - Sometimes you want someone at the door first
   - Reasons: security, efficiency, routing, inspection
   - This isn't paranoia — it's practical hospitality

2. **What is a reverse proxy?**
   - A program that receives requests *on behalf of* the server
   - It can decide what to do: pass it through, reject it, modify it, route it
   - From the browser's perspective, the proxy *is* the server

3. **The doorman metaphor**
   - Visitors arrive at a building; the doorman greets them
   - Some are let through immediately
   - Some are asked to wait, or turned away
   - The doorman doesn't own the building — they protect and manage access

4. **Why you might want one**
   - **Security**: block malicious requests before they reach your server
   - **Load balancing**: distribute visitors across multiple servers
   - **Caching**: serve common pages without bothering the server
   - **TLS termination**: handle encryption at the edge (more in Chapter 6)

5. **Common reverse proxies**
   - Nginx, HAProxy, Caddy, Traefik
   - Cloud services (Cloudflare, AWS ALB)
   - Sentinel — a security-focused reverse proxy for the free web

6. **Sentinel's philosophy (light touch)**
   - Designed for people who want to protect their own corner of the web
   - Not about surveillance — about care
   - Fits the theme: understanding your infrastructure, not outsourcing blindly

---

### Tone for this chapter

Welcoming but purposeful. The reverse proxy should feel like a helpful presence, not a barrier. Sentinel should be introduced as one example, not the hero of the story. The reader should understand *why* this layer exists and feel empowered to use it.

---

### Bridge to Chapter 6

The doorman checks who comes in — but what about eavesdroppers? What about someone listening to the conversation? That's where encryption matters. Time to talk about HTTPS.

---

*Status: Work in progress*
