import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
import { weightNames } from "./traits";

export default (editor: Editor, _opts: Required<PluginOptions>) => {
	const domc = editor.DomComponents;

	// Overrides the built-in "text" type in place (affects every text-based
	// component: paragraphs, headings, subtitles, ...). `stylable: false`
	// hides the Style Manager entirely (Dimension, Typography, Decorations
	// sectors all disappear too, since every property in them is filtered
	// out); the custom traits below become the only settings UI, rendered as
	// one flat list with no category headers.
	domc.addType("text", {
		model: {
			defaults: {
				stylable: false,
				traits: [
					{ type: "decoration-group", name: "text-decorations", label: "Text decorations" },
					{ type: "align-group", name: "text-align", label: "Text align" },
					{
						type: "stepper",
						name: "font-size",
						label: "Font size",
						property: "font-size",
						unit: "px",
						min: 8,
						max: 96,
						step: 1,
						default: 16,
					},
					{
						type: "stepper",
						name: "font-weight",
						label: "Font weight",
						property: "font-weight",
						unit: "",
						min: 100,
						max: 900,
						step: 100,
						default: 400,
						format: (value: number) => weightNames[value] || String(value),
					},
					{ type: "text-color", name: "text-color", label: "Text colour" },
					{ type: "link", name: "link", label: "Link" },
				],
			},
		},
	} as any);
};
