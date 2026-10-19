# Illustrations

*Learn You a Haskell* is half text and half doodles, and the doodles do as much of the teaching as the jokes do. This file describes what this book's pictures should look like, how they're placed, and what to draw for every chapter.

## What we're going for

Look at a few chapters of *Learn You a Haskell* (the community mirror is at [learnyouahaskell.github.io](https://learnyouahaskell.github.io/)) before drawing anything. Its pictures share a handful of traits, and every one of them matters:

- **Doodles, not paintings.** Quick drawings made with a tablet pen: thin, wobbly black outlines that don't always close, flat bright colours, at most one simple shadow tone and a white highlight blob. No gradients, no textures, no glow, no lighting effects.
- **No background.** Each drawing is a cut-out on a transparent background, floating in the page. No sky, no scenery, no frame.
- **Goofy, not cute.** Slightly odd proportions, dopey or deadpan expressions, wonky hands. Charm from being a bit silly, not from being adorable.
- **Small and many.** About one drawing per 500–700 words, usually 140–220 pixels wide, floated left or right next to the paragraph it jokes about. A chapter has four to six of them.
- **The drawing is a joke about one sentence.** It doesn't illustrate the topic ("a server"); it illustrates a specific line ("it has heard your request, and it is not moving"). Readers should look from the picture to the paragraph and grin.
- **Some drawings explain.** Once or twice a chapter, a wider drawing turns a concept into a creature or object with scrawled handwritten labels on its parts, the way *Learn You a Haskell* draws a list as a caterpillar with "head", "tail", "init" and "last" written on it.
- **Handwritten lettering.** Labels and speech are scrawled by hand, slightly crooked, never typeset.
- **Deadpan alt text.** The alt text describes the picture and keeps the joke: "this is you", "load-bearing", "friends".

### What's wrong with the current two

`mascots-beach` (the cover) and `notebook-talks-to-server` (Chapter 1) are polished, painterly scenes with full backgrounds, soft lighting and gradients, placed as one large banner per page. They illustrate the topic literally (a laptop asks, a server answers) rather than making a joke, and the finish reads as stock art. Both should be replaced. The *characters* are good and stay: redraw them in the doodle style.

## The cast, redrawn

Draw each character once as a model sheet before starting the chapters, so they stay consistent.

- **The tanuki:** orange-and-cream raccoon dog, dark eye patches, teal backpack. Curious, a bit naive, always asking for things. Stands in for you and your browser.
- **The shisa:** orange lion-dog with a swirly, scribbled mane. Guardian of doors; unimpressed, immovable, secretly kind. Shisa come in pairs, one with its mouth open, one closed.
- **The crabs:** small red crabs with huge googly eyes on stalks. Always a crowd, never one character. They are traffic, packets, visitors, attackers and onlookers.
- **Computers:** boxy, with simple faces, like everything else here. Servers are slate-blue with a green power light; laptops are yellow.

## Making the files

- **Transparent PNG**, drawn at twice the display size (a 180-pixel-wide spot is drawn 360 pixels wide). Keep the layered source file.
- **File names:** `static/assets/spots/<chapter-slug>-<short-name>.png`, for example `static/assets/spots/getting-an-answer-teapot.png`.
- **Dark mode:** handled for you. The page puts each doodle on a small paper-coloured card in dark mode so black ink stays visible.
- **Using an image generator:** they default to polished, glossy output, which is the opposite of what we want. Ask explicitly for "a crude digital doodle drawn with a tablet pen, thin wobbly black ink lines, flat colours, minimal cel shading, transparent background, no gradients, no texture, no scenery", and expect to throw most results away. Leave lettering out and add it by hand afterwards. Honestly, the best results will come from a person with a tablet and no fear of wobbly lines: the charm of *Learn You a Haskell*'s drawings is that the author drew them himself.

## Placing one in a chapter

Put the shortcode on its own line, directly before the paragraph it belongs to:

```md
{{ spot(src="assets/spots/getting-an-answer-teapot.png", alt="short and stout", side="right", width=170) }}

On 1 April 1998, the IETF, the body that publishes internet standards, ...
```

- `side`: `right` (default), `left`, or `center` for a wide explanatory drawing.
- `width`: display width in pixels. 140–220 for spots, up to 640 for `center`.
- Alternate sides down the page. Never put two spots next to the same paragraph.
- On phones, side spots stop floating and sit centred between paragraphs.

The chapter-header banner (`illustration` in front matter) still works, but don't use it for new drawings: *Learn You a Haskell* opens each chapter with a spot beside the first paragraph instead.

## Priorities

Twenty-three drawings marked **★** below give every chapter its opening spot and its best joke. Draw those first; the rest can follow chapter by chapter. Quotes in the briefs are the sentence the drawing belongs next to.

---

## Cover ★

Replaces `mascots-beach`. One wide drawing, about 900 pixels wide, on transparent background: the tanuki, backpack on, holding up a scrap of paper with `GET /` scrawled on it, looking hopeful. Beside it, the shisa sits with its chest out, looking unimpressed. Three or four crabs peek in from the edges. No beach, no sunset.

Alt: "A tanuki holds up a note that says GET /, next to an unimpressed shisa and some nosy crabs."

The favicon can then be cropped from the new tanuki's face.

## Introduction

**★ The NeXT cube** (right, 180): *"with a handwritten label stuck to it"*. A black cube computer, sweating, with a sign taped to it that just says `DO NOT`. Its little face looks terrified of being switched off. Alt: "please".

**The proposal** (left, 150): *"wrote three words across the top"*. A sheet of paper covered in tiny scribbles, a coffee ring, and three big red loopy words scrawled diagonally across the top (letter them "vague but exciting"). Alt: "approved, apparently".

## 1. Asking for a Page

Retire `notebook-talks-to-server`.

**★ Six terminals** (right, 190): *"if you're on Linux you already have six of them open"*. The tanuki surrounded by six little terminal windows, typing in two of them at once, extremely pleased with itself. Alt: "minimum".

**The blank line** (left, 150): *"That blank line is load-bearing."* An empty, flat rectangle (the blank line) straining on its knees, holding up a wobbling stack of header lines like a weightlifter. Alt: "load-bearing".

**★ The URL express** (center, 600): *the URL diagram*. A little three-carriage train, labels scrawled above each part: the locomotive is `http` ("scheme: which rules"), the middle carriage is `example.com` ("host: who to ask"), the caboose is `/about` ("path: what you want"). The tanuki waves from the caboose. Alt: "the URL express, three carriages".

**★ Tracking pixels** (right, 140): *"a second tracking pixel to keep the first one company"*. Two tiny square pixels with stick legs, holding hands, peering at you suspiciously through binoculars. Alt: "friends".

## 2. Getting an Answer

**Not here** (right, 160): *"Not even an apology."* A slate-blue server with its arms crossed, pointing sideways at a signpost reading `→ https`, not making eye contact. Alt: "elsewhere".

**301 Bananas** (left, 170): *"A server could send 301 Bananas and every browser on earth would still follow the redirect."* A sign reading `301 BANANAS`. A browser window on little legs trots past it in the direction of the arrow, unbothered, carrying a banana. Alt: "close enough".

**The five families** (center, 620): *the 1xx–5xx table*. Five little creatures in a row, each labelled: `1xx` is an hourglass with legs, tapping its foot; `2xx` is a server giving a thumbs up; `3xx` is a server pointing offstage; `4xx` is a server pointing accusingly at *you*; `5xx` is a server lying on its back with X eyes and a puff of smoke. Alt: "the whole family".

**★ The shisa's code** (left, 170): *"It stands at the door, it has heard your request, and it is not moving."* The shisa sitting squarely on a doormat with its eyes closed and nose in the air. A small `403` hangs from its collar like a dog tag. Alt: "no".

**★ The teapot** (right, 170): *"The body is short and stout."* A small, round teapot with stubby arms crossed, glaring at a single coffee bean on the floor in front of it. Alt: "short and stout".

## 3. What's in a Name?

**★ HOSTS.TXT** (left, 190): *"became a comedy for a few thousand"*. An enormous scroll unrolling off the edge of the drawing and down out of frame, with one exhausted crab in a visor trying to write another line at the bottom. Alt: "one more, please".

**The forgotten dot** (right, 140): *"the way nobody bothers typing the full stop at the end of a text message"*. A single small dot with a sad face, sitting alone at the end of a line of scribbles, a tiny paper party hat on its head that nobody noticed. Alt: "the root, feeling overlooked".

**★ The name tree** (center, 600): *the "Reading a name backwards" diagram*. A scraggly upside-down tree. The root at the top is labelled `.`, branches below it are labelled `com`, `org` and `ch`, a twig off `com` is labelled `example`, and from it hangs a luggage tag reading `104.20.23.154`. The tanuki dangles from the `com` branch by one paw, reading a map. Alt: "read it backwards".

**Remembering, briefly** (left, 150): *"What makes resolvers fast is that they remember."* A resolver (a box with spectacles) covered in sticky notes, each with a name and an address, and an egg timer balanced on its head. Alt: "for 300 seconds".

## 4. The Place That Answers

**★ The job description** (right, 170): *"It's waiting, which is the entire job description."* A small server sitting on a stool facing a door, holding a mug of tea, completely still. A single fly circles its head. Alt: "still waiting".

**Favicon** (left, 160): *"Browsers have been asking websites for this file, uninvited, since 1999."* A browser window on legs at a door, holding out a tiny empty frame and asking for `favicon.ico`, while the server behind the door shrugs. Alt: "every single time".

**The doors** (right, 190): *the ports table*. A wall of small numbered doors, `22`, `53`, `80`, `443` and `8000`. All are dark except `8000`, where the tanuki's laptop server peeks out of a lit doorway. Alt: "door 8000".

**★ Every request is a stranger** (left, 170): *the "stateless" section*. A server with a goldfish's face, cheerfully greeting the same tanuki for the third time with a speech bubble: "nice to meet you!". Alt: "who are you again".

## 5. Speaking Clearly

**★ Typing it by hand** (right, 180): *the opening*. The tanuki hunched over a clunky typewriter, tongue out, typing with one claw. A long strip of paper curls out reading `GET / HTTP/1.1`. Alt: "by hand".

**★ CR and LF** (left, 170): *"one character moved the print head back to the left and another moved the paper up"*. Two little creatures holding hands, labelled `\r` and `\n`. `\r` is pulling a typewriter carriage lever; `\n` is turning a paper knob. They are inseparable. Alt: "always together".

**★ The verbs** (center, 620): *the methods table*. A row of six labelled characters: `GET` is a hand reaching out; `HEAD` is just a head with no body, smiling; `POST` is an envelope being shoved through a letterbox; `PUT` is a little crane lowering a box onto a shelf; `PATCH` is a sticking plaster; `DELETE` is an eraser rubbing something out. Alt: "the verbs, one of them is just a head".

**Helpful** (right, 160): *"Google's Web Accelerator started prefetching every link"*. A cheerful robot with a feather duster clicking every link on a page in turn, including a big red one labelled `delete`, while things vanish in puffs behind it. No logos. Alt: "so helpful".

**Matcha** (left, 140): *the cookie exchange*. A crab handing the tanuki a round green cookie labelled `flavour=matcha`, with a tiny note: "bring this back". Alt: "remember me".

## 6. Standing at the Door

**★ The doorman** (right, 180): *the opening*. The shisa wearing a doorman's peaked cap, one paw raised to stop the tanuki, the other holding a clipboard. Alt: "name?".

**★ Two conversations** (left, 170): *"Two complete HTTP conversations, glued together in the middle."* A proxy character holding two old telephone receivers, one to each ear, repeating into one what it hears from the other, eyes rolled upward. Alt: "I'll pass that on".

**Trust me** (right, 150): *"Notice that these headers are claims, not facts."* A crab wearing an obvious fake moustache and glasses, holding up a hand-drawn badge reading `X-Forwarded-For: the president`. Alt: "trust me".

**The empty hallway** (left, 170): *"a doorman, standing in a perfectly working doorway, shrugging at an empty hallway"*. Exactly that: the shisa in its cap, palms up, in front of a long empty corridor with a `502` sign on the wall. Alt: "nobody home".

## 7. Locks, Keys, and Quiet Conversations

**★ The postcard** (right, 170): *"Plain HTTP is a postcard."* A postcard in transit on a conveyor belt, with three crabs reading it over each other's shoulders, one holding a pen to add something. Alt: "everyone's reading".

**★ Paint** (center, 620): *the key agreement explanation*. The classic paint-mixing picture, with labels: a shared pot of yellow (`public`); the tanuki secretly adds red and the server secretly adds blue (each labelled `secret`); they swap the mixed pots in the open; each adds its own secret again; both end up holding the same brown pot (labelled `same!`). Crabs on a fence watch the swap and look baffled. Alt: "nobody sent the brown".

**Turtles, but crabs** (left, 170): *the certificate chain*. A wobbly tower of crabs standing on each other's shoulders, each holding up a signed paper to the one above it. The crab at the bottom wears a tiny crown labelled `root`. Alt: "who vouches for the voucher".

**Perfectly valid** (right, 160): *"proves you're talking to paypa1-login-secure.com, with total cryptographic confidence"*. A shifty figure in a trench coat and sunglasses proudly holding up a certificate with a big gold seal. Alt: "technically correct".

## 8. When Things Get Busy

**★ Room for five** (left, 190): *"Five hundred crabs at a door with room for five"*. A velvet queue rope with exactly five crabs neatly in line, and behind them a mountain of crabs piled up, some giving up and sitting down. Alt: "the queue is full".

**★ Bigger, or more** (center, 600): *vertical and horizontal scaling*. Left half, labelled `bigger`: one enormous bodybuilder server, veins popping, holding up a barbell. Right half, labelled `more`: four small identical servers holding hands in a row, relaxed. Alt: "bigger, or more".

**Coin toss** (right, 150): *"Caddy picks at random by default"*. The shisa flipping a coin, with door `A` on one side and door `B` on the other, while a crab waits. Alt: "fair enough".

**Two hard things** (left, 160): *the Phil Karlton line*. A crab staring at a jar labelled `stuff (still good??)` with a question mark over its head. Alt: "cache invalidation".

**Edge copies** (right, 170): *the CDN section*. Several identical copies of the same page, each wearing a tiny tourist hat and holding a different airport code sign (`ZRH`, `SYD`, `NRT`). Alt: "on tour".

## 9. Running Your Own Corner

**★ The price of a sandwich** (right, 170): *"for about the price of a sandwich a month"*. The tanuki handing a sandwich across a counter to a crab, in exchange for a tiny server held out on a tray. Alt: "fair trade".

**Two halves** (left, 160): *the SSH key*. A key snapped in two. One half, labelled `.pub`, hangs from a necklace the tanuki is happily handing out to everyone. The other half is hidden in its sock. Alt: "keep the sock half".

**★ Three doors** (right, 180): *"three doors, and a wall everywhere else"*. A long brick wall with exactly three doors labelled `22`, `80` and `443`, and the shisa sitting on top of the wall, keeping watch. Alt: "and a wall everywhere else".

**★ Houseplant** (left, 160): *"A server is a bit like a houseplant"*. A small server growing out of a flowerpot, being watered by the tanuki with a watering can labelled `apt upgrade`. Alt: "it needs something".

**Yours** (center, 520): *the closing paragraph*. Night. The tanuki's little server sits on a hill with a lamp on. Far away, one crab is walking up the path toward it, holding a note that says `GET /`. Alt: "one of the two computers is now yours".
