import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
import { weightNames } from "./traits";

// Font size/weight + text colour traits shared by "text", "button" and
// "portal-link" - kept in one place so the three types can't drift apart.
const styleTraits = () => [
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
];

export default (editor: Editor, _opts: Required<PluginOptions>) => {
	const domc = editor.DomComponents;

	domc.addType("text", {
		model: {
			defaults: {
				stylable: false,
				traits: [
					{ type: "decoration-group", name: "text-decorations", label: "Text decorations" },
					{ type: "align-group", name: "text-align", label: "Text align" },
					...styleTraits(),
					{ type: "link", name: "link", label: "Link" },
				],
			},
		},
	} as any);

	// The button block renders as `<a class="button">`, so it's already its
	// own <a> rather than something to wrap in one - this type layers the
	// same style-driven traits as "text" on top of the built-in "link" type.
	domc.addType("button", {
		extend: "link",
		isComponent: (el: HTMLElement) => {
			if (el.tagName === "A" && el.classList && el.classList.contains("button")) {
				return { type: "button" };
			}
		},
		model: {
			defaults: {
				stylable: false,
				traits: [
					{ type: "decoration-group", name: "text-decorations", label: "Text decorations" },
					{ type: "align-group", name: "text-align", label: "Button align", alignTarget: "parent" },
					...styleTraits(),
					{ type: "text-color", name: "bg-color", label: "Background colour", property: "background-color" },
					{ type: "link", name: "link", label: "Link", wrap: false },
				],
			},
		},
	} as any);

	// The portal-link block is set explicitly to this type (see blocks.ts),
	// rather than detected via `isComponent` like "button" - it swaps the
	// free-text "Link" trait for a fixed "Link to" dropdown, since its href
	// is always one of the known portal URLs, not an arbitrary one.
	domc.addType("portal-link", {
		extend: "link",
		model: {
			defaults: {
				stylable: false,
				traits: [
					{
						type: "select",
						name: "href",
						label: "Link to",
						options: [
							{ id: "/afspraken/?token={{uuid}}&zipcode={{address.zipcode}}", name: "Appointment portal" },
							{ id: "/eta/?token={{uuid}}&zipcode={{address.zipcode}}", name: "Client portal" },
						],
					},
					{ type: "decoration-group", name: "text-decorations", label: "Text decorations" },
					{ type: "align-group", name: "text-align", label: "Button align", alignTarget: "parent" },
					...styleTraits(),
					{ type: "text-color", name: "bg-color", label: "Background colour", property: "background-color" },
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
