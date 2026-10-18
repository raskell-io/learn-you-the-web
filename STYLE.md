# Style Guide

*Learn You the Web* aims to be for the web what *Learn You a Haskell for Great Good!* is for Haskell: a book that is fun to read, that respects the reader's intelligence, and that gets them typing things into a terminal on page one.

## Voice

- **Talk to one smart friend.** Second person, conversational, a little cheeky. Assume the reader is clever and curious, just new to this.
- **Be funny with specifics, not with cheerleading.** A joke is a concrete, slightly absurd image or a deadpan aside, usually in parentheses. Never "Great job!", "Not so scary, right?", "Give yourself a high-five", or "Fear not!". The fun is in the material, not in reassurance.
- **Say it once.** Explain, show, maybe joke, move on. No statement → analogy → recap triple. If a paragraph restates the previous one, delete it.
- **Show before you tell.** Every chapter has the reader run something real (`curl`, `dig`, `python3 -m http.server`, `nc`, `openssl`, browser DevTools) within the first screen or two, then explains what they just saw.
- **Short paragraphs.** Three to five sentences. Vary rhythm; a one-line paragraph is a punchline, so don't spend it on filler.
- **Analogies are seasoning.** One good analogy per idea, used where it actually clarifies, then dropped. Don't stack the librarian, the waiter, the postman and the pizza guy in one chapter.
- **Be accurate.** Simplify, but never say something false. If a simplification hides a nuance a curious reader will hit later, mention it in one parenthetical.

## Banned or rationed

- "polite/politely" (at most once per chapter), "simply", "just" as filler, "essentially", "In other words", "It's worth noting", "Let's dive in", "magic/magical" (except to deny it once), "Think of it this way", rhetorical "Imagine…" openers.
- Exclamation marks: rare, and only when something is actually surprising.
- Chapter-ending pep talks. End on the idea, or a one-line tease of the next chapter.
- Product placement. Mention tools neutrally; the author's own projects get at most one honest, clearly labelled aside.

## Recurring cast

The mascots from the cover:

- **The tanuki** (raccoon dog with the backpack): curious, always asking for things. Stands in for you and your browser.
- **The shisa** (the curly-maned lion-dog guardian): stands at doors and decides who gets in. Natural fit for proxies, TLS, and firewalls.
- **The crabs**: a small, busy crowd. Good for packets, traffic, and "lots of requests at once".

Use them lightly: a cameo per chapter, not a running sitcom.

## Structure of a chapter

1. A hook paragraph or two (a joke, a question, or a command to run).
2. A **Try it** box early on.
3. Sections with short, plain headings. Avoid `###` headings over one-line content.
4. Real artefacts: commands, raw HTTP, config snippets, with a sentence after each saying what to notice.
5. A short ending that lands the idea (no recap list, no "What's Next?" heading).

## Markup

Front matter for a chapter:

```toml
+++
title = "Asking for a Page"
description = "One-line summary, also used on the cover page."
weight = 10
aliases = ["/chapter-1/"]

[extra]
chapter = 1
illustration = "assets/notebook-talks-to-server.avif"   # optional
illustration_alt = "A laptop asks a server for a page"
+++
```

Shortcodes:

```md
{% try() %}
Run `curl -v http://example.com` and look at the lines starting with `>`.
{% end %}

{% note(title="Pedantry corner") %}
A small aside for the curious. Optional title.
{% end %}
```

Terminal sessions use ` ```console ` with a `$ ` prompt so readers can tell input from output.
