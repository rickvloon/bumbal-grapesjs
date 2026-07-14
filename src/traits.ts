import type { Editor, Component } from "grapesjs";
import { PluginOptions } from ".";

const weightNames: Record<number, string> = {
	100: "Thin",
	200: "Extra light",
	300: "Light",
	400: "Regular",
	500: "Medium",
	600: "Semibold",
	700: "Bold",
	800: "Extra bold",
	900: "Black",
};

const normalizeWeight = (raw: string | undefined): number => {
	if (raw === "bold") return 700;
	if (raw === "normal" || !raw) return 400;
	const n = parseInt(raw, 10);
	return Number.isNaN(n) ? 400 : n;
};

const decorationTokens = (raw: string | undefined): string[] =>
	(raw || "").split(/\s+/).filter((token) => token && token !== "none");

const icon = (paths: string, viewBox = "0 0 24 24", size = 16) =>
	`<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;

const dupIcon = icon(
	'<path d="M18.7105 20.1818H8.86842V7.45455H18.7105M18.7105 5.63636H8.86842C8.39382 5.63636 7.93866 5.82792 7.60307 6.1689C7.26748 6.50987 7.07895 6.97233 7.07895 7.45455V20.1818C7.07895 20.664 7.26748 21.1265 7.60307 21.4675C7.93866 21.8084 8.39382 22 8.86842 22H18.7105C19.1851 22 19.6403 21.8084 19.9759 21.4675C20.3115 21.1265 20.5 20.664 20.5 20.1818V7.45455C20.5 6.97233 20.3115 6.50987 19.9759 6.1689C19.6403 5.82792 19.1851 5.63636 18.7105 5.63636ZM16.0263 2H5.28947C4.81488 2 4.35972 2.19156 4.02412 2.53253C3.68853 2.87351 3.5 3.33597 3.5 3.81818V16.5455H5.28947V3.81818H16.0263V2Z" fill="black"/>',
);
const trashIcon = icon(
	'<path d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="currentColor"/>',
);
const closeIcon = icon(
	'<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black"/>',
);
const linkIcon = icon(
	'<path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C5.67392 7 4.40215 7.52678 3.46447 8.46447C2.52678 9.40215 2 10.6739 2 12C2 13.3261 2.52678 14.5979 3.46447 15.5355C4.40215 16.4732 5.67392 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C18.3261 17 19.5979 16.4732 20.5355 15.5355C21.4732 14.5979 22 13.3261 22 12C22 10.6739 21.4732 9.40215 20.5355 8.46447C19.5979 7.52678 18.3261 7 17 7Z" fill="black"/>',
);
const chevronDownIcon = icon(
	'<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
	"0 0 10 6",
	10,
);

const cloudUploadIcon = icon(
	'<path d="M6.5 20C4.98 20 3.68333 19.4767 2.61 18.43C1.53667 17.3767 1 16.0933 1 14.58C1 13.28 1.39 12.12 2.17 11.1C2.95667 10.08 3.98333 9.43 5.25 9.15C5.67 7.61667 6.50333 6.37667 7.75 5.43C9.00333 4.47667 10.42 4 12 4C13.9533 4 15.6067 4.68 16.96 6.04C18.32 7.39333 19 9.04667 19 11C20.1533 11.1333 21.1067 11.6333 21.86 12.5C22.62 13.3533 23 14.3533 23 15.5C23 16.7533 22.5633 17.8167 21.69 18.69C20.8167 19.5633 19.7533 20 18.5 20H13C12.4533 20 11.9833 19.8033 11.59 19.41C11.1967 19.0233 11 18.5533 11 18V12.85L9.4 14.4L8 13L12 9L16 13L14.6 14.4L13 12.85V18H18.5C19.2 18 19.79 17.7567 20.27 17.27C20.7567 16.79 21 16.2 21 15.5C21 14.8 20.7567 14.21 20.27 13.73C19.79 13.2433 19.2 13 18.5 13H17V11C17 9.62 16.5133 8.44 15.54 7.46C14.5667 6.48667 13.3867 6 12 6C10.62 6 9.44 6.48667 8.46 7.46C7.48667 8.44 7 9.62 7 11H6.5C5.53333 11 4.71 11.3433 4.03 12.03C3.34333 12.71 3 13.5333 3 14.5C3 15.4667 3.34333 16.3 4.03 17C4.71 17.6667 5.53333 18 6.5 18H9V20" fill="#C5C5C5"/>',
	"0 0 24 24",
	32,
);

const infoIcon = icon(
	'<path d="M6.5 4.5H5.5V3.5H6.5M6.5 8.5H5.5V5.5H6.5M6 1C5.34339 1 4.69321 1.12933 4.08658 1.3806C3.47995 1.63188 2.92876 2.00017 2.46447 2.46447C1.52678 3.40215 1 4.67392 1 6C1 7.32608 1.52678 8.59785 2.46447 9.53553C2.92876 9.99983 3.47995 10.3681 4.08658 10.6194C4.69321 10.8707 5.34339 11 6 11C7.32608 11 8.59785 10.4732 9.53553 9.53553C10.4732 8.59785 11 7.32608 11 6C11 5.34339 10.8707 4.69321 10.6194 4.08658C10.3681 3.47995 9.99983 2.92876 9.53553 2.46447C9.07124 2.00017 8.52005 1.63188 7.91342 1.3806C7.30679 1.12933 6.65661 1 6 1V1Z" fill="#666666"/>',
	"0 0 24 24",
	24,
);

const alignIcons: Record<string, string> = {
	left: icon(
		'<rect y="0" width="16" height="2" rx="1" fill="currentColor"/><rect y="5" width="10" height="2" rx="1" fill="currentColor"/><rect y="10" width="13" height="2" rx="1" fill="currentColor"/>',
		"0 0 16 12",
	),
	center: icon(
		'<rect x="0" y="0" width="16" height="2" rx="1" fill="currentColor"/><rect x="3" y="5" width="10" height="2" rx="1" fill="currentColor"/><rect x="1.5" y="10" width="13" height="2" rx="1" fill="currentColor"/>',
		"0 0 16 12",
	),
	right: icon(
		'<rect x="0" y="0" width="16" height="2" rx="1" fill="currentColor"/><rect x="6" y="5" width="10" height="2" rx="1" fill="currentColor"/><rect x="3" y="10" width="13" height="2" rx="1" fill="currentColor"/>',
		"0 0 16 12",
	),
	justify: icon(
		'<rect y="0" width="16" height="2" rx="1" fill="currentColor"/><rect y="5" width="16" height="2" rx="1" fill="currentColor"/><rect y="10" width="16" height="2" rx="1" fill="currentColor"/>',
		"0 0 16 12",
	),
};

// Best-effort human title for the custom header trait, since generic
// `component.getName()` just returns "Text" for every text-based component.
const deriveTitle = (component: Component): string => {
	const tag = (component.get("tagName") || "").toLowerCase();
	const classes = component.getClasses();
	if (tag === "h1") return "Heading 1";
	if (tag === "h2") return "Heading 2";
	if (tag === "h4" && classes.indexOf("subtitle") >= 0) return "Subtitle";
	if (tag === "p") return "Paragraph";
	if (tag === "a" && classes.indexOf("button") >= 0) return "Button";
	if (component.get("type") === "portal-link") return "Portal link";
	if (component.get("type") === "notes-packageline") {
		if (classes.indexOf("notes-table") >= 0) return "Notes";
		if (classes.indexOf("packageline-table") >= 0) return "Packagelines";
	}
	return component.getName();
};

export default (editor: Editor, opts: Required<PluginOptions>) => {
	const { TraitManager } = editor;

	// Render the header row (component name + duplicate/delete/close) into
	// the Trait Manager's own persistent label element instead of faking a
	// trait for it. `.gjs-traits-label` is a single element GrapesJS creates
	// once and reuses, so it's re-populated on every selection change; the
	// `open-tm` call is defensive - it guarantees the element exists yet even
	// if this runs before the panel has been shown for the first time.
	const renderHeader = (component: Component) => {
		editor.runCommand("open-tm");
		const label = document.querySelector<HTMLElement>(".gjs-traits-label");
		if (!label) return;

		label.className = "gjs-traits-label gjs-trt-heading-header";
		label.innerHTML = `
			<div class="gjs-trt-heading-title">${deriveTitle(component)}</div>
			<div class="gjs-trt-heading-actions">
				<button type="button" class="gjs-trt-heading-btn" data-action="duplicate" title="Duplicate">${dupIcon}</button>
				<button type="button" class="gjs-trt-heading-btn" data-action="delete" title="Delete">${trashIcon}</button>
				<button type="button" class="gjs-trt-heading-btn" data-action="close" title="Close">${closeIcon}</button>
			</div>
		`;

		label.querySelector('[data-action="duplicate"]')?.addEventListener("click", () => {
			editor.select(component);
			editor.runCommand("tlb-clone");
		});
		label.querySelector('[data-action="delete"]')?.addEventListener("click", () => {
			editor.select(component);
			// Switching to the Blocks view is handled globally in panels.ts via
			// the "run:core:component-delete" event, which `tlb-delete` triggers.
			editor.runCommand("tlb-delete");
		});
		label.querySelector('[data-action="close"]')?.addEventListener("click", () => {
			editor.select(undefined);
			// Mirrors the canvas-background-click behaviour in panels.ts: deselect
			// and switch the sidebar back to the Blocks view.
			["open-sm", "open-tm", "open-layers"].forEach((id) => editor.stopCommand(id));
			editor.runCommand("open-blocks");
		});
	};

	editor.on("component:selected", () => {
		const component = editor.getSelected();
		component && renderHeader(component);
	});

    editor.on("command:run:tlb-delete", () => {
        editor.runCommand("open-blocks");
	});

	// Multi-toggle group: bold / italic / strikethrough / underline, each
	// writing straight to the component's own style (font-weight, font-style,
	// text-decoration) rather than an attribute or RTE selection.
	(TraitManager.addType as any)("decoration-group", {
		eventCapture: [],
		onRender() {
			// @ts-ignore - custom lifecycle hook, `this` is the trait view
			this.listenTo(this.target, "change:style", () => this.__syncDecorations && this.__syncDecorations());
		},
		createInput({ component }: { component: Component }) {
			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-toggle-group";
			wrap.innerHTML = `
				<button type="button" class="gjs-trt-toggle-btn" data-key="bold" title="Bold"><span class="gjs-trt-decoration-icon" style="font-weight:700">B</span></button>
				<button type="button" class="gjs-trt-toggle-btn" data-key="italic" title="Italic"><span class="gjs-trt-decoration-icon" style="font-style:italic">I</span></button>
				<button type="button" class="gjs-trt-toggle-btn" data-key="strikethrough" title="Strikethrough"><span class="gjs-trt-decoration-icon" style="text-decoration:line-through">S</span></button>
				<button type="button" class="gjs-trt-toggle-btn" data-key="underline" title="Underline"><span class="gjs-trt-decoration-icon" style="text-decoration:underline">U</span></button>
			`;

			const isBold = (styles: Record<string, string>) => normalizeWeight(styles["font-weight"]) >= 600;
			const isItalic = (styles: Record<string, string>) => styles["font-style"] === "italic";

			const sync = () => {
				const styles = component.getStyle();
				const tokens = decorationTokens(styles["text-decoration"]);
				const setActive = (key: string, active: boolean) =>
					wrap.querySelector(`[data-key="${key}"]`)?.classList.toggle("gjs-trt-toggle-btn--active", active);
				setActive("bold", isBold(styles));
				setActive("italic", isItalic(styles));
				setActive("strikethrough", tokens.indexOf("line-through") >= 0);
				setActive("underline", tokens.indexOf("underline") >= 0);
			};

			wrap.addEventListener("click", (e) => {
				const btn = (e.target as HTMLElement).closest<HTMLElement>(".gjs-trt-toggle-btn");
				if (!btn) return;
				const key = btn.dataset.key;
				const styles = component.getStyle();

				if (key === "bold") {
					component.addStyle({ "font-weight": isBold(styles) ? "400" : "700" });
				} else if (key === "italic") {
					component.addStyle({ "font-style": isItalic(styles) ? "normal" : "italic" });
				} else if (key === "strikethrough" || key === "underline") {
					const token = key === "strikethrough" ? "line-through" : "underline";
					const tokens = decorationTokens(styles["text-decoration"]);
					const next = tokens.indexOf(token) >= 0 ? tokens.filter((t) => t !== token) : tokens.concat(token);
					component.addStyle({ "text-decoration": next.length ? next.join(" ") : "none" });
				}
				sync();
			});

			(this as any).__syncDecorations = sync;
			sync();
			return wrap;
		},
	});

	// Single-select group for `text-align`. Used for both "Text align" and
	// "Button align" (label differs, and "Button align" targets the parent
	// container via `alignTarget: "parent"` - `text-align` on the <a> itself,
	// an inline element, has no effect on the button's own position, only on
	// its parent's alignment).
	// NB: the option is named `alignTarget`, not `target` - GrapesJS's own
	// Trait model reserves `target` for the associated Component and calls
	// `.on()` on it, so a plain string there breaks every trait on the type.
	(TraitManager.addType as any)("align-group", {
		eventCapture: [],
		onRender() {
			const alignTarget = (this as any).model.get("alignTarget") === "parent" ? this.target.parent() || this.target : this.target;
			// @ts-ignore
			this.listenTo(alignTarget, "change:style", () => this.__syncAlign && this.__syncAlign());
		},
		createInput({ component }: { component: Component }) {
			const useParent: boolean = (this as any).model.get("alignTarget") === "parent";
			const alignTarget: Component = useParent ? component.parent() || component : component;

			const values = ["left", "center", "right", "justify"];
			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-toggle-group";
			wrap.innerHTML = values
				.map(
					(v) =>
						`<button type="button" class="gjs-trt-toggle-btn" data-value="${v}" title="${v}">${alignIcons[v]}</button>`,
				)
				.join("");

			const sync = () => {
				const current = alignTarget.getStyle()["text-align"] || "left";
				wrap.querySelectorAll<HTMLElement>(".gjs-trt-toggle-btn").forEach((btn) => {
					btn.classList.toggle("gjs-trt-toggle-btn--active", btn.dataset.value === current);
				});
			};

			wrap.addEventListener("click", (e) => {
				const btn = (e.target as HTMLElement).closest<HTMLElement>(".gjs-trt-toggle-btn");
				if (!btn || !btn.dataset.value) return;
				alignTarget.addStyle({ "text-align": btn.dataset.value });
				sync();
			});

			(this as any).__syncAlign = sync;
			sync();
			return wrap;
		},
	});

	// Numeric +/- stepper, used for font size (px) and font weight (named steps).
	// Reads its `property`/`unit`/`min`/`max`/`step`/`format` from the trait config.
	(TraitManager.addType as any)("stepper", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target, "change:style", () => this.__syncStepper && this.__syncStepper());
		},
		createInput({ component }: { component: Component }) {
			const model = (this as any).model;
			const property: string = model.get("property");
			const unit: string = model.get("unit") || "";
			const min: number = model.get("min");
			const max: number = model.get("max");
			const step: number = model.get("step") || 1;
			const format: ((value: number) => string) | undefined = model.get("format");
			const fallback: number = model.get("default") || 0;

			const parse = (raw: string | undefined) => {
				const n = property === "font-weight" ? normalizeWeight(raw) : parseInt(raw || "", 10);
				return Number.isNaN(n) ? fallback : n;
			};

			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-stepper";
			wrap.dataset.property = property;
			wrap.innerHTML = `
				<button type="button" class="gjs-trt-stepper-btn" data-dir="-1" aria-label="Decrease">&minus;</button>
				<div class="gjs-trt-stepper-value"></div>
				<button type="button" class="gjs-trt-stepper-btn" data-dir="1" aria-label="Increase">+</button>
			`;
			const valueEl = wrap.querySelector(".gjs-trt-stepper-value") as HTMLElement;

			const render = () => {
				const value = parse(component.getStyle()[property]);
				valueEl.textContent = format ? format(value) : `${value}${unit ? ` ${unit}` : ""}`;
				return value;
			};

			const apply = (value: number) => {
				const clamped = Math.min(max, Math.max(min, value));
				component.addStyle({ [property]: `${clamped}${unit}` });
				render();
			};

			wrap.querySelectorAll<HTMLElement>(".gjs-trt-stepper-btn").forEach((btn) => {
				btn.addEventListener("click", () => {
					const dir = parseInt(btn.dataset.dir || "0", 10);
					apply(render() + dir * step);
				});
			});

			(this as any).__syncStepper = render;
			render();
			return wrap;
		},
	});

	// Colour picker, backed by a plain hex input + native colour swatch so it
	// doesn't depend on GrapesJS's internal (non-exported) colour picker.
	// Reads/writes `property` from the trait config (defaults to `color`), so
	// the same type backs both "Text colour" and "Background colour".
	(TraitManager.addType as any)("text-color", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target, "change:style", () => this.__syncColor && this.__syncColor());
		},
		createInput({ component }: { component: Component }) {
			const property: string = (this as any).model.get("property") || "color";

			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-color";
			wrap.innerHTML = `
				<input type="text" class="gjs-trt-color-hex" spellcheck="false" />
				<label class="gjs-trt-color-swatch"><input type="color" /></label>
			`;
			const hexInput = wrap.querySelector(".gjs-trt-color-hex") as HTMLInputElement;
			const swatch = wrap.querySelector(".gjs-trt-color-swatch") as HTMLElement;
			const colorInput = wrap.querySelector('input[type="color"]') as HTMLInputElement;

			const sync = () => {
				const value = component.getStyle()[property] || "#000000";
				hexInput.value = value;
				swatch.style.backgroundColor = value;
				if (/^#[0-9a-f]{6}$/i.test(value)) colorInput.value = value;
			};

			const apply = (value: string) => {
				component.addStyle({ [property]: value });
				sync();
			};

			hexInput.addEventListener("change", () => apply(hexInput.value.trim()));
			colorInput.addEventListener("input", () => apply(colorInput.value));

			(this as any).__syncColor = sync;
			sync();
			return wrap;
		},
	});

	// Sets a link on the component, in one of three ways depending on the
	// trait config's `wrap`:
	//  - true/unset (default): wraps the component's own CHILDREN in a new
	//    <a> - used by "text", which always has content to wrap.
	//  - false: reads/writes `href` directly on the component itself - used
	//    by "button"/"portal-link", which already render as an <a>.
	//  - "parent": wraps the component ITSELF in a new parent <a> - used by
	//    "image", a void element that can't wrap its own (non-existent)
	//    children and isn't an anchor itself.
	(TraitManager.addType as any)("link", {
		eventCapture: [],
		onRender() {
			const wrapMode = (this as any).model.get("wrap");
			if (wrapMode === true || wrapMode === undefined) {
				// @ts-ignore
				this.listenTo(this.target.components(), "add remove reset", () => this.__syncLink && this.__syncLink());
			} else {
				// @ts-ignore
				this.listenTo(this.target, "change:attributes", () => this.__syncLink && this.__syncLink());
			}
		},
		removed() {
			// @ts-ignore
			this.__linkOutsideHandler && document.removeEventListener("click", this.__linkOutsideHandler);
		},
		createInput({ component }: { component: Component }) {
			const wrapMode = (this as any).model.get("wrap");

			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-link";
			wrap.innerHTML = `
				<div class="gjs-trt-link-value">No link</div>
				<button type="button" class="gjs-trt-link-btn" title="Set link">${linkIcon}</button>
				<div class="gjs-trt-link-popover" hidden>
					<input type="text" class="gjs-trt-link-input" placeholder="https://example.com" />
					<div class="gjs-trt-link-popover-actions">
						<button type="button" data-action="remove" class="gjs-trt-link-remove">Remove</button>
						<button type="button" data-action="apply" class="gjs-trt-link-apply">Apply</button>
					</div>
				</div>
			`;

			const valueEl = wrap.querySelector(".gjs-trt-link-value") as HTMLElement;
			const btn = wrap.querySelector(".gjs-trt-link-btn") as HTMLElement;
			const popover = wrap.querySelector(".gjs-trt-link-popover") as HTMLElement;
			const input = wrap.querySelector(".gjs-trt-link-input") as HTMLInputElement;

			// wrap children (default "text" behaviour)
			const getLinkChild = () => {
				const children = component.components();
				const first = children.length === 1 ? children.at(0) : undefined;
				return first && (first.get("tagName") || "").toLowerCase() === "a" ? first : undefined;
			};

			// wrap self ("image"): the anchor is the component's own parent
			const getWrapAnchor = () => {
				const parent = component.parent();
				return parent && (parent.get("tagName") || "").toLowerCase() === "a" && parent.components().length === 1
					? parent
					: undefined;
			};

			const getHref = () => {
				if (wrapMode === false) return component.getAttributes().href || "";
				if (wrapMode === "parent") return getWrapAnchor()?.getAttributes().href || "";
				return getLinkChild()?.getAttributes().href || "";
			};

			const closePopover = () => {
				popover.hidden = true;
			};

			const sync = () => {
				const href = getHref();
				valueEl.textContent = href || "No link";
				valueEl.classList.toggle("gjs-trt-link-value--set", !!href);
				btn.classList.toggle("gjs-trt-link-btn--active", !!href);
				input.value = href;
			};

			btn.addEventListener("click", (e) => {
				e.stopPropagation();
				popover.hidden = !popover.hidden;
				if (!popover.hidden) input.focus();
			});

			wrap.querySelector('[data-action="apply"]')?.addEventListener("click", () => {
				const url = input.value.trim();
				if (!url) {
					closePopover();
					return;
				}

				if (wrapMode === false) {
					component.addAttributes({ href: url });
				} else if (wrapMode === "parent") {
					const anchor = getWrapAnchor();
					if (anchor) {
						anchor.addAttributes({ href: url });
					} else {
						const parent = component.parent();
						if (parent) {
							const index = parent.components().indexOf(component);
							const [newAnchor] = parent.components().add(`<a href="${url.replace(/"/g, "&quot;")}"></a>`, {
								at: index,
							});
							component.move(newAnchor, { at: 0 });
						}
					}
				} else {
					const existing = getLinkChild();
					if (existing) {
						existing.addAttributes({ href: url });
					} else {
						const inner = component
							.components()
							.map((c: Component) => c.toHTML())
							.join("");
						component.components(`<a href="${url.replace(/"/g, "&quot;")}">${inner}</a>`);
					}
				}

				sync();
				closePopover();
			});

			wrap.querySelector('[data-action="remove"]')?.addEventListener("click", () => {
				if (wrapMode === false) {
					component.removeAttributes(["href"]);
				} else if (wrapMode === "parent") {
					const anchor = getWrapAnchor();
					if (anchor) {
						const grandParent = anchor.parent();
						if (grandParent) {
							const index = grandParent.components().indexOf(anchor);
							component.move(grandParent, { at: index });
						}
						anchor.remove();
					}
				} else {
					const existing = getLinkChild();
					if (existing) {
						const inner = existing
							.components()
							.map((c: Component) => c.toHTML())
							.join("");
						component.components(inner);
					}
				}

				sync();
				closePopover();
			});

			const outsideHandler = (e: MouseEvent) => {
				if (!wrap.contains(e.target as Node)) closePopover();
			};
			document.addEventListener("click", outsideHandler);
			(this as any).__linkOutsideHandler = outsideHandler;

			(this as any).__syncLink = sync;
			sync();
			return wrap;
		},
	});

	// Dropdown backed by a fixed list of options (`name`/`options` on the
	// trait config, same shape GrapesJS's native "select" trait uses), but
	// rendered as a custom button + popover instead of a native <select> -
	// browsers give almost no CSS control over native option lists (no
	// rounded popup, no custom hover/selected row colours), so matching the
	// rest of this panel's look requires building it ourselves.
	(TraitManager.addType as any)("custom-select", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target, "change:attributes", () => this.__syncSelect && this.__syncSelect());
		},
		removed() {
			// @ts-ignore
			this.__selectOutsideHandler && document.removeEventListener("click", this.__selectOutsideHandler);
		},
		createInput({ component }: { component: Component }) {
			const model = (this as any).model;
			const name: string = model.get("name");
			const options: Array<{ id?: string; value?: string; name: string }> = model.get("options") || [];
			const valueOf = (opt: { id?: string; value?: string }) => (opt.value !== undefined ? opt.value : opt.id) || "";

			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-select";
			wrap.innerHTML = `
				<button type="button" class="gjs-trt-select-btn">
					<span class="gjs-trt-select-value"></span>
					${chevronDownIcon}
				</button>
				<div class="gjs-trt-select-popover" hidden>
					${options
						.map(
							(opt) =>
								`<div class="gjs-trt-select-option" data-value="${valueOf(opt).replace(/"/g, "&quot;")}">${opt.name}</div>`,
						)
						.join("")}
				</div>
			`;

			const btn = wrap.querySelector(".gjs-trt-select-btn") as HTMLElement;
			const valueEl = wrap.querySelector(".gjs-trt-select-value") as HTMLElement;
			const popover = wrap.querySelector(".gjs-trt-select-popover") as HTMLElement;
			const optionEls = Array.from(wrap.querySelectorAll<HTMLElement>(".gjs-trt-select-option"));

			const closePopover = () => {
				popover.hidden = true;
			};

			const sync = () => {
				const current = component.getAttributes()[name];
				const matched = options.find((opt) => valueOf(opt) === current);
				valueEl.textContent = matched ? matched.name : "";
				optionEls.forEach((el) => el.classList.toggle("gjs-trt-select-option--active", el.dataset.value === current));
			};

			btn.addEventListener("click", (e) => {
				e.stopPropagation();
				popover.hidden = !popover.hidden;
			});

			optionEls.forEach((el) => {
				el.addEventListener("click", () => {
					component.addAttributes({ [name]: el.dataset.value });
					sync();
					closePopover();
				});
			});

			const outsideHandler = (e: MouseEvent) => {
				if (!wrap.contains(e.target as Node)) closePopover();
			};
			document.addEventListener("click", outsideHandler);
			(this as any).__selectOutsideHandler = outsideHandler;

			(this as any).__syncSelect = sync;
			sync();
			return wrap;
		},
	});

	// Plain text input bound to an attribute (`name` on the trait config),
	// with an info-icon tooltip appended to the label. Bypasses `getLabel()`'s
	// default capitalize-and-dehyphenate formatting (which would turn
	// "alt-text" into "Alt text") by reading the raw label off the trait
	// model directly instead of using the value handed to `createLabel`.
	(TraitManager.addType as any)("alt-text", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target, "change:attributes", () => this.__syncAltText && this.__syncAltText());
		},
		createLabel() {
			const rawLabel = (this as any).model.get("label") || "";
			return `<span class="gjs-trt-alt-label" style="display: flex; align-items: center; gap: 4px;">${rawLabel}<span class="gjs-trt-alt-info gjs-trt-tooltip" data-tooltip="Shown to screen readers and when the image fails to load.">${infoIcon}</span></span>`;
		},
		createInput({ component }: { component: Component }) {
			const model = (this as any).model;
			const name: string = model.get("name");

			const input = document.createElement("input");
			input.type = "text";
			input.className = "gjs-trt-alt-input gjs-trt-text-input";

			const sync = () => {
				input.value = component.getAttributes()[name] || "";
			};

			input.addEventListener("change", () => {
				component.addAttributes({ [name]: input.value });
			});

			(this as any).__syncAltText = sync;
			sync();
			return input;
		},
	});

	// Drag-and-drop / choose-file image upload, replacing GrapesJS's default
	// double-click-to-open-Asset-Manager modal (disabled on the "image" type
	// in types.ts) with an inline dropzone in the traits panel instead. Once
	// an image is set, swaps the dropzone for a compact file row (thumbnail,
	// name, size, delete) instead of showing both at once.
	(TraitManager.addType as any)("image-upload", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target, "change:src change:attributes", () => this.__syncUpload && this.__syncUpload());
		},
		createInput({ component }: { component: Component }) {
			const wrap = document.createElement("div");
			wrap.className = "gjs-trt-upload";
			wrap.innerHTML = `
				<input type="file" accept="image/*" class="gjs-trt-upload-input" hidden />
				<div class="gjs-trt-upload-empty">
					<div class="gjs-trt-upload-icon">${cloudUploadIcon}</div>
					<div class="gjs-trt-upload-text">Drag and drop or <button type="button" class="gjs-trt-upload-choose">Choose file</button> to upload</div>
				</div>
				<div class="gjs-trt-upload-file" hidden>
					<img class="gjs-trt-upload-thumb" />
					<div class="gjs-trt-upload-info">
						<div class="gjs-trt-upload-name"></div>
						<div class="gjs-trt-upload-size"></div>
					</div>
					<button type="button" class="gjs-trt-upload-delete" title="Remove image">${trashIcon}</button>
				</div>
			`;

			const fileInput = wrap.querySelector(".gjs-trt-upload-input") as HTMLInputElement;
			const emptyEl = wrap.querySelector(".gjs-trt-upload-empty") as HTMLElement;
			const fileEl = wrap.querySelector(".gjs-trt-upload-file") as HTMLElement;
			const thumbEl = wrap.querySelector(".gjs-trt-upload-thumb") as HTMLImageElement;
			const nameEl = wrap.querySelector(".gjs-trt-upload-name") as HTMLElement;
			const sizeEl = wrap.querySelector(".gjs-trt-upload-size") as HTMLElement;
			const deleteBtn = wrap.querySelector(".gjs-trt-upload-delete") as HTMLElement;

			const formatSize = (bytes: number) => {
				if (bytes < 1024) return `${bytes} b`;
				const kb = bytes / 1024;
				if (kb < 1024) return `${kb.toFixed(1)} kb`;
				return `${(kb / 1024).toFixed(1)} mb`;
			};

			const extractFile = (e: Event | DragEvent): File | undefined => {
				const dt = (e as DragEvent).dataTransfer;
				return (dt ? dt.files?.[0] : (e.target as HTMLInputElement)?.files?.[0]) || undefined;
			};

			// Delegates to `opts.uploadFile` (base64-embed by default, or a
			// consumer-supplied handler - eg. one that uploads to Bumbal's own
			// backend and returns a real hosted URL) rather than reading the
			// file ourselves, so this box doesn't have to know how uploads work.
			// The original file's name/size are captured directly (independent
			// of whatever the upload handler itself returns) purely to display
			// them here, and stored as data attributes so they survive a
			// straight HTML export/re-import.
			const handleFiles = (e: Event | DragEvent) => {
				const file = extractFile(e);
				opts.uploadFile(e, (res) => {
					const asset = res?.data?.[0];
					if (!asset?.src) return;
					component.set("src", asset.src);
					component.addAttributes({
						"data-file-name": file?.name || asset.name || "",
						"data-file-size": file ? formatSize(file.size) : "",
					});
				});
			};

			const clearImage = () => {
				component.set("src", (component as any).defaults?.src);
				component.removeAttributes(["data-file-name", "data-file-size"]);
			};

			const sync = () => {
				const hasImage = !(component as any).isDefaultSrc?.();
				emptyEl.hidden = hasImage;
				fileEl.hidden = !hasImage;
				if (hasImage) {
					thumbEl.src = (component as any).getSrcResult ? (component as any).getSrcResult() : component.get("src");
					const attrs = component.getAttributes();
					nameEl.textContent = attrs["data-file-name"] || "Image";
					sizeEl.textContent = attrs["data-file-size"] || "";
				}
			};

			// "Choose file" is just a styled button inside `emptyEl` - its click
			// bubbles up, so a single handler covers both, but only while the
			// dropzone (not the file row) is showing.
			wrap.addEventListener("click", () => {
				if (!emptyEl.hidden) fileInput.click();
			});

			fileInput.addEventListener("change", (e) => {
				handleFiles(e);
				fileInput.value = "";
			});

			wrap.addEventListener("dragover", (e) => {
				e.preventDefault();
				wrap.classList.add("gjs-trt-upload--dragover");
			});
			wrap.addEventListener("dragleave", () => wrap.classList.remove("gjs-trt-upload--dragover"));
			wrap.addEventListener("drop", (e) => {
				e.preventDefault();
				wrap.classList.remove("gjs-trt-upload--dragover");
				handleFiles(e);
			});

			deleteBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				clearImage();
				sync();
			});

			(this as any).__syncUpload = sync;
			sync();
			return wrap;
		},
	});
};

export { weightNames };
