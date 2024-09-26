/**
 * A rehype plugin to extend blockquote syntax to make it simple to mention/cite sources in a semantically correct way.
 *
 * More info: [https://github.com/nikitarevenco/remark-semantic-blockquotes](https://github.com/nikitarevenco/remark-semantic-blockquotes)
 */
export default function rehypeAlerts(options: {
  /**
   * Attribute name for the <aside> element, default: "data-alert-container"
   */
  aside?: string;
  /**
   * Attribute name for the aside header element, default: "data-alert-header"
   */
  header?: string;
  /**
   * HTML Tag to use for the aside header element, default: "p"
   */
  headerTag?: string;
}): (tree: Root) => undefined;

export type Root = import("hast").Root;
