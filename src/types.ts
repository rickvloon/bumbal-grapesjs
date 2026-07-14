import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
import { weightNames } from "./traits";

// Font size/weight + text colour traits shared across several types - kept
// in one place so they can't drift apart from each other.
const fontSizeTrait = () => ({
	type: "stepper",
	name: "font-size",
	label: "Font size",
	property: "font-size",
	unit: "px",
	min: 8,
	max: 96,
	step: 1,
	default: 16,
});

const fontWeightTrait = () => ({
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
});

const textColorTrait = () => ({ type: "text-color", name: "text-color", label: "Text colour" });

// "text", "button" and "portal-link" all get font size + weight + colour.
const styleTraits = () => [fontSizeTrait(), fontWeightTrait(), textColorTrait()];

export default (editor: Editor, opts: Required<PluginOptions>) => {
	const domc = editor.DomComponents;
	const portalBaseUrl = `https://${opts.bumbalOptions.instance}.bumbal.eu`;

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

	// The plain "Link" block is explicitly this type (see blocks.ts) - same
	// style-driven traits and default look as "portal-link", but with a
	// free-text "Link" trait (self href, since the component already is the
	// <a>) instead of portal-link's fixed "Link to" dropdown.
	domc.addType("link", {
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
						type: "custom-select",
						name: "href",
						label: "Link to",
						options: [
							{
								id: `${portalBaseUrl}/afspraken/?token={{uuid}}&zipcode={{address.zipcode}}`,
								name: "Appointment portal",
							},
							{
								id: `${portalBaseUrl}/eta/?token={{uuid}}&zipcode={{address.zipcode}}`,
								name: "Client portal",
							},
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

	// The Packageline and Notes blocks are both a plain `<table class="np-table ...">`
	// (see blocks.ts) - Text align/Font size/Text colour set here on the table
	// itself cascade down to the `<span>`s in every row via normal CSS
	// inheritance, so one set of traits covers both blocks. The panel header
	// still shows "Notes" vs "Packagelines" separately - see deriveTitle,
	// which keys off the extra "notes-table"/"packageline-table" class.
	domc.addType("notes-packageline", {
		extend: "table",
		isComponent: (el: HTMLElement) => {
			if (el.tagName === "TABLE" && el.classList && el.classList.contains("np-table")) {
				return { type: "notes-packageline" };
			}
		},
		model: {
			defaults: {
				stylable: false,
				traits: [
					{ type: "align-group", name: "text-align", label: "Text align" },
					fontSizeTrait(),
					textColorTrait(),
				],
			},
		},
	} as any);

	// Override the built-in "image" type (no `extend`/`extendView` needed -
	// reusing the same id extends the existing model/view automatically):
	// swap the default ["alt"] trait for our own drag-and-drop uploader plus
	// alignment/alt-text/link traits, and disable the default
	// double-click-to-open-Asset-Manager behaviour so the upload happens
	// inline in the traits panel instead of via a popup.
	domc.addType("image", {
		view: {
			onActive(ev: Event) {
				ev?.stopPropagation();
			},
		},
		model: {
			defaults: {
				stylable: false,
				traits: [
					{ type: "image-upload", name: "src", label: false },
					{ type: "align-group", name: "text-align", label: "Image align", alignTarget: "parent" },
					{ type: "alt-text", name: "alt", label: "alt-text" },
					{ type: "link", name: "link", label: "Link", wrap: "parent" },
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
