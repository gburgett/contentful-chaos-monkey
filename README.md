# Contentful Chaos Monkey

Contentful Chaos Monkey tests your website by modifying data in your Contentful
space, intentionally breaking it in all the ways it knows how.  After breaking
links, removing content, changing out assets, etc. Contentful Chaos Monkey will
GET your configured preview endpoint, and report if the status code has changed.

### Why would I want to break my site?

Your clients are *not developers*.  They don't think like you.  They can and will
break your carefully crafted Contentful schema in all these ways and more.  And
then they'll get mad at *you* when the site doesn't work.  So make sure your site
works regardless of what they do on the Contentful side.

Contentful Chaos Monkey does anything and everything that a human can do within
the bounds of your Contentful schema.  It will unlink entries that your app requires
to be linked.  It will insert links to unpublished entries.  It will insert links
to entries that are not of the expected content type.  It will change text data
randomly, delete fields, or make them longer than you thought they could be.  Your
clients do all this and more all the time, so be prepared for it.

# Roadmap

- [ ] Given the ID of a page, mutate links to other entries & hit the configured preview link
- [ ] Given the ID of a section, mutate it and hit linking page's preview link(s)
- [ ] Given the content type "page", mutate all pages & hit their preview links
- [ ] Add `--recursive` flag to recurse down the tree mutating as it goes
- [ ] Add `--execute` flag to run some tool with the resulting HTML after each change