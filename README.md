# Code & Cadence — Jekyll theme drop-in

Charcoal & Ember editorial redesign for `blog.codecadence.se`.
Space Grotesk (display) · Inter (body) · JetBrains Mono (labels).

## Files

Drop each file into the same path in your repo, overwriting the existing one:

```
_layouts/default.html      ← replace
_layouts/post.html         ← replace
_layouts/page.html         ← replace
index.html                 ← replace
assets/style.scss          ← replace
_sass/_variables.scss      ← replace
```

The following files are **not touched** and keep working as-is:
`_includes/*`, `_sass/_reset.scss`, `_sass/_darcula.scss`, `_sass/_svg-icons.scss`,
`_sass/_highlights.scss`, `_pages/*`, `_posts/*`, `_config.yml`, `search.json`.

Nav still points to: Feed (`/`), Archive (`/archive`), About (`/about`),
Search (`/search`), SV (`/welcome-to-svenska/`). The "Callista Posts" link was
dropped from the primary nav to reduce clutter — the page still exists at
`/callista-posts` and remains linkable from posts/archive.

## Test locally

```
bundle exec jekyll serve
```

Open http://localhost:4000.

## Notes

- The site avatar (`/images/cclogo-26.png`) is reused as a small 40×40 logo
  next to the "CODE & CADENCE" wordmark. No image swap required.
- Legacy Sass variables (`$blue`, `$black`, `$darkerGray`, `$helvetica`, …)
  are kept as aliases so `_darcula.scss` and any post-embedded styles keep
  compiling.
- The manifesto ("Shut up and [code | pedal] faster") is rendered only on the
  home page via `{% if page.url == "/" %}`.
- `enforce_ssl` and `permalink` structure in `_config.yml` are unchanged — no
  URLs move, so RSS subscribers and inbound links keep working.

## Rollback

Everything is a straight file overwrite; `git checkout -- <path>` reverts any
individual file.
