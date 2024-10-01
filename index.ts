import { visit } from "unist-util-visit";
import { whitespace } from 'hast-util-whitespace'
import type { Nodes, Root } from "hast";

const firstElement = (element: Nodes) => !whitespace(element);

/**
 * A rehype plugin to add github-style blockquote syntax for alerts.
 * More info: [https://github.com/nikitarevenco/rehype-alerts](https://github.com/nikitarevenco/rehype-alerts)
 */
export default function rehypeAlerts(
  opts = {
    /**
     * Attribute name for the `<aside>` element
     */
    aside: "data-alert-container",
    /**
     * Attribute name containing the title for the alert in the `<aside>` element
     */
    asideTitle: "data-alert-title",
    /**
     * Attribute name for the title element
     */
    header: "data-alert-header",
    /**
     * Element type for the title element
     */
    headerTag: "h5",
  },
) {
  return (tree: Root) => {
    visit(tree, "element", (alert, index, parent) => {
      if (!index || !parent || alert.tagName !== "blockquote") {
        return;
      }

      const firstParagraph = alert.children.find(firstElement)

      if (!firstParagraph || firstParagraph.type !== "element" || firstParagraph.tagName !== "p") {
        return;
      }

      const alertSyntax = firstParagraph.children.at(0);

      if (!alertSyntax) {
        return;
      }

      if (
        alertSyntax.type !== "text" ||
        !alertSyntax.value.startsWith("[!")
      ) {
        return;
      }

      /**
       * Extracts e.g. "hello world" from "[!hello world] whatever"
       */
      const typeExtracter = /\[!(.*?)\]/;

      const syntaxMatch = alertSyntax.value.match(typeExtracter);

      if (!syntaxMatch) {
        return;
      }

      const fullMatch = syntaxMatch.at(0)

      if (!fullMatch) {
        return;
      }

      const alertType = syntaxMatch.at(1);

      const withAlertTypeRemoved = alertSyntax.value.slice(
        fullMatch.length,
      );

      const nextNewlinePosition = withAlertTypeRemoved.indexOf("\n");

      const title = withAlertTypeRemoved.trim()

      if (title.includes("\n")) {
        return;
      }

      alertSyntax.value = withAlertTypeRemoved.slice(nextNewlinePosition + 1);

      const firstElementIndex = alert.children.findIndex(firstElement)
      const otherChildren = alert.children.slice(firstElementIndex + 1)

      parent.children[index] = {
        type: 'element',
        tagName: 'aside',
        properties: { [opts.aside]: alertType, [opts.asideTitle]: title },
        children: otherChildren
      };

      // Title is optional, so don't add an element if it isn't present
      if (title) {
        parent.children[index].children.unshift({
          type: "element",
          tagName: opts.headerTag,
          properties: { [opts.header]: "" },
          children: [{ type: "text", value: title }],
        });
      }
    });
  };
}
