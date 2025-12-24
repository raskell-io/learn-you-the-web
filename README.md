<div align="center">

<img src="src/assets/mascots-beach.png" alt="Learn You the Web mascots" width="600" />

<h1 align="center">Learn You the Web</h1>

<p align="center">
  <em>A friendly guide to how the web actually works.</em><br>
  <em>For Real This Time.</em>
</p>

<p align="center">
  <a href="https://rust-lang.github.io/mdBook/">
    <img alt="mdBook" src="https://img.shields.io/badge/Built%20with-mdBook-f5a97f?style=for-the-badge">
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-Apache--2.0-c6a0f6?style=for-the-badge">
  </a>
  <a href="https://raskell-io.github.io/learn-you-the-web/">
    <img alt="Read Online" src="https://img.shields.io/badge/Read-Online-89b4fa?style=for-the-badge">
  </a>
</p>

<p align="center">
  <a href="https://raskell-io.github.io/learn-you-the-web/">Read the Book</a> •
  <a href="https://github.com/raskell-io/sentinel">Sentinel</a> •
  <a href="#chapters">Chapters</a> •
  <a href="#contributing">Contributing</a>
</p>

<hr />

</div>

Once upon a time, the web was just a polite question and an honest answer. A browser asked for a page, a server replied, and that was the whole miracle. The web you use today is still built on that same exchange—it just wears a lot more armor.

This book explains how that armor came to be, what purpose it serves, and how you can use it wisely, so hosting and protecting your own corner of the web becomes something you understand, not something you avoid.

---

## Why this book exists

The web can feel intimidating. Words like "infrastructure" and "edge" and "security posture" replaced the earlier, friendlier language of pages and links. Hosting a website started to sound like a specialist skill.

This book is an invitation to step closer again.

We move slowly and start from the beginning. We look at what a request actually is, the way you might look at a postcard before thinking about the postal system that delivers it. We meet web servers as simple, patient programs that answer questions. We meet reverse proxies as helpful intermediaries—like doormen—whose job is to guide traffic, not to dominate it.

The web was built by people trying to make their work easier to share. Beneath all the layers, it is still doing the same thing it did at the beginning: helping one machine ask another machine for something useful.

---

## Chapters

1. **Asking for a Page** — The web begins when one computer politely asks another for something.
2. **Getting an Answer** — Responses have structure: status, headers, and the content you asked for.
3. **The Place That Answers** — What a web server is, and where the pages live.
4. **Speaking Clearly** — HTTP as the shared language that makes it all work.
5. **Standing at the Door** — Reverse proxies, and why you might want one.
6. **Locks, Keys, and Quiet Conversations** — HTTPS, TLS, and keeping conversations private.
7. **When Things Get Busy** — Load, reliability, and scaling without mysticism.
8. **Running Your Own Corner** — Ownership, responsibility, and the joy of hosting.

---

## Local development

This book is built with [mdBook](https://rust-lang.github.io/mdBook/). We use [mise](https://mise.jdx.dev/) for tool management.

```bash
# Install dependencies
mise install

# Serve locally with live reload
mise run serve

# Build the book
mise run build

# Run tests
mise run test
```

---

## Contributing

Contributions are welcome. Whether it's fixing a typo, improving an explanation, or suggesting a better metaphor—every bit helps make the web more understandable.

---

## License

This work is licensed under [Apache 2.0](LICENSE).

---

<div align="center">
  <sub>Part of the <a href="https://github.com/raskell-io">raskell-io</a> project.</sub>
</div>
