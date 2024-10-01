> [!NOTE]
> Plugin is under development

# rehype-alerts

![test ci badge](https://github.com/nikitarevenco/rehype-alerts/actions/workflows/tests.yml/badge.svg)

A **[rehype][]** plugin that extends blockquote syntax to allow for GitHub-style alerts with more customization.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Security](#security)
- [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to extend blockquote syntax to allow simple citation/mention of source from which the quote originates conforming to semantic HTML standards

## When should I use this?

This project is useful if you want to have a simple syntax for citations in your blockquotes.

In markdown we can create blockquotes such as:

```md
> We cannot solve our problems with the same thinking we used when we created them.
```

But often times, it may be desireable to include a reference to the person that mentioned that quote.

We might think to use the `<cite>` element:

```md
> We cannot solve our problems with the same thinking we used when we created them.
> -- <cite>Albert Einstein</cite>
```

But that is _semantically incorrect_! [A `<cite>` element should refer to _work_](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite#usage_notes) and not _people_. (e.g. instagram post, book, article)

Additionally, putting a `<cite>` element within a `<blockquote>` is [forbidden by the HTML spec](https://www.w3.org/TR/html5-author/the-blockquote-element.html#the-blockquote-element) because it would make the citation a part of the quote.

So another solution could be something like this:

```md
> We cannot solve our problems with the same thinking we used when we created them.

-- Albert Einstein
```

But that feels wrong, because it would render in the following way:

```html
<blockquote>
  <p>
    We cannot solve our problems with the same thinking we used when we created
    them.
  </p>
</blockquote>
<p>-- Albert Einstein</p>
```

If we want to style them together we would have to wrap them within a parent element.

But there is a different approach, using the `<figure>` element we can create a more semantic version.

This plugin does just that.

For instance, by turning the following syntax:

```md
> [!NOTE] hello world
>
> goodbye moon
```

...which is equivalent to the following HTML:

```html
<blockquote>
  <p>[!NOTE] hello world</p>
  <p>goodbye moon</p>
</blockquote>
```

Into:

```html
<aside data-alert-container="NOTE" data-alert-title="hello world">
  <p data-alert-header="">hello world</p>
  <p>goodbye moon</p>
</aside>
```

Then we can easily style the aside and the title however we want to using CSS

```css
[data-alert-container="NOTE"] {
  background-color: blue;
}
[data-alert-header] {
  font-size: 16px;
}
```

Or even replace with our own custom component (e.g. if we were using MDX)

```jsx
export const mdxComponents: MDXComponents = {
  aside: ({ children, ...rest }) => {
    if (typeof rest["data-alert-container"] === "string") {
      // OK, we are only targeting the custom alerts
      return <MyAwesomeComponent />
    }
    
    // do nothing to non alerts
    return <aside {...rest}>{children}</aside>
  }
};
```

## Install

Install with your package manager:

```
npm install rehype-alerts
```

```
pnpm add rehype-alerts
```

```
bun add rehype-alerts
```

```
deno add rehype-alerts
```

## Use

Say we have the following file `example.js`:

```js
import rehypeFormat from "rehype-format"; // for demonstration purposes only
import rehypeSemanticBlockquotes from "rehype-semantic-blockquotes";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const markdown = `
> [!NOTE] hello world
>
> goodbye moon
`;

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSemanticBlockquotes)
    .use(rehypeStringify)
    .use(rehypeFormat) // for demonstration purposes only
    .process(markdown),
);

console.log(html);
```

...then running `node example.js` yields:

```html
<aside data-alert-container="NOTE" data-alert-title="hello world">
  <p data-alert-header="">hello world</p>
  <p>goodbye moon</p>
</aside>
```

## API

This package exports no identifiers. The default export is `rehypeAlerts`.

#### `unified().use(rehypeSemanticBlockquotes)`

A rehype plugin to add github-style blockquote syntax for alerts.

###### Parameters

The attributes (`data-alert-container`, etc.) are fully customizable. The tag of the title (`p`) can also be changed.

The plugin takes a parameter, `opts` with the following defaults:

```js
{
    aside: "dataAlertContainer", // HTML attribute: data-alert-container
    asideTitle: "dataAlertTitle", // HTML attribute: data-alert-title
    header: "dataAlertHeader", // HTML attribute: data-alert-header
    headerTag: "p",
};
```

> [!NOTE]
> Even though we use camelCase here, it will output as kebab-case
>
> See: https://github.com/syntax-tree/hast#propertyname


###### Returns

Transform ([`Transformer`][unified-transformer]).

#### Syntax Info

In the MD blockquote, if the last line starts with an `@ ` and the line before is an empty line then the transformation will take place. Otherwise we will just get a regular `<blockquote>`, the plugin won't take effect.

For example these snippets will not be affected by the plugin:

```md
> We cannot solve our problems with the same thinking we used when we created them.
```

```md
> [!NOTE] hello world
> goodbye moon
```

```md
> [!NOTE] hello world
>
> goodbye moon
```

But these would:

```md
> [!NOTE] hello world
>
> goodbye moon
```

## License

[MIT][license] © Nikita Revenco

[npm]: https://docs.npmjs.com/cli/install
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[license]: license
[hast]: https://github.com/syntax-tree/hast
[rehype]: https://github.com/rehypejs/rehype
[remark]: https://github.com/remarkjs/remark
[unified]: https://github.com/unifiedjs/unified
[unified-transformer]: https://github.com/unifiedjs/unified#transformer
[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
[api-remark-unlink]: #unifieduseremarkvideos
