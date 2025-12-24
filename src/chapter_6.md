# Chapter 6

## Locks, Keys, and Quiet Conversations

> **Metaphor:** Envelopes and locked doors
> **Mental image:** "Only the right person can read this."

---

### Key Ideas

This chapter covers HTTPS and TLS — the encryption layer that keeps web conversations private.

**Core concepts to cover:**

1. **HTTP is a postcard**
   - Anyone who handles it can read it
   - The librarian, the mail carrier, the nosy neighbor
   - Fine for public information, dangerous for private data

2. **HTTPS is a sealed envelope**
   - The contents are scrambled so only the recipient can read them
   - This is what the "S" in HTTPS means: Secure
   - That little padlock icon = envelope is sealed

3. **TLS: the sealing mechanism**
   - TLS (Transport Layer Security) wraps HTTP in encryption
   - The browser and server agree on a secret before talking
   - Anyone intercepting the conversation sees gibberish

4. **Certificates: proving you are who you say you are**
   - A certificate is like an ID card for a server
   - Issued by trusted authorities (Certificate Authorities)
   - The browser checks the ID before trusting the server
   - Let's Encrypt: free certificates for everyone (mention as democratizing force)

5. **The handshake**
   - Before any content is exchanged, there's a negotiation
   - Both sides agree on how to encrypt
   - This happens invisibly, in milliseconds
   - Metaphor: two people agreeing on a secret code before writing letters

6. **What TLS protects (and what it doesn't)**
   - Protects: content of the conversation
   - Doesn't protect: the fact that a conversation happened (metadata)
   - Doesn't verify the *intent* of the server — just its identity

7. **Where does the reverse proxy fit?**
   - Often handles TLS termination (decrypts at the edge)
   - Then passes plain HTTP to the internal server
   - Trade-off: simplifies server setup, but requires trust in the proxy

---

### Tone for this chapter

Reassuring but honest. Encryption should feel like a reasonable precaution, not a paranoid necessity. The reader should understand *why* HTTPS matters without feeling scared about using HTTP locally for development.

---

### Bridge to Chapter 7

We've secured the conversation. But what happens when a lot of people show up at once? The library gets crowded. Time to talk about load and scale.

---

*Status: Work in progress*
