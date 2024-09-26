import { visit } from "unist-util-visit";

export default function rehypeAlerts(
  opts = {
    aside: "data-alert-container",
    header: "data-alert-header",
    headerTag: "p",
  },
) {
  return (tree) => {
    const isMdx = tree.children?.[0]?.type === "mdxjsEsm";

    visit(tree, "element", (alert, index, parent) => {
      if (alert.tagName === "blockquote") {
        const firstParagraph = alert.children.at(1);

        const alertSyntax = firstParagraph.children.at(0);

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

        const alertType = syntaxMatch.at(1);

        const withAlertTypeRemoved = alertSyntax.value.slice(
          syntaxMatch.at(0).length,
        );

        const nextNewlinePosition = withAlertTypeRemoved.indexOf("\n");

        const title =
          nextNewlinePosition === 0
            ? false
            : withAlertTypeRemoved.slice(0, nextNewlinePosition);

        alertSyntax.value = withAlertTypeRemoved.slice(nextNewlinePosition + 1);

        const type = isMdx ? "mdxJsxFlowElement" : "element";
        const name = isMdx ? "name" : "tagName";
        const attributes = isMdx ? "attributes" : "properties";

        const ast = {
          type,
          [name]: "aside",
          [attributes]: isMdx
            ? [
                {
                  type: "mdxJsxAttribute",
                  name: opts.aside,
                  value: alertType,
                },
              ]
            : {
                [opts.aside]: alertType,
              },
          children: alert.children,
        };

        if (title) {
          ast.children.unshift({
            type,
            [name]: opts.headerTag,
            [attributes]: isMdx
              ? [
                  {
                    type: "mdxJsxAttribute",
                    name: opts.header,
                    value: "",
                  },
                ]
              : {
                  [opts.header]: "",
                },
            properties: {},
            children: [{ type: "text", value: title }],
          });
        }

        parent.children[index] = ast;
      }
    });
  };
}
