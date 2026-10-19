# Illustration Briefs

One illustration per chapter, in the style of the cover (`static/assets/mascots-beach.png`) and Chapter 1 (`static/assets/notebook-talks-to-server.avif`). Each brief says what the picture should show, which idea from the chapter it carries, and what to avoid.

## House style

- **Look:** warm, hand-drawn cartoon with confident dark outlines and soft painterly shading, like the cover. Sunset palette: peach, tangerine, lavender sky, teal water. Friendly, round shapes, big expressive eyes.
- **Cast** (keep them on-model across every picture):
  - **The tanuki:** orange-and-cream raccoon dog with dark eye patches and a teal backpack. Curious; the one who asks.
  - **The shisa:** orange lion-dog with a curly, swirly mane and tail. Guardian; stands at doors. Shisa traditionally come in pairs (one mouth open, one closed).
  - **The crabs:** small red-orange crabs with big googly eyes. Always a crowd, never a single character.
  - **Computers** may have faces, as in Chapter 1: the laptop is warm and yellow, servers are slate-blue boxes with a green power light.
- **Text in the image:** as little as possible. Short labels (a number, a port, a single word) are fine; sentences are not. If a picture needs words, leave a blank sign or speech bubble and letter it afterwards, so the type is crisp and correct.
- **Format:** 1536 × 1024 (3:2, landscape). Keep a master PNG and export an AVIF for the site (aim for under 150 KB). Leave a little breathing room at the edges; the page rounds the corners.

## Adding one to the book

Save it as `static/assets/<slug>.avif` and add two lines to the chapter's front matter:

```toml
[extra]
chapter = 3
illustration = "assets/whats-in-a-name.avif"
illustration_alt = "One sentence describing the picture for people who can't see it."
```

The chapter template does the rest. The alt texts below are suggestions; adjust them to match the finished picture.

---

## Introduction: "Before we begin"

**Show:** A cluttered 1990 office at night. A black, cube-shaped computer (the NeXT) sits on a desk under a desk lamp, with a handwritten paper sign taped to it. The tanuki peers curiously at the sign, backpack on, as if it has just arrived from the future. Stacks of papers and binders everywhere: the lost notes the web was invented to find.

**Carries:** The web started as one modest machine solving a mundane problem.

**Avoid:** Depicting Tim Berners-Lee or any real person. Readable text on the sign (leave it blank or scribbled; the chapter quotes it).

**Alt:** "A tanuki peers at a small black cube computer with a handwritten sign taped to it, on a desk buried in papers."

## 1. Asking for a Page (done)

`notebook-talks-to-server.avif`: the laptop asks, the server answers.

## 2. Getting an Answer

**Show:** The slate-blue server, seated behind a counter like a judge at a talent show, holding up a big score card that reads **404**. More cards are fanned on the counter: **200** (green), **301** (with an arrow), **418** (with a tiny teapot drawn on it). The tanuki stands on the other side looking at the card, puzzled. To one side, the shisa sits under a small sign reading **403**, not moving.

**Carries:** Every answer starts with a number, and the number tells you how it went.

**Avoid:** More than five or six cards; it should read at a glance.

**Alt:** "A server sits behind a counter holding up a card reading 404, with cards for 200, 301 and 418 beside it, while a tanuki looks on and a shisa guards a sign reading 403."

## 3. What's in a Name?

**Show:** An enormous old tree seen from below, its roots glowing at the bottom and labelled with a single dot. The trunk splits into big branches with small wooden signs (**com**, **org**, **ch**), each splitting further. On one twig hangs a small tag with a number on it. The tanuki is climbing the tree with a map, following signposts from the roots up to that tag.

**Carries:** DNS is a tree, read from the root outward, where each level only knows the next.

**Avoid:** Making it look like a family tree or an org chart. It's a real, slightly magical tree.

**Alt:** "A tanuki climbs a huge tree whose branches carry signs reading com, org and ch, following them toward a small tag with a number on it."

## 4. The Place That Answers

**Show:** A cosy row of tiny numbered doors set into the side of a giant laptop, like a street of little houses: **22**, **53**, **80**, **443**, **8000**. Most are dark. Behind door **8000**, a small slate-blue server sits on a stool with a lantern, wide awake, waiting. The tanuki is about to knock.

**Carries:** A server is a program waiting behind a numbered door (a port), and it can live on your own laptop.

**Avoid:** A data-centre aesthetic. This is homely and small.

**Alt:** "A row of tiny numbered doors in the side of a giant laptop; behind door 8000 a small server waits with a lantern while a tanuki prepares to knock."

## 5. Speaking Clearly

**Show:** The tanuki at an old-fashioned typewriter (or a chunky teletype), tongue out in concentration, typing a short letter. The paper curls out of the machine with three short lines on it (letter them afterwards: `GET / HTTP/1.1`, `Host: example.com`, and a blank line). A carriage-return lever is mid-swing. A crumpled first draft lies on the floor.

**Carries:** HTTP is plain text, simple enough to type by hand, and the line endings come from typewriters.

**Avoid:** A modern keyboard. The joke depends on the carriage return.

**Alt:** "A tanuki concentrates at an old typewriter, typing a three-line HTTP request on a sheet of paper."

## 6. Standing at the Door

**Show:** An Okinawan-style gate with a red-tiled roof. A pair of shisa sit on the gateposts, one with its mouth open, one closed. The tanuki is being greeted at the gate. Behind the gate, a small house with the slate-blue server in the window, busy and unbothered. A queue of crabs waits politely; one crab, carrying a suspicious bundle, is being firmly turned away by a raised paw.

**Carries:** A reverse proxy stands in front of the server, greets everyone, and decides who gets through.

**Avoid:** Making the shisa scary. They are protective, not hostile.

**Alt:** "Two shisa guard a red-roofed gate, welcoming a tanuki and turning away a crab with a suspicious bundle, while a server works peacefully in the house behind."

## 7. Locks, Keys, and Quiet Conversations

**Show:** The classic paint-mixing picture of key agreement. The tanuki and the server each stand at an easel. Both start with the same shared pot of yellow paint on a table between them. Each secretly adds their own colour (tanuki: red, behind its back; server: blue, under the table) and passes the mixed pot across. Each then adds its own secret colour again, and both end up holding pots of exactly the same brown. A row of crabs watches from a fence, squinting at the passed pots, completely baffled.

**Carries:** Two strangers can agree on a secret in public without ever sending the secret.

**Avoid:** Padlocks and keys as the main image; the chapter's real insight is the shared secret. A small padlock somewhere in the scene is fine as a nod to the title.

**Alt:** "A tanuki and a server mix paints in secret colours and end up with the same shade, while a row of crabs watches the exchange in confusion."

## 8. When Things Get Busy

**Show:** A huge crowd of crabs pouring along the beach toward one small server door with a sign for five places in the queue. The queue is full; crabs are piling up, climbing over each other, some giving up and sitting in the sand. Off to the side, the shisa stands at a fork in the path, directing crabs toward two identical doors marked **A** and **B**, where everything is calm.

**Carries:** One server has a ceiling; a load balancer and more servers turn a crush into a queue.

**Avoid:** Making it look like a disaster scene. It's a comic crush, not a catastrophe.

**Alt:** "A crowd of crabs crushes toward one tiny server door while a shisa calmly directs others to two doors marked A and B."

## 9. Running Your Own Corner

**Show:** Sunset, as on the cover. A small hut on a grassy hill above the beach, with a little slate-blue server inside and a glowing padlock lantern hanging by the door. The tanuki is hammering a wooden signpost into the ground in front of it (leave the sign blank: it's the reader's domain). A single shisa sits on the hut's roof. Far below, tiny crabs head up the path toward it.

**Carries:** A small corner of the web that's yours, with a name, a lock, and visitors on their way.

**Avoid:** Anything that looks like a big company or a cloud logo. Small and owned.

**Alt:** "At sunset, a tanuki hammers a blank signpost in front of a small hut with a server inside and a padlock lantern at the door, as crabs climb the path toward it."
