import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
// @ts-ignore
import Twig from "twig/twig.min.js";
import fakeActivity from "./static/mock_activity.json";


export default (editor: Editor, opts: Required<PluginOptions>) => {
	const { cmdInlineHtml } = opts;
	let latestHtml = "";
	let isPreview = false;

	const renderTwig = (html: string) => {
		try {
			return Twig.twig({ data: html }).render(fakeActivity);
		} catch (e) {
			const error = e as Error;
			return `<p>${error.message}</p>`;
		}
	};

	// setComponents() below fires its own "update", so skip capturing while
	// in preview or the rendered (twig-output) markup would clobber latestHtml.
	editor.on("update", () => {
		if (isPreview) return;
		latestHtml = editor.runCommand(cmdInlineHtml) as string;
	});

	editor.on("command:run:before:preview", () => {
		latestHtml = editor.runCommand(cmdInlineHtml) as string;
		isPreview = true;
		editor.setComponents(renderTwig(latestHtml));
	});

	editor.on("command:stop:before:preview", () => {
		editor.setComponents(latestHtml);
		isPreview = false;
	});
};
