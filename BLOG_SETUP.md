# Blog publishing

The site uses GitHub Pages' Jekyll build on the `whynotwork` branch.
Posts live in `_posts`, images in `assets/blog`, and the editor schema in
`.pages.yml`. Do not restore `.nojekyll`: it would disable post rendering.

## Writing

Open https://txxnrd.github.io/admin/ and follow the Pages CMS link. Sign in with
GitHub and connect **only `txxnrd/txxnrd.github.io`**. The editor targets
`whynotwork`, the publishing branch.

Write the title and body, add images or tags if needed, turn on **블로그에 공개 /
Publish on site**, and save. Pages CMS commits the Markdown and uploaded images
to GitHub; the existing Pages deployment then updates the site. Check the
repository's Actions tab if a deployment fails.

Posts with `published: false` (or no `published` field) are omitted from the
site, feed, and sitemap. Their source is still visible in this **public
repository**, including Git history. This is not private draft storage.
Future-dated posts require a new Pages build on or after that date to appear;
there is no scheduled publishing job.

Filenames stay fixed after creation. `/blog/:path/` keeps a post's URL stable
when its display date or title changes. Each post also has a generated
`comment_id`; keep this value when editing so its comment thread remains linked.

## Comments

Comments use giscus and GitHub Discussions. The `Comments` discussion category
uses the Announcement format; visitors can reply through GitHub sign-in.

To finish connecting comments:

1. Install the official giscus GitHub App for this repository only.
2. Select this repository and the `Comments` category at https://giscus.app/.
3. Copy the public repository/category IDs into `_config.yml` and set
   `comments.enabled: true`.

These IDs are public configuration, not credentials. Do not add tokens or app
secrets to the site. `comments.js` maps each thread to `blog:<comment_id>` and
follows the site's theme. `giscus.json` limits embedding to the production origin.

## Local preview

With a supported Ruby and Bundler:

```sh
bundle install
LANG=en_US.UTF-8 bundle exec jekyll serve
```

Use a real absolute source path on macOS when building outside this checkout
(for example `/private/tmp/...`, not the `/tmp` symlink). Tests of unpublished
and future posts should use a temporary source copy, never production posts.

The public blog remains readable without JavaScript. Search and tag filters
enhance the generated listing; comments require JavaScript and GitHub access.
