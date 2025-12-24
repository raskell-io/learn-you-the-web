# Chapter 2

## Getting an Answer

> **Metaphor:** Receiving a letter / being handed a book
> **Mental image:** "Here it is." or "Sorry, that doesn't exist."

---

### Key Ideas

This chapter completes the first half of the conversation. If Chapter 1 was about *asking*, Chapter 2 is about *receiving*.

**Core concepts to cover:**

1. **Responses have structure**
   - A response is not just "the page" — it's a package containing both content and context
   - The server always replies, even when the answer is "no"

2. **Status codes as honest signals**
   - 200: "Here it is"
   - 404: "I couldn't find that"
   - 500: "Something went wrong on my end"
   - The number isn't arbitrary — it's a shorthand the browser understands
   - Frame these as *tone* rather than *error codes*

3. **The body vs. the envelope**
   - Headers: metadata about the response (what type of content, how big, when it was made)
   - Body: the actual content you asked for
   - Like receiving a letter — the envelope tells you something, but the letter inside is what you came for

4. **Content types matter**
   - HTML, images, JSON, CSS — same request pattern, different kinds of answers
   - The browser knows what to do based on the Content-Type header

5. **The response is the end of a promise**
   - The request was a question; the response is the answer
   - Once the response arrives, the conversation for that request is complete

---

### Tone for this chapter

Keep the library metaphor alive — the librarian handing back a book, or a note saying "we don't have that." The reader should feel the symmetry: Chapter 1 was the ask, Chapter 2 is the receive. Together they form the complete "conversation."

---

### Bridge to Chapter 3

End with curiosity about *where* these answers come from. The librarian handed you the book — but who stocks the shelves? That's the web server.

---

*Status: Work in progress*
