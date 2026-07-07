import { Editor } from "grapesjs";
import { PluginOptions } from '.';

export default (editor: Editor, opts: Required<PluginOptions>) => {
    editor.DeviceManager.remove('tablet');
    editor.DeviceManager.remove('desktop');

    editor.DeviceManager.add({
        id: 'desktop',
        name: 'Desktop',
        width: '600px',  
    })
};
