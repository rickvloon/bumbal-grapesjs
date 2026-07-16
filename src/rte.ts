import type { Editor, RichTextEditorAction } from "grapesjs";
import { PluginOptions } from ".";
import { alignIcons } from "./traits";
import { t } from "./i18n";

const alignCommands: Record<string, string> = {
	left: "justifyLeft",
	center: "justifyCenter",
	right: "justifyRight",
	justify: "justifyFull",
};

export default (editor: Editor, _opts: Required<PluginOptions>) => {
	const rte = editor.RichTextEditor;

	// Replaces the whole default action set (bold/italic/underline/
	// strikethrough/link/wrap) with our own order and icons - adds text
	// align (not part of GrapesJS's defaults) up front, reorders
	// bold/italic/strikethrough/underline to match the "Text decorations"
	// trait's own convention, keeps the default link icon as-is, and swaps
	// "wrap" (wrap selection in a <span> for the Style Manager) for a plain
	// text-colour picker.
	const alignActions: RichTextEditorAction[] = (["left", "center", "right", "justify"] as const).map((align) => ({
		name: `align-${align}`,
		icon: alignIcons[align],
		attributes: { title: t(`rte.align.${align}`) },
		state: (rteInst: any) => (rteInst?.doc.queryCommandState(alignCommands[align]) ? 1 : 0),
		result: (rteInst: any) => rteInst.exec(alignCommands[align]),
	}));

	const colorAction: RichTextEditorAction = {
		name: "color",
		icon: `<input type="color" class="gjs-rte-color-input" title="${t("rte.textColour")}" />`,
		event: "change",
		result: (rteInst: any, action: any) => rteInst.exec("foreColor", action.btn?.firstChild?.value),
	} as any;

	rte.actions = [...alignActions, "bold", "italic", "strikethrough", "underline", "link", colorAction] as any;
};
