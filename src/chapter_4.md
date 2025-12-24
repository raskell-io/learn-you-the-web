# Chapter 4

## Speaking Clearly

> **Metaphor:** A shared language / ordering from a menu
> **Mental image:** "We both know how this conversation works."

---

### Key Ideas

This chapter reveals HTTP — not as a scary acronym, but as the agreement that makes web conversations possible.

**Core concepts to cover:**

1. **Protocols are just agreements**
   - Two strangers can communicate if they agree on the rules
   - HTTP is the rulebook for web conversations
   - It defines how to ask, how to answer, and what to include

2. **Why boring rules are powerful**
   - Because everyone follows the same format, any browser can talk to any server
   - This universality is why the web scaled
   - Contrast with proprietary systems that only work with their own tools

3. **The anatomy of an HTTP request**
   - Method: what you want to do (GET = "give me", POST = "take this")
   - Path: what you're asking for (`/index.html`)
   - Headers: extra context (who you are, what you accept)
   - Body: sometimes you send data too (forms, uploads)

4. **The anatomy of an HTTP response**
   - Status line: success or failure
   - Headers: metadata about the response
   - Body: the actual content

5. **HTTP is text-based (at heart)**
   - You could, in theory, type an HTTP request by hand
   - This transparency is a feature — it's inspectable, debuggable
   - Show a simple example of what a raw request looks like

6. **Verbs have meaning**
   - GET: retrieve (safe, repeatable)
   - POST: submit (might change things)
   - PUT, DELETE, PATCH: other intentions
   - The verb tells the server your intent before it even reads the rest

---

### Tone for this chapter

Matter-of-fact but appreciative. HTTP isn't glamorous, but its simplicity is what made the web possible. Like a well-designed form at a government office — boring, but it works because everyone fills it out the same way.

---

### Bridge to Chapter 5

Now we know how browsers and servers talk. But what if you don't want every request going straight to your server? What if you want something in between — checking, filtering, routing? That's where the reverse proxy comes in.

---

*Status: Work in progress*
