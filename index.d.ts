import type { Root } from "hast";
/**
 * A rehype plugin to add github-style blockquote syntax for alerts.
 * More info: [https://github.com/nikitarevenco/rehype-alerts](https://github.com/nikitarevenco/rehype-alerts)
 */
export default function rehypeAlerts(opts?: {
    /**
     * Attribute name for the `<aside>` element
     */
    aside: string;
    /**
     * Attribute name containing the title for the alert in the `<aside>` element
     */
    asideTitle: string;
    /**
     * Attribute name for the title element
     */
    header: string;
    /**
     * Element type for the title element
     */
    headerTag: string;
}): (tree: Root) => void;
//# sourceMappingURL=index.d.ts.map