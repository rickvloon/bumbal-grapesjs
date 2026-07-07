import type { Editor } from 'grapesjs';
import { PluginOptions } from '.';
import { cmdClear, cmdDeviceDesktop, cmdDeviceMobile } from './consts';

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { Panels } = editor;
  const { cmdOpenImport } = opts;
  const openExport = 'export-template';
  const openStyleManager = 'open-sm';
  const openBlocks = 'open-blocks';
  const activatePreview = 'preview';
  const viewCommands = [openStyleManager, 'open-tm', 'open-layers', openBlocks];

  // Only one view (Style Manager/Traits/Layers/Blocks) shows at a time,
  // now that there's no button group to enforce that automatically.
  const showView = (cmdId: string) => {
    viewCommands.filter(id => id !== cmdId).forEach(id => editor.stopCommand(id));
    editor.runCommand(cmdId);
  };
  const iconStyle = 'style="display: block; max-width: 22px"';

  // Turn off default devices select and create new one
  editor.getConfig().showDevices = false;

  Panels.getPanels().reset([
    {
      id: 'commands',
      buttons: [{
        id: cmdDeviceDesktop,
        command: cmdDeviceDesktop,
        active: true,
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" />
        </svg>`
      }, {
        id: cmdDeviceMobile,
        command: cmdDeviceMobile,
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
        </svg>`
      }, {
        id: activatePreview,
        context: activatePreview,
        command: activatePreview,
        label: `<svg ${iconStyle} viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path></svg>`
      }],
    },
    {
      id: 'middle',
      buttons: [{
        id: 'undo',
        command: 'core:undo',
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
        </svg>`
      }, {
        id: 'redo',
        command: 'core:redo',
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M10.5 18H18V20H10.5C6.91 20 4 17.09 4 13.5S6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5S8 18 10.5 18Z" />
        </svg>`,
      }, {
        id: cmdClear,
        command: cmdClear,
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>`,
      }],
    },
    {
      id: 'options',
      buttons: [{
        id: openExport,
        command: openExport,
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z" />
        </svg>`
      }, {
        id: cmdOpenImport,
        command: cmdOpenImport,
        label: `<svg ${iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
        </svg>`,
      }],
  }]);

  // On component change show the Style Manager
  opts.showStylesOnChange && editor.on('component:selected', () => {
    editor.getSelected() && showView(openStyleManager);
  });

  // Do stuff on load
  editor.onReady(() => {
    if (opts.showBlocksOnLoad) {
      showView(openBlocks);
    }
  });
};