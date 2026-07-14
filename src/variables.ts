import type { Editor } from "grapesjs";
import { PluginOptions } from ".";

export default (editor: Editor, opts: Required<PluginOptions>) => {
	editor.onReady(() => {
		const canvasEl = editor.Canvas.getElement();

		const wrapper = document.createElement("div");
		wrapper.className = "gjs-variables gjs-variables-open";

		const card = document.createElement("div");
		card.className = "gjs-variables-card";

		const header = document.createElement("div");
		header.className = "gjs-variables-header";
		header.innerHTML = `
			<div class="gjs-variables-title">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3.33333 2H4.66667V3.33333H3.33333V6.66667C3.33333 7.02029 3.19286 7.35943 2.94281 7.60948C2.69276 7.85952 2.35362 8 2 8C2.35362 8 2.69276 8.14048 2.94281 8.39052C3.19286 8.64057 3.33333 8.97971 3.33333 9.33333V12.6667H4.66667V14H3.33333C2.62 13.82 2 13.4 2 12.6667V10C2 9.64638 1.85952 9.30724 1.60948 9.05719C1.35943 8.80714 1.02029 8.66667 0.666667 8.66667H0L0 7.33333H0.666667C1.02029 7.33333 1.35943 7.19286 1.60948 6.94281C1.85952 6.69276 2 6.35362 2 6V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2ZM12.6667 2C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V6C14 6.35362 14.1405 6.69276 14.3905 6.94281C14.6406 7.19286 14.9797 7.33333 15.3333 7.33333H16V8.66667H15.3333C14.9797 8.66667 14.6406 8.80714 14.3905 9.05719C14.1405 9.30724 14 9.64638 14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H11.3333V12.6667H12.6667V9.33333C12.6667 8.97971 12.8071 8.64057 13.0572 8.39052C13.3072 8.14048 13.6464 8 14 8C13.6464 8 13.3072 7.85952 13.0572 7.60948C12.8071 7.35943 12.6667 7.02029 12.6667 6.66667V3.33333H11.3333V2H12.6667ZM8 10C8.17681 10 8.34638 10.0702 8.47141 10.1953C8.59643 10.3203 8.66667 10.4899 8.66667 10.6667C8.66667 10.8435 8.59643 11.013 8.47141 11.1381C8.34638 11.2631 8.17681 11.3333 8 11.3333C7.82319 11.3333 7.65362 11.2631 7.5286 11.1381C7.40357 11.013 7.33333 10.8435 7.33333 10.6667C7.33333 10.4899 7.40357 10.3203 7.5286 10.1953C7.65362 10.0702 7.82319 10 8 10ZM5.33333 10C5.51014 10 5.67971 10.0702 5.80474 10.1953C5.92976 10.3203 6 10.4899 6 10.6667C6 10.8435 5.92976 11.013 5.80474 11.1381C5.67971 11.2631 5.51014 11.3333 5.33333 11.3333C5.15652 11.3333 4.98695 11.2631 4.86193 11.1381C4.7369 11.013 4.66667 10.8435 4.66667 10.6667C4.66667 10.4899 4.7369 10.3203 4.86193 10.1953C4.98695 10.0702 5.15652 10 5.33333 10ZM10.6667 10C10.8435 10 11.013 10.0702 11.1381 10.1953C11.2631 10.3203 11.3333 10.4899 11.3333 10.6667C11.3333 10.8435 11.2631 11.013 11.1381 11.1381C11.013 11.2631 10.8435 11.3333 10.6667 11.3333C10.4899 11.3333 10.3203 11.2631 10.1953 11.1381C10.0702 11.013 10 10.8435 10 10.6667C10 10.4899 10.0702 10.3203 10.1953 10.1953C10.3203 10.0702 10.4899 10 10.6667 10Z" fill="currentColor"/>
				</svg>
				<span>Variables</span>
			</div>
			<div class="gjs-variables-actions">
				<button type="button" class="gjs-variables-help" title="Help">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11 18H13V16H11V18ZM12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C10.9391 6 9.92172 6.42143 9.17157 7.17157C8.42143 7.92172 8 8.93913 8 10H10C10 9.46957 10.2107 8.96086 10.5858 8.58579C10.9609 8.21071 11.4696 8 12 8C12.5304 8 13.0391 8.21071 13.4142 8.58579C13.7893 8.96086 14 9.46957 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 8.93913 15.5786 7.92172 14.8284 7.17157C14.0783 6.42143 13.0609 6 12 6Z" fill="currentColor"/>
					</svg>
				</button>
				<button type="button" class="gjs-variables-toggle" aria-label="Toggle variables">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" fill="currentColor"/>
					</svg>
				</button>
			</div>
		`;

		const body = document.createElement("div");
		body.className = "gjs-variables-body";

		Object.entries(opts.variables).forEach(([category, items]) => {
			const categoryEl = document.createElement("div");
			categoryEl.className = "gjs-variables-category";

			const titleEl = document.createElement("div");
			titleEl.className = "gjs-variables-category-title";
			titleEl.textContent = category;
			categoryEl.appendChild(titleEl);

			Object.entries(items).forEach(([name, code]) => {
				const itemEl = document.createElement("div");
				itemEl.className = "gjs-variables-item";
				itemEl.textContent = name;
				itemEl.title = code;
				itemEl.dataset.code = code;
				itemEl.addEventListener("click", () => {
					navigator.clipboard.writeText(code).then(() => {
						const original = name;
						itemEl.textContent = "Copied!";
						itemEl.classList.add("gjs-variables-item--copied");
						setTimeout(() => {
							itemEl.textContent = original;
							itemEl.classList.remove("gjs-variables-item--copied");
						}, 500);
					});
				});
				categoryEl.appendChild(itemEl);
			});

			body.appendChild(categoryEl);
		});

		header.querySelector(".gjs-variables-toggle")?.addEventListener("click", () => {
			wrapper.classList.toggle("gjs-variables-open");
		});

		card.appendChild(header);
		card.appendChild(body);
		wrapper.appendChild(card);
		canvasEl.appendChild(wrapper);

		editor.on("command:run:before:preview", () => {
			wrapper.style.display = "none";
		});
		editor.on("command:stop:preview", () => {
			wrapper.style.display = "block";
		});
	});

	const mergeTagSections = Object.entries(opts.variables).map(([label, items]) => ({
		label,
		tags: Object.entries(items).map(([label, value]) => ({ label, value })),
	}));

	const rtesWithMergeTags = new Set();

	editor.on("rte:enable", (view, rte) => {
		if (rtesWithMergeTags.has(rte)) return;
		rtesWithMergeTags.add(rte);

		const wrapper = document.createElement("div");
		wrapper.className = "merge-menu-wrapper";
		wrapper.innerHTML = "Variables &#9662;";

		const menu = document.createElement("div");
		menu.className = "merge-menu";

		// Tracks every section's submenu + pending close timer so opening one
		// can immediately close all the others - otherwise, hovering straight
		// from one section into the next would show the new submenu while the
		// old one is still mid-way through its own close delay, overlapping.
		const submenuEntries: { submenu: HTMLElement; closeTimer?: ReturnType<typeof setTimeout> }[] = [];

		mergeTagSections.forEach((section) => {
			const sectionEl = document.createElement("div");
			sectionEl.className = "merge-section";
			sectionEl.textContent = section.label;

			const submenu = document.createElement("div");
			submenu.className = "merge-submenu";

			section.tags.forEach((tag) => {
				const tagEl = document.createElement("div");
				tagEl.className = "merge-tag-item";
				tagEl.textContent = tag.label;

				tagEl.onclick = (e) => {
					e.stopPropagation();
					view.el.focus();
					rte.insertHTML(tag.value);
					menu.style.display = "none";
				};

				submenu.appendChild(tagEl);
			});

			// Driven by JS with a short close delay rather than pure CSS
			// `:hover` - the submenu sits to the side with a small gap, so any
			// slight vertical drift while crossing that gap would otherwise
			// exit the section's hover box and instantly close the submenu
			// before the cursor even reaches it.
			const entry: (typeof submenuEntries)[number] = { submenu };
			submenuEntries.push(entry);

			const showSubmenu = () => {
				clearTimeout(entry.closeTimer);
				submenuEntries.forEach((other) => {
					if (other === entry) return;
					clearTimeout(other.closeTimer);
					other.submenu.style.display = "none";
				});
				submenu.style.display = "block";
			};
			const scheduleHideSubmenu = () => {
				clearTimeout(entry.closeTimer);
				entry.closeTimer = setTimeout(() => {
					submenu.style.display = "none";
				}, 300);
			};
			sectionEl.addEventListener("mouseenter", showSubmenu);
			sectionEl.addEventListener("mouseleave", scheduleHideSubmenu);
			submenu.addEventListener("mouseenter", showSubmenu);
			submenu.addEventListener("mouseleave", scheduleHideSubmenu);

			sectionEl.appendChild(submenu);
			menu.appendChild(sectionEl);
		});

		wrapper.onclick = (e) => {
			e.stopPropagation();
			menu.style.display = menu.style.display === "block" ? "none" : "block";
		};

		wrapper.appendChild(menu);
		rte.actionbar?.appendChild(wrapper);

		document.addEventListener("click", () => {
			menu.style.display = "none";
		});
	});
};
