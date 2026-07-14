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
	'<path d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="black"/>',
);
const closeIcon = icon(
	'<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black"/>',
);
const linkIcon = icon(
	'<path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C5.67392 7 4.40215 7.52678 3.46447 8.46447C2.52678 9.40215 2 10.6739 2 12C2 13.3261 2.52678 14.5979 3.46447 15.5355C4.40215 16.4732 5.67392 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C18.3261 17 19.5979 16.4732 20.5355 15.5355C21.4732 14.5979 22 13.3261 22 12C22 10.6739 21.4732 9.40215 20.5355 8.46447C19.5979 7.52678 18.3261 7 17 7Z" fill="black"/>',
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
	return component.getName();
};

export default (editor: Editor, _opts: Required<PluginOptions>) => {
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

	// Wraps/unwraps the component's content in an <a href> element.
	(TraitManager.addType as any)("link", {
		eventCapture: [],
		onRender() {
			// @ts-ignore
			this.listenTo(this.target.components(), "add remove reset", () => this.__syncLink && this.__syncLink());
		},
		removed() {
			// @ts-ignore
			this.__linkOutsideHandler && document.removeEventListener("click", this.__linkOutsideHandler);
		},
		createInput({ component }: { component: Component }) {
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

			const getLinkChild = () => {
				const children = component.components();
				const first = children.length === 1 ? children.at(0) : undefined;
				return first && (first.get("tagName") || "").toLowerCase() === "a" ? first : undefined;
			};

			const closePopover = () => {
				popover.hidden = true;
			};

			const sync = () => {
				const link = getLinkChild();
				const href = link ? link.getAttributes().href || "" : "";
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
				sync();
				closePopover();
			});

			wrap.querySelector('[data-action="remove"]')?.addEventListener("click", () => {
				const existing = getLinkChild();
				if (existing) {
					const inner = existing
						.components()
						.map((c: Component) => c.toHTML())
						.join("");
					component.components(inner);
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
};

export { weightNames };
