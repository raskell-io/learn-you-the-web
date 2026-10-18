<div align="center">

<img src="static/assets/mascots-beach.png" alt="Learn You the Web mascots" width="600" />

<h1 align="center">Learn You the Web</h1>

<p align="center">
  <em>A friendly guide to how the web actually works.</em><br>
  <em>For Real This Time.</em>
</p>

<p align="center">
  <a href="https://www.getzola.org/">
    <img alt="Built with Zola" src="https://img.shields.io/badge/Built%20with-Zola-f5a97f?style=for-the-badge">
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-CC0--1.0-c6a0f6?style=for-the-badge">
  </a>
  <a href="https://learn-you-the-web.raskell.io/">
    <img alt="Read Online" src="https://img.shields.io/badge/Read-Online-89b4fa?style=for-the-badge">
  </a>
</p>

<hr />

</div>

Every time you open a web page, one computer asks another for something, and the other one answers. That's the whole trick. Everything else (domain names, servers, proxies, padlocks, clouds) is armour bolted on over the years.

This book takes the armour off, one piece at a time. You'll type real commands, read real conversations between machines, and by the end you'll be able to put your own corner of the web online and understand every layer standing in front of it. It owes its spirit, and its grammar, to *Learn You a Haskell for Great Good!*

**[Read it online →](https://learn-you-the-web.raskell.io/)**

## Contents

- **Introduction**: Before the web was something you scroll, it was something you asked.
1. **Asking for a Page**: `curl -v` and the conversation behind every page.
2. **Getting an Answer**: Status codes, and all the ways a server can say no.
3. **What's in a Name?**: DNS, and how `example.com` becomes a number.
4. **The Place That Answers**: What a server is. You'll run one.
5. **Speaking Clearly**: HTTP up close, typed by hand.
6. **Standing at the Door**: Reverse proxies, and why you might want one.
7. **Locks, Keys, and Quiet Conversations**: HTTPS, TLS and certificates.
8. **When Things Get Busy**: Load, caching, CDNs, and scaling without mysticism.
9. **Running Your Own Corner**: Putting a real site online, and keeping it there.

## Working on the book

The site is built with [Zola](https://www.getzola.org/) and the [Tanuki](https://github.com/raskell-io/tanuki) theme (a git submodule). Tool versions are pinned with [mise](https://mise.jdx.dev/).

```sh
git clone --recursive https://github.com/raskell-io/learn-you-the-web
cd learn-you-the-web
mise install
mise run serve   # http://127.0.0.1:1111
```

Use the pinned Zola (`mise run …` or `mise exec -- zola …`). Newer Zola releases renamed some config keys and won't build this site as-is.

Where things live:

- `content/`: one Markdown file per chapter. Chapter numbers come from `[extra] chapter` in the front matter; order comes from `weight`.
- `STYLE.md`: the voice and markup guide. Read it before writing.
- `templates/`: the cover page, the chapter layout and the `try` / `note` shortcodes. These override or extend Tanuki.
- `sass/`: the book's look (palette, typography, callouts), layered on top of Tanuki's stylesheet.
- `syntaxes/`: highlighting for `console`, `http` and `text` code blocks.
- `static/fonts/`: self-hosted Fraunces and Literata (SIL Open Font License).

## License

This work is dedicated to the public domain under [CC0 1.0 Universal](LICENSE). The bundled fonts are under the SIL Open Font License; see `static/fonts/`.

---

<div align="center">
  <sub>Part of the <a href="https://github.com/raskell-io">raskell-io</a> project.</sub>
</div>
