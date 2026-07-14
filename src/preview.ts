/// <reference path="./images.d.ts" />
import type { Editor } from "grapesjs";
import { PluginOptions } from ".";
// @ts-ignore
import Twig from "twig/twig.min.js";
import fakeActivity from "./static/mock_activity.json";
import proofOfDeliveryImg from "./static/images/proof_of_delivery.png";
import signatureImg from "./static/images/signature.png";

const mockFileImages: Record<string, string> = {
	proof_of_delivery: proofOfDeliveryImg,
	signature: signatureImg,
};

const previewActivity = {
	...fakeActivity,
	files: fakeActivity.files.map((file) => ({
		...file,
		location: mockFileImages[file.meta_data[0]?.value] ?? file.location,
	})),
};


export default (editor: Editor, opts: Required<PluginOptions>) => {
	const { cmdInlineHtml, onUpdate } = opts;
	let latestHtml = "";
	let isPreview = false;

	const renderTwig = (html: string) => {
		try {
			return Twig.twig({ data: html }).render(previewActivity);
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
		onUpdate(latestHtml);
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
