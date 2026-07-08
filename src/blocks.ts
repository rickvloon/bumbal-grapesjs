import type { Editor, BlockProperties } from "grapesjs";
import { PluginOptions } from ".";

export default function (editor: Editor, opts: Required<PluginOptions>) {
	const bm = editor.Blocks;
	let tableStyleStr = "";
	let tableStyle = opts.tableStyle || {};

	const addBlock = (id: string, blockDef: BlockProperties) => {
		opts.blocks.indexOf(id)! >= 0 &&
			editor.Blocks.add(id, {
				select: true,
				...blockDef,
				...opts.block(id),
			});
	};

	for (let prop in tableStyle) {
		tableStyleStr += `${prop}: ${tableStyle[prop]}; `;
	}

	const category = "Layouts";

	addBlock("sect100", {
		label: "1 Column",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 5V19H21V5H3ZM5.11765 7.15385H10.4118H13.5882H15.7059L18.8824 7.15385V16.8462L15.7059 16.8462H13.5882H10.4118H5.11765V7.15385Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell"></td>
        </tr>
      </table>
    `,
	});

	addBlock("sect50", {
		label: "2 Columns",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 5V19H21V5H3ZM5.11765 7.15385L11 7.15385H13L15.7059 7.15385L18.8824 7.15385V16.8462L15.7059 16.8462L13 16.8462H11L5.11765 16.8462V7.15385Z" fill="black"/>
<path d="M13 16.8462V7.15385H11V16.8462H13Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell" style="width: 50%"></td>
          <td class="cell" style="width: 50%"></td>
        </tr>
      </table>
    `,
	});

	addBlock("sect30", {
		label: "3 Columns",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 5V19H21V5H3ZM13.5882 7.15385V16.8462H10.4118V7.15385H13.5882ZM5.11765 7.15385H8.29412V16.8462H5.11765V7.15385ZM18.8824 16.8462H15.7059V7.15385H18.8824V16.8462Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell" style="width: 33.3333%"></td>
          <td class="cell" style="width: 33.3333%"></td>
          <td class="cell" style="width: 33.3333%"></td>
        </tr>
      </table>
    `,
	});

	addBlock("sect25", {
		label: "4 Columns",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3 5V19H21V5H3ZM5 7.15385L11 7.15385H13L15.7059 7.15385L19 7.15385V16.8462L15.7059 16.8462L13 16.8462H11L5 16.8462V7.15385Z" fill="black"/>
<path d="M13 16.8462V7.15385H11V16.8462H13Z" fill="black"/>
<path d="M9 16.8462V7.15385H7V16.8462H9Z" fill="black"/>
<path d="M17 16.8462V7.15384H15V16.8462H17Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell" style="width: 25%"></td>
          <td class="cell" style="width: 25%"></td>
          <td class="cell" style="width: 25%"></td>
          <td class="cell" style="width: 25%"></td>
        </tr>
      </table>
    `,
	});

	addBlock("sect13l", {
		label: "1/3 Left",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 5V19H21V5H3ZM19 7.15385V16.8462L11 16.8462V7.15385L19 7.15385ZM5 7.15385H9V16.8462H5V7.15385Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell" style="width:33.3333%"></td>
          <td class="cell" style="width:66.6667%"></td>
        </tr>
      </table>
    `,
	});

	addBlock("sect13r", {
		label: "1/3 Right",
		category,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 19V5L3 5V19L21 19ZM5 16.8462L5 7.15385L13 7.15384L13 16.8462L5 16.8462ZM19 16.8462H15L15 7.15384H19V16.8462Z" fill="black"/>
</svg>
`,
		content: `
      <table style="${tableStyleStr}">
        <tr>
          <td class="cell" style="width:66.6667%"></td>
          <td class="cell" style="width:33.3333%"></td>
        </tr>
      </table>
    `,
	});

	const basicCategory = "Basic";

	addBlock("heading-h1", {
		label: "Heading 1",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.69238 4.61523H5.69238V10.6152H9.69238V4.61523H11.6924V18.6152H9.69238V12.6152H5.69238V18.6152H3.69238V4.61523ZM14.6924 18.6152V16.6152H16.6924V6.92523L14.1924 8.36523V6.05523L16.6924 4.61523H18.6924V16.6152H20.6924V18.6152H14.6924Z" fill="black"/>
</svg>
`,
		content: {
			type: "text",
			tagName: "h1",
			content: "Heading 1",
			style: {
				padding: "12px 8px",
				"font-size": "22px",
				"font-weight": 600,
				"letter-spacing": 0,
			},
		},
	});

	addBlock("heading-h2", {
		label: "Heading 2",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.76953 4.61523H4.76953V10.6152H8.76953V4.61523H10.7695V18.6152H8.76953V12.6152H4.76953V18.6152H2.76953V4.61523ZM20.7695 18.6152H14.7695C14.2391 18.6152 13.7304 18.4045 13.3553 18.0294C12.9802 17.6544 12.7695 17.1457 12.7695 16.6152C12.7695 16.0852 12.9695 15.6152 13.3095 15.2552L18.1795 10.0252C18.5495 9.66524 18.7695 9.16524 18.7695 8.61523C18.7695 8.0848 18.5588 7.57609 18.1837 7.20102C17.8087 6.82595 17.3 6.61523 16.7695 6.61523C16.2391 6.61523 15.7304 6.82595 15.3553 7.20102C14.9802 7.57609 14.7695 8.0848 14.7695 8.61523H12.7695C12.7695 7.55437 13.191 6.53695 13.9411 5.78681C14.6912 5.03666 15.7087 4.61523 16.7695 4.61523C17.8304 4.61523 18.8478 5.03666 19.598 5.78681C20.3481 6.53695 20.7695 7.55437 20.7695 8.61523C20.7695 9.71524 20.3195 10.7152 19.5995 11.4452L14.7695 16.6152H20.7695V18.6152Z" fill="black"/>
</svg>
`,
		content: {
			type: "text",
			tagName: "h2",
			content: "Heading 2",
            style: {
				padding: "12px 8px",
				"font-size": "18px",
				"font-weight": 600,
				"letter-spacing": 0,
			},
		},
	});

	addBlock("text", {
		label: "Paragraph",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 4C14.0609 4 15.0783 4.42143 15.8284 5.17157C16.5786 5.92172 17 6.93913 17 8C17 9.06087 16.5786 10.0783 15.8284 10.8284C15.0783 11.5786 14.0609 12 13 12H11V18H9V4H13ZM13 10C13.5304 10 14.0391 9.78929 14.4142 9.41421C14.7893 9.03914 15 8.53043 15 8C15 7.46957 14.7893 6.96086 14.4142 6.58579C14.0391 6.21071 13.5304 6 13 6H11V10H13Z" fill="black"/>
</svg>
`,
		activate: true,
		content: {
			type: "text",
			tagName: "p",
			content: "Insert your text here",
            style: {
				padding: "8px 8px",
				"font-size": "14px",
				"letter-spacing": 0,
			},
		},
	});

	addBlock("subtitle", {
		label: "Subtitle",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 7C10.4696 7 9.96086 7.21071 9.58579 7.58579C9.21071 7.96086 9 8.46957 9 9V11C9 11.5304 9.21071 12.0391 9.58579 12.4142C9.96086 12.7893 10.4696 13 11 13H13V15H9V17H13C13.5304 17 14.0391 16.7893 14.4142 16.4142C14.7893 16.0391 15 15.5304 15 15V13C15 12.4696 14.7893 11.9609 14.4142 11.5858C14.0391 11.2107 13.5304 11 13 11H11V9H15V7H11Z" fill="black"/>
</svg>
`,
		content: {
			type: "text",
			tagName: "h4",
			attributes: { class: "subtitle" },
			content: "Subtitle",
            style: {
				padding: "8px 8px",
				"font-size": "12px",
				"letter-spacing": 0,
                "color": "#888"
			},
		},
	});

	addBlock("image", {
		label: "Image",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 19H5V5H19M19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="black"/>
</svg>
`,
		activate: true,
		content: {
			type: "image",
			style: { color: "black" },
		},
	});

	addBlock("link", {
		label: "Link",
		category: basicCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C5.67392 7 4.40215 7.52678 3.46447 8.46447C2.52678 9.40215 2 10.6739 2 12C2 13.3261 2.52678 14.5979 3.46447 15.5355C4.40215 16.4732 5.67392 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C18.3261 17 19.5979 16.4732 20.5355 15.5355C21.4732 14.5979 22 13.3261 22 12C22 10.6739 21.4732 9.40215 20.5355 8.46447C19.5979 7.52678 18.3261 7 17 7Z" fill="black"/>
</svg>
`,
		content: {
			type: "link",
			content: "Link",
			style: { color: "#3b97e3" },
		},
	});

	const customCategory = "Custom";

	addBlock("packageline", {
		label: "Packageline",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5ZM12 4.15L10.11 5.22L16 8.61L17.96 7.5L12 4.15ZM6.04 7.5L12 10.85L13.96 9.75L8.08 6.35L6.04 7.5ZM5 15.91L11 19.29V12.58L5 9.21V15.91ZM19 15.91V9.21L13 12.58V19.29L19 15.91Z" fill="black"/>
</svg>
`,
		content: `
<table style="box-sizing: border-box; width: 100%" width="100%">
<tbody>
<!--{% for item in package_lines %}-->
    <tr><td><span>{{item.nr_of_packages}} x {{item.description}}</span></td></tr>
  <!--{% endfor %}-->
  </tbody>
</table>
`,
	});

	addBlock("notes", {
		label: "Notes",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 10H19.5L14 4.5V10ZM5 3H15L21 9V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.89 3.89 3 5 3ZM5 5V19H19V12H12V5H5Z" fill="black"/>
</svg>
`,
		content: `
<table style="box-sizing: border-box; width: 100%" width="100%">
<tbody>
<!--{% for note in notes %}-->
    <tr><td><span>{{note.title}}</span></td></tr>
    <tr><td><span>{{note.content}}</span></td></tr>
    <!--{% endfor %}-->
  </tbody>
</table>
`,
	});

	addBlock("files", {
		label: "Files",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="black"/>
</svg>
`,
		content: `
            <div>
<!--{% for file in files %}-->
<!--{% set isSignature = false %}-->
<!--{% for meta_data in file.meta_data %}-->
<!--{% if (meta_data.value == 'signature') %}-->
<!--{% set isSignature = true %}-->
<!--{% endif %}-->
<!--{% endfor %}-->
<!--{% if not isSignature %}--><img src="{{file.location}}" alt="{{file.value}}" style="width: 400px" width="400"><!--{% endif %}-->
<!--{% endfor %}-->
</div>
        `,
	});

	addBlock("signature", {
		label: "Signature",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9318 19.8684C12.5241 19.2461 12.1752 17.5301 11.3701 16.4454C10.574 15.334 9.47366 14.5693 8.36441 13.8314C7.5772 13.3335 6.85261 12.7111 6.27115 11.9998C6.02067 11.7064 5.51078 11.164 6.02962 11.0573C6.55741 10.9506 7.46985 11.4663 7.93502 11.6619C8.74907 11.9998 9.55417 12.391 10.3056 12.8533L11.2091 11.3418C9.81359 10.4261 8.02448 9.61697 6.3606 9.37691C5.41237 9.23465 4.41047 9.43026 4.08843 10.4527C3.80217 11.333 4.2584 12.2221 4.77724 12.9156C6.00278 14.5427 7.90818 15.3251 9.33053 16.7299C9.63468 17.0233 10.0014 17.37 10.1804 17.779C10.3682 18.1702 10.3235 18.1969 9.90304 18.1969C8.79379 18.1969 7.40723 17.3345 6.50373 16.7654L5.60023 18.2769C6.9689 19.1127 9.25896 20.4197 10.9318 19.8684ZM20.8524 5.99828C21.0492 5.80268 21.0492 5.4826 20.8524 5.29588L19.6895 4.14004C19.5016 3.95332 19.1796 3.95332 18.9917 4.14004L18.0793 5.04693L19.94 6.89628M12.05 11.0395V12.8889H13.9106L19.4122 7.42086L17.5515 5.57151L12.05 11.0395Z" fill="black"/>
</svg>
`,
		content: `
<div>
<!--{% for file in files %}-->
<!--{% set isSignature = false %}-->
<!--{% for meta_data in file.meta_data %}-->
<!--{% if (meta_data.value == 'signature') %}-->
<!--{% set isSignature = true %}-->
<!--{% endif %}-->
<!--{% endfor %}-->
<!--{% if isSignature %}--><img src="{{file.location}}" alt="{{file.value}}" style="width: 400px" width="400"><!--{% endif %}-->
<!--{% endfor %}-->
</div>`,
	});

	addBlock("portal-link", {
		label: "Portal Link",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5903 13.4103C11.0003 13.8003 11.0003 14.4403 10.5903 14.8303C10.2003 15.2203 9.56031 15.2203 9.17031 14.8303C7.22031 12.8803 7.22031 9.71031 9.17031 7.76031L12.7103 4.22031C14.6603 2.27031 17.8303 2.27031 19.7803 4.22031C21.7303 6.17031 21.7303 9.34031 19.7803 11.2903L18.2903 12.7803C18.3003 11.9603 18.1703 11.1403 17.8903 10.3603L18.3603 9.88031C19.5403 8.71031 19.5403 6.81031 18.3603 5.64031C17.1903 4.46031 15.2903 4.46031 14.1203 5.64031L10.5903 9.17031C9.41031 10.3403 9.41031 12.2403 10.5903 13.4103ZM13.4103 9.17031C13.8003 8.78031 14.4403 8.78031 14.8303 9.17031C16.7803 11.1203 16.7803 14.2903 14.8303 16.2403L11.2903 19.7803C9.34031 21.7303 6.17031 21.7303 4.22031 19.7803C2.27031 17.8303 2.27031 14.6603 4.22031 12.7103L5.71031 11.2203C5.70031 12.0403 5.83031 12.8603 6.11031 13.6503L5.64031 14.1203C4.46031 15.2903 4.46031 17.1903 5.64031 18.3603C6.81031 19.5403 8.71031 19.5403 9.88031 18.3603L13.4103 14.8303C14.5903 13.6603 14.5903 11.7603 13.4103 10.5903C13.0003 10.2003 13.0003 9.56031 13.4103 9.17031Z" fill="black"/>
</svg>
`,
		content: {
			type: "link",
			content: "Portal Link",
			style: { color: "#3b97e3" },
		},
	});

	addBlock("button", {
		label: "Button",
		category: customCategory,
		media: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.1 15.3C18 15.4 17.8 15.5 17.7 15.6L15.3 16L17 19.6C17.2 20 17 20.4 16.6 20.6L13.8 21.9C13.7 22 13.6 22 13.5 22C13.2 22 12.9 21.8 12.8 21.6L11.2 18L9.3 19.5C9.2 19.6 9 19.7 8.8 19.7C8.4 19.7 8 19.4 8 18.9V7.5C8 7 8.3 6.7 8.8 6.7C9 6.7 9.2 6.8 9.3 6.9L18 14.3C18.3 14.5 18.4 15 18.1 15.3ZM6 12H4V4H20V12H18.4L20.6 13.9C21.4 13.6 21.9 12.9 21.9 12V4C21.9 2.9 21 2 19.9 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H6V12Z" fill="black"/>
</svg>
`,
		content: '<a class="button">Button</a>',
	});
}
