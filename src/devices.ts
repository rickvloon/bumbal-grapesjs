import { Editor } from "grapesjs";
import { PluginOptions } from '.';
import { t } from './i18n';

export default (editor: Editor, opts: Required<PluginOptions>) => {
    editor.DeviceManager.remove('tablet');
    editor.DeviceManager.remove('desktop');

    editor.DeviceManager.add({
        id: 'desktop',
        name: t('device.desktop'),
        width: '600px',
    })
};
