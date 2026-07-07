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

export default (editor: Editor, _opts: Required<PluginOptions>) => {
  preserveTwigComments(editor);
};
