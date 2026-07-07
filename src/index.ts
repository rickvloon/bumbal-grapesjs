import type { Plugin } from 'grapesjs';
import juice from 'juice';
import loadBlocks from './blocks';
import loadCommands from './commands';
import loadComponents from './components';
import loadPanels from './panels';
import loadStyles from './styles';
import loadDevices from './devices';
import './theme.css';

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
};

export type RequiredPluginOptions = Required<PluginOptions>;

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
      margin: '0 auto 10px auto',
      padding: '5px 5px 5px 5px',
      width: '100%'
    },
    updateStyleManager: true,
    showStylesOnChange: true,
    showBlocksOnLoad: true,
    textCleanCanvas: 'Are you sure you want to clear the canvas?',
    ...opts,
  };

  // Change some config
  config.devicePreviewMode = true;
  config.canvasCss = `${config.canvasCss || ''}
    body {
      font-family: "Open Sans", sans-serif;
    }
    .cell:empty {
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
  loadBlocks(editor, options);
  loadPanels(editor, options);
  loadStyles(editor, options);
  loadDevices(editor, options);
};

export default plugin;
