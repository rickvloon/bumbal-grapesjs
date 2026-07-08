import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
import { weightNames } from "./traits";

export default (editor: Editor, _opts: Required<PluginOptions>) => {
	const domc = editor.DomComponents;

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

	// Strip "id" and "title" from every other registered type's traits,
	// whatever they currently are (string names or trait config objects),
	// instead of hardcoding a reduced list per type.
	const removeNames = ["id", "title"];
	const isRemoved = (trait: any) => removeNames.indexOf(typeof trait === "string" ? trait : trait?.name) >= 0;

	domc.getTypes().forEach((type: any) => {
		const proto = type.model?.prototype;
		if (!proto) return;

		const currentDefaults = typeof proto.defaults === "function" ? proto.defaults() : proto.defaults;
		const currentTraits: any[] = (currentDefaults && currentDefaults.traits) || [];
		if (!currentTraits.length) return;

		const traits = currentTraits.filter((trait) => !isRemoved(trait));
		if (traits.length === currentTraits.length) return;

		domc.addType(type.id, {
			model: {
				defaults: { traits },
			},
		} as any);
	});
};
