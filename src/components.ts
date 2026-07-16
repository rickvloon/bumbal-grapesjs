import type { Editor } from "grapesjs";
import { PluginOptions } from ".";

const preserveTwigComments = (editor: Editor) => {
  const domc = editor.DomComponents
  const textnodeType = domc.getType("textnode")

  if (!textnodeType) return

  domc.addType("twig", {
    model: textnodeType.model.extend(
      {
        toHTML() {
          return `<!--${this.get("content")}-->`
        }
      },
      {
        isComponent(el: Node) {
          if (el.nodeType !== Node.COMMENT_NODE) return
          const content = el.textContent?.trim() ?? ""

          if (content.startsWith("{%") && content.endsWith("%}")) {
            return {
              tagName: "comment",
              type: "twig",
              content
            }
          }
        }
      }
    ),
    extendView: "text"
  })
}

// Wraps bare twig tags (`{% for x in y %}`, not already inside an HTML
// comment) in `<!-- -->` so they end up handled by `preserveTwigComments`'s
// "twig" type once parsed. Doing this on the raw string, before GrapesJS (or
// even the browser) parses any HTML, sidesteps a real problem a component-type
// check can't fix after the fact: a bare `{% for %}` sitting directly inside
// a `<table>` (outside a `<tr>`/`<td>`) is invalid HTML, and the browser's own
// parser "foster-parents" (relocates) that stray text out of the table before
// anything of ours ever sees it. Comments are valid anywhere and never get
// relocated, so transforming the string first avoids that entirely.
export const wrapBareTwigInComments = (html: string): string =>
  html.replace(/(<!--[\s\S]*?-->)|(\{%[\s\S]*?%\})/g, (_match, comment, twig) => (comment ? comment : `<!--${twig}-->`));

export default (editor: Editor, _opts: Required<PluginOptions>) => {
  preserveTwigComments(editor);
};
