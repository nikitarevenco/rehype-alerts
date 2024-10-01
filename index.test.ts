import rehypeFormat from "rehype-format";
import rehypeAlerts from "./index.js";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const doc = `
> [!NOTE] title
> description
`;

const file = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeAlerts)
    .use(rehypeStringify)
    .use(rehypeFormat)
    .process(doc),
);

console.log(file);
