import type { Editor, Component } from "grapesjs";
import { PluginOptions } from ".";
import { cmdClear, cmdDeviceDesktop, cmdDeviceMobile } from "./consts";

export default (editor: Editor, opts: Required<PluginOptions>) => {
	const { Panels } = editor;
	const { cmdOpenImport } = opts;
	const openExport = "export-template";
	const openStyleManager = "open-sm";
	const openTraitManager = "open-tm";
	const openBlocks = "open-blocks";
	const activatePreview = "preview";
	const viewCommands = [openStyleManager, openTraitManager, "open-layers", openBlocks];

	// Only one view (Style Manager/Traits/Layers/Blocks) shows at a time,
	// now that there's no button group to enforce that automatically.
	const showView = (cmdId: string) => {
		viewCommands.filter((id) => id !== cmdId).forEach((id) => editor.stopCommand(id));
		editor.runCommand(cmdId);
	};
	const iconStyle = 'style="display: block; max-width: 22px"';

	// Turn off default devices select and create new one
	editor.getConfig().showDevices = false;

	Panels.getPanels().reset([
		{
			id: "commands",
			buttons: [
				{
					id: cmdDeviceDesktop,
					command: cmdDeviceDesktop,
					active: true,
					label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" />
        </svg>`,
				},
				{
					id: cmdDeviceMobile,
					command: cmdDeviceMobile,
					label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
        </svg>`,
				},
				{
					id: activatePreview,
					context: activatePreview,
					command: activatePreview,
					label: `<svg ${iconStyle} viewBox="0 0 24 24" fill="none">
<path d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9ZM12 4.5C17 4.5 21.27 7.61 23 12C21.27 16.39 17 19.5 12 19.5C7 19.5 2.73 16.39 1 12C2.73 7.61 7 4.5 12 4.5ZM3.18 12C4.83 15.36 8.24 17.5 12 17.5C15.76 17.5 19.17 15.36 20.82 12C19.17 8.64 15.76 6.5 12 6.5C8.24 6.5 4.83 8.64 3.18 12Z" fill="black"/>
</svg>`,
				},
			],
		},
		{
			id: "middle",
			buttons: [
				{
					id: "undo",
					command: "core:undo",
					label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
        </svg>`,
				},
				{
					id: "redo",
					command: "core:redo",
					label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M10.5 18H18V20H10.5C6.91 20 4 17.09 4 13.5S6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5S8 18 10.5 18Z" />
        </svg>`,
				},
				{
					id: cmdClear,
					command: cmdClear,
					label: `<svg ${iconStyle} viewBox="0 0 24 24" fill="none">
<path d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="black"/>
</svg>`,
				},
			],
		},
		{
			id: "options",
			buttons: [
				{
					id: cmdOpenImport,
					command: cmdOpenImport,
					label: `<svg ${iconStyle} viewBox="0 0 24 24" fill="none">
<path d="M17.5 20C19.02 20 20.3167 19.4767 21.39 18.43C22.4633 17.3767 23 16.0933 23 14.58C23 13.28 22.61 12.12 21.83 11.1C21.0433 10.08 20.0167 9.43 18.75 9.15C18.33 7.61667 17.4967 6.37667 16.25 5.43C14.9967 4.47667 13.58 4 12 4C10.0467 4 8.39333 4.68 7.04 6.04C5.68 7.39333 5 9.04667 5 11C3.84667 11.1333 2.89333 11.6333 2.14 12.5C1.38 13.3533 1 14.3533 1 15.5C1 16.7533 1.43667 17.8167 2.31 18.69C3.18333 19.5633 4.24667 20 5.5 20H11C11.5467 20 12.0167 19.8033 12.41 19.41C12.8033 19.0233 13 18.5533 13 18V12.85L14.6 14.4L16 13L12 9L8 13L9.4 14.4L11 12.85V18H5.5C4.8 18 4.21 17.7567 3.73 17.27C3.24333 16.79 3 16.2 3 15.5C3 14.8 3.24333 14.21 3.73 13.73C4.21 13.2433 4.8 13 5.5 13H7V11C7 9.62 7.48667 8.44 8.46 7.46C9.43333 6.48667 10.6133 6 12 6C13.38 6 14.56 6.48667 15.54 7.46C16.5133 8.44 17 9.62 17 11H17.5C18.4667 11 19.29 11.3433 19.97 12.03C20.6567 12.71 21 13.5333 21 14.5C21 15.4667 20.6567 16.3 19.97 17C19.29 17.6667 18.4667 18 17.5 18H15V20" fill="black"/>
</svg>
`,
				},
				{
					id: openExport,
					command: openExport,
					label: `<svg ${iconStyle} viewBox="0 0 24 24" fill="none">
<path d="M5 20H19V18H5M19 9H15V3H9V9H5L12 16L19 9Z" fill="black"/>
</svg>
`,
				},
			],
		},
	]);

	// On component change show the Trait Manager (custom per-type settings
	// panel) rather than the generic Style Manager.
	opts.showStylesOnChange &&
		editor.on("component:selected", () => {
			editor.getSelected() && showView(openTraitManager);
		});

	// GrapesJS's canvas Sorter clears the current selection the moment any
	// native drag (eg. a file being dragged toward the image uploader in the
	// traits panel, or the cursor merely passing over the canvas on the way
	// there) enters the canvas iframe - and since the built-in Trait Manager
	// only renders its content when exactly one component is selected, that
	// hides the whole panel (dropzone included) mid-drag, before the drop
	// ever reaches it. Reselecting here runs synchronously in the same tick
	// as the deselect, so the panel never actually disappears on screen.
	let lastSelected: Component | undefined;
	editor.on("component:selected", () => {
		lastSelected = editor.getSelected();
	});
	editor.on("canvas:dragenter", () => {
		lastSelected && editor.select(lastSelected);
	});

	// Deleting a component (canvas toolbar, keyboard shortcut, or the custom
	// trait-header delete button) always leaves nothing selected - switch the
	// sidebar back to the Blocks view, same as clicking empty canvas.
	editor.on("run:core:component-delete", () => {
		showView(openBlocks);
	});

	// The core `preview` command hides every panel, including the one
	// holding the preview toggle button itself, leaving no way to exit
	// preview mode. Keep that panel visible so the button stays clickable.
	editor.on("run:preview", () => {
		Panels.getPanel("commands")?.set("visible", true);
	});

	editor.onReady(() => {
		if (opts.showBlocksOnLoad) {
			showView(openBlocks);
		}

		const canvasEl = editor.Canvas.getElement();
		canvasEl.addEventListener("click", (e) => {
			if ((e.target as HTMLElement).classList.contains("gjs-cv-canvas__frames")) {
				editor.select(undefined);
				showView(openBlocks);
			}
		});

		const stopPreviewBtn = document.createElement("button");
		stopPreviewBtn.type = "button";
		stopPreviewBtn.className = "gjs-stop-preview";
		stopPreviewBtn.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18.3 5.71L12 12.01L5.7 5.71L4.29 7.12L10.59 13.42L4.29 19.72L5.7 21.13L12 14.83L18.3 21.13L19.71 19.72L13.41 13.42L19.71 7.12L18.3 5.71Z" fill="currentColor"/>
			</svg>
			<span>Stop preview</span>
		`;
		stopPreviewBtn.addEventListener("click", () => editor.stopCommand(activatePreview));
		canvasEl.appendChild(stopPreviewBtn);

		editor.on("command:run:before:preview", () => {
			stopPreviewBtn.style.display = "flex";
		});
		editor.on("command:stop:before:preview", () => {
			stopPreviewBtn.style.display = "none";
		});
	});
};
