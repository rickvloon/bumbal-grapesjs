import type { Plugin } from 'grapesjs';
import juice from 'juice';
import loadBlocks from './blocks';
import loadCommands from './commands';
import loadComponents, { wrapBareTwigInComments } from './components';
export { wrapBareTwigInComments } from './components';
import loadPanels from './panels';
import loadStyles from './styles';
import loadDevices from './devices';
import loadVariables from './variables';
import loadTraits from './traits';
import loadTypes from './types';
import loadPreview from './preview';
import loadRte from './rte';
import './theme.css';

/**
 * An asset returned by an `UploadFileFn` upload.
 */
export interface UploadedAsset {
  src: string;
  name?: string;
}

/**
 * Custom handler for uploading files dropped/selected in the image
 * uploader trait, matching GrapesJS's own `FileUploader.uploadFile`
 * signature - receives the native drag/drop or file-input change event,
 * and an optional callback to invoke with `{ data: [...] }` once the
 * upload completes. The default implementation just embeds the file as a
 * base64 data URI; pass your own to upload it somewhere real instead.
 */
export type UploadFileFn = (
  e: Event | DragEvent,
  clb?: (result: { data: UploadedAsset[] }) => void
) => void | Promise<void>;

export interface PluginOptions {
  /**
   * Which blocks to add.
   */
  blocks?: string[];

  /**
   * Add custom block options, based on block id.
   * @default (blockId) => ({})
   * @example (blockId) => blockId === 'link' ? { attributes: {...} } : {};
   */
  block?: (blockId: string) => ({});

  /**
   * Custom style for table blocks.
   */
  tableStyle?: Record<string, string>;

  /**
   * Custom style for table cell blocks.
   */
  cellStyle?: Record<string, string>;

  /**
   * Import command id.
   * @default 'gjs-open-import-template'
   */
  cmdOpenImport?: string;

  /**
   * Toggle images command id.
   * @default 'gjs-toggle-images'
   */
  cmdTglImages?: string;

  /**
   * Get inlined HTML command id.
   * @default 'gjs-get-inlined-html'
   */
  cmdInlineHtml?: string,

  /**
   * Title for the import modal.
   * @default 'Import template'
   */
  modalTitleImport?: string;

  /**
   * Title for the export modal.
   * @default 'Export template'
   */
  modalTitleExport?: string,

  /**
   * Label for the export modal.
   * @default ''
   */
  modalLabelExport?: string,

  /**
   * Label for the import modal.
   * @default ''
   */
  modalLabelImport?: string,

  /**
   * Label for the import button.
   * @default 'Import'
   */
  modalBtnImport?: string,

  /**
   * Template as a placeholder inside import modal.
   * @default ''
   */
  importPlaceholder?: string;

  /**
   * If `true`, inlines CSS on export.
   * @default true
   */
  inlineCss?: boolean;

  /**
   * Update Style Manager with more reliable style properties to use for newsletters.
   * @default true
   */
  updateStyleManager?: boolean;

  /**
   * Show the Style Manager on component change.
   * @default true
   */
  showStylesOnChange?: boolean;

  /**
   * Show the Block Manager on load.
   * @default true
   */
  showBlocksOnLoad?: boolean;

  /**
   * Code viewer theme.
   * @default 'hopscotch'
   */
  codeViewerTheme?: string;

  /**
   * Custom options for `juice` HTML inliner.
   * @default {}
   */
  juiceOpts?: juice.Options;

  /**
   * Confirm text before clearing the canvas.
   * @default 'Are you sure you want to clear the canvas?'
   */
  textCleanCanvas?: string;

  /**
   * Variables shown in the collapsible Variables panel, grouped by category.
   * Each entry maps a display name to its twig code.
   */
  variables?: Record<string, Record<string, string>>;

  /**
   * Bumbal-specific options.
   */
  bumbalOptions?: {
    instance?: string;
  };

  /**
   * Custom handler for uploading files dropped/selected in the image
   * uploader trait. See `UploadFileFn`.
   * @default embeds the file as a base64 data URI
   */
  uploadFile?: UploadFileFn;

  /**
   * Called with the current inlined HTML whenever the canvas content
   * changes - eg. to save/snapshot it for restoring later. Not called for
   * updates that happen while in preview mode (those reflect the
   * Twig-rendered output, not real edits).
   * @default undefined
   */
  onUpdate?: (html: string) => void;

  /**
   * Initial HTML content, run through `wrapBareTwigInComments` before being
   * set. Prefer this over GrapesJS's own `components`/`fromElement` init
   * options if your content may contain bare `{% %}` twig tags (eg. a
   * `{% for %}` around table rows) - those config options get parsed into
   * components synchronously inside the `Editor` constructor, before any
   * plugin (including this one) runs, so there's no way for a plugin to
   * transform that content first. This option instead applies the wrap and
   * calls `editor.setComponents()` from within the plugin itself.
   * @default undefined
   */
  initialContent?: string;
};

export type RequiredPluginOptions = Required<PluginOptions>;

const defaultUploadFile: UploadFileFn = (e, clb) => {
  const dt = (e as DragEvent).dataTransfer;
  const file = dt ? dt.files?.[0] : (e.target as HTMLInputElement)?.files?.[0];
  if (!file || file.type.indexOf('image/') !== 0) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') clb?.({ data: [{ src: reader.result, name: file.name }] });
  };
  reader.readAsDataURL(file);
};

const plugin: Plugin<PluginOptions> = (editor, opts: Partial<PluginOptions> = {}) => {
  let config = editor.getConfig();

  const options: RequiredPluginOptions = {
    blocks: [
      'sect100', 'sect50', 'sect30', 'sect25', 'sect13l', 'sect13r',
      'heading-h1', 'heading-h2', 'text', 'subtitle', 'image', 'link',
      'packageline', 'notes', 'files', 'signature', 'portal-link', 'button',
      'divider', 'text-sect', 'quote', 'link-block', 'grid-items', 'list-items',
    ],
    block: () => ({}),
    juiceOpts: {},
    cmdOpenImport: 'gjs-open-import-template',
    cmdTglImages: 'gjs-toggle-images',
    cmdInlineHtml: 'gjs-get-inlined-html',
    modalTitleImport: 'Import template',
    modalTitleExport: 'Export template',
    modalLabelImport: '',
    modalLabelExport: '',
    modalBtnImport: 'Import',
    codeViewerTheme: 'hopscotch',
    importPlaceholder: '',
    inlineCss: true,
    cellStyle: {
      padding: '0',
      margin: '0',
      'vertical-align': 'top',
    },
    tableStyle: {
      height: '150px',
      margin: '0px',
      padding: '5px 5px 5px 5px',
      width: '100%'
    },
    updateStyleManager: true,
    showStylesOnChange: true,
    showBlocksOnLoad: true,
    textCleanCanvas: 'Are you sure you want to clear the canvas?',
    variables: {
      Activity: {
        Number: '{{nr}}',
        UUID: '{{uuid}}',
        'Activity type': '{{activity_type_name}}',
        'Start time': '{{date_time_from}}',
        'End time': '{{date_time_to}}',
        'Package lines': '{{package_lines}}',
      },
      Address: {
        'Contact person': '{{address.contact_person}}',
        'Street name': '{{address.street_1}}',
        'Street name 2': '{{address.street_2}}',
        'House number': '{{address.house_nr}}',
        'House number addition': '{{address.house_nr_addendum}}',
        'Zip code': '{{address.zipcode}}',
        City: '{{address.city}}',
        Country: '{{address.iso_country}}',
        'Address summary': '{{address.summary}}',
      },
      Other: {
        Reference: '{{reference}}',
        'Driver full name': '{{driver_full_name}}',
        'Assignment number': '{{assignment.nr}}',
        'Account name': '{{assignment.account_name}}',
      },
    },
    bumbalOptions: {
        instance: "stage"
    },
    uploadFile: defaultUploadFile,
    onUpdate: () => {},
    initialContent: '',
    ...opts,
  };

  // Change some config
  config.devicePreviewMode = true;
  // Layout properties (not inherited by dropped-in content) always apply to
  // the cell. Everything else (eg. color, font-size) is typography that would
  // otherwise cascade into whatever gets dropped into the cell, so it's only
  // applied while the cell has no content yet.
  const layoutCellProps = ['vertical-align', 'padding', 'margin', 'height', 'width', 'border', 'background', 'background-color'];
  const cellEntries = Object.entries(options.cellStyle);
  const alwaysCellStyleStr = cellEntries
    .filter(([prop]) => layoutCellProps.includes(prop))
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(' ');
  const emptyOnlyCellStyleStr = cellEntries
    .filter(([prop]) => !layoutCellProps.includes(prop))
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(' ');
  config.canvasCss = `${config.canvasCss || ''}
    body {
      font-family: "Open Sans", sans-serif;
    }
    .cell {
      ${alwaysCellStyleStr}
    }
    .cell:empty {
      ${emptyOnlyCellStyleStr}
      position: relative;
      background-color: #eaf3fd;
      text-align: center;
      vertical-align: middle !important;
    }
    .cell:empty::before {
      content: "No content here.\\A Drag content from the right.";
      white-space: pre-line;
      display: inline-block;
      color: #3b97e3;
      font-family: "Open Sans", sans-serif;
      font-size: 12px;
      line-height: 1.6;
    }
  `;

  loadCommands(editor, options);
  loadComponents(editor, options);
  loadTraits(editor, options);
  loadTypes(editor, options);
  loadBlocks(editor, options);
  loadPanels(editor, options);
  loadStyles(editor, options);
  loadDevices(editor, options);
  loadVariables(editor, options);
  loadPreview(editor, options);
  loadRte(editor, options);

  if (options.initialContent) {
    // Deferred until the editor is fully ready (past `loadOnStart()`/
    // `render()`) - calling `setComponents` synchronously during plugin
    // init runs ahead of modules (UndoManager, Canvas, etc.) it depends on,
    // which aren't fully set up yet at this point.
    editor.onReady(() => {
      editor.setComponents(wrapBareTwigInComments(options.initialContent));
    });
  }
};

export default plugin;
