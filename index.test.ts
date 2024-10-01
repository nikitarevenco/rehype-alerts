import rehypeStringify from "rehype-stringify";
import rehypeFormat from "rehype-format";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeParse from "rehype-parse";
import { unified } from "unified";
import rehypeSemanticBlockquotes from "./index.ts";

import test from "node:test";
import assert from "node:assert";

// const markdownTests = [];

const mdi = `
> [!NOTE] noneo
> goodbye moon
`

const htmli = "lol"

const html = String(
  await unified()
    .use(rehypeParse)
    .use(rehypeSemanticBlockquotes)
    .use(rehypeStringify)
    .process(htmli)
);

const md = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSemanticBlockquotes)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(mdi)
)

console.log(md)

// const htmlTests = [];

// markdownTests.forEach(async ([message, input, expected]) => {
//   const actual = String(
//     await unified()
//       .use(remarkParse)
//       .use(remarkRehype)
//       .use(rehypeSemanticBlockquotes)
//       .use(rehypeStringify)
//       .process(input),
//   );
//
//   test(`MD -> HTML: ${message}`, () => {
//     assert.strictEqual(actual, expected);
//   });
// });

// htmlTests.forEach(async ([message, input, expected]) => {
//   const actual = String(
//     await unified()
//       .use(rehypeParse)
//       .use(rehypeSemanticBlockquotes)
//       .use(rehypeStringify)
//       .process(input)
//   );
//
//   test(`HTML: ${message}`, () => {
//     assert.strictEqual(actual, expected);
//   });
// });
