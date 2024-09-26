# rehype-alerts

A **[rehype][]** plugin to allow for github-style alerts but with more customisation

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Security](#security)
- [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to allow you to create github alerts with way more control

## When should I use this?

This project is useful if you want to have admonitions / alerts in markdown

## Install

This package is [ESM only][esm]. In Node.js (version 16+), install with [npm][]:

```
npm install rehype-semantic-blockquotes
```

## Use

Say we have the following file `example.js`:

```js
import rehypeFormat from "rehype-format";
import rehypeSemanticBlockquotes from "rehype-semantic-blockquotes";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const doc = `
> Better to admit you walked through the wrong door than spend your life in the wrong room.
>
> @ [Josh Davis](https://somewhere.com) <a href="https://somewhere.com"></a>
`;

const file = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSemanticBlockquotes)
    .use(rehypeStringify)
    .use(rehypeFormat) // for demonstration purposes only
    .process(doc),
);

console.log(file);
```

...then running `node example.js` yields:

```html
<figure data-blockquote-contaienr="">
  <blockquote data-blockquote-content="">
    <p>
      Better to admit you walked through the wrong door than spend your life in
      the wrong room.
    </p>
  </blockquote>
  <figcaption data-blockquote-credit="">
    <p><a href="https://somewhere.com">Josh Davis</a></p>
  </figcaption>
</figure>
```

## API

This package exports no identifiers. The default export is `rehypeSemanticBlockquotes`.

#### `unified().use(rehypeSemanticBlockquotes)`

Adds syntax `@ ` which places the contents in the `@ ` into the `<figcaption>` element

###### Parameters

The attributes (`data-blockquote-figure`, etc.) are fully customizable. The plugin takes a parameter, `opts` with the following defaults:

```js
{
    figure: "data-blockquote-contaienr",
    blockquote: "data-blockquote-content",
    figcaption: "data-blockquote-credit",
    syntax: "@ ",
};
```

###### Returns

Transform ([`Transformer`][unified-transformer]).

#### Syntax Info

In the MD blockquote, if the last line starts with an `@ ` and the line before is an empty line then the transformation will take place. Otherwise we will just get a regular `<blockquote>`, the plugin won't take effect.

For example these snippets will not be affected by the plugin:

```md
> We cannot solve our problems with the same thinking we used when we created them.
```

```md
> We cannot solve our problems with the same thinking we used when we created them.
> @ Albert Einstein
```

But this would:

```md
> We cannot solve our problems with the same thinking we used when we created them.
>
> @ Albert Einstein
```

## Security

Use of `rehype-semantic-blockquotes` does not involve **[rehype][]** (**[hast][]**) or user
content so there are no openings for [cross-site scripting (XSS)][wiki-xss]
attacks.

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
