import type { Editor } from 'grapesjs';
import { PluginOptions } from '.';
import { t } from './i18n';

export default function(editor: Editor, opts: Required<PluginOptions>) {
    let sectors = editor.StyleManager.getSectors();

    if (opts.updateStyleManager) {
        const styleManagerSectors = [{
            name: t('styles.sector.dimension'),
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            properties:[{
              property: 'margin',
              properties:[
                { name: t('styles.top'), property: 'margin-top'},
                { name: t('styles.left'), property: 'margin-left'},
                { name: t('styles.right'), property: 'margin-right'},
                { name: t('styles.bottom'), property: 'margin-bottom'}
              ],
            },{
              property  : 'padding',
              properties:[
                { name: t('styles.top'), property: 'padding-top'},
                { name: t('styles.right'), property: 'padding-right'},
                { name: t('styles.bottom'), property: 'padding-bottom'},
                { name: t('styles.left'), property: 'padding-left'}
              ],
            }],
          },{
            name: t('styles.sector.typography'),
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style', 'vertical-align', 'text-shadow'],
            properties:[
              { name: t('styles.font'), property: 'font-family'},
              { name: t('styles.weight'), property: 'font-weight'},
              { name: t('styles.fontColor'), property: 'color'},
              {
                property: 'text-align',
                type: 'radio',
                defaults: 'left',
                list: [
                  { value: 'left', name: t('styles.align.left'), className: 'fa fa-align-left'},
                  { value: 'center', name: t('styles.align.center'), className: 'fa fa-align-center' },
                  { value: 'right', name: t('styles.align.right'), className: 'fa fa-align-right'},
                  { value: 'justify', name: t('styles.align.justify'), className: 'fa fa-align-justify'}
                ],
              },{
                property: 'text-decoration',
                type: 'radio',
                defaults: 'none',
                list: [
                  { value: 'none', name: t('styles.decoration.none'), className: 'fa fa-times'},
                  { value: 'underline', name: t('styles.decoration.underline'), className: 'fa fa-underline' },
                  { value: 'line-through', name: t('styles.decoration.lineThrough'), className: 'fa fa-strikethrough'}
                ],
              },{
                property: 'font-style',
                type: 'radio',
                defaults: 'normal',
                list: [
                  { value: 'normal', name: t('styles.style.normal'), className: 'fa fa-font'},
                  { value: 'italic', name: t('styles.style.italic'), className: 'fa fa-italic'}
                ],
              },{
                property: 'vertical-align',
                type: 'select',
                defaults: 'baseline',
                list: [
                  { value: 'baseline'},
                  { value: 'top'},
                  { value: 'middle'},
                  { value: 'bottom'}
                ],
              },{
                property: 'text-shadow',
                properties: [
                  { name: t('styles.shadow.x'), property: 'text-shadow-h'},
                  { name: t('styles.shadow.y'), property: 'text-shadow-v'},
                  { name: t('styles.shadow.blur'), property: 'text-shadow-blur'},
                  { name: t('styles.shadow.color'), property: 'text-shadow-color'}
                ],
            }],
          },{
            name: t('styles.sector.decorations'),
            open: false,
            buildProps: ['background-color', 'border-collapse', 'border-radius', 'border', 'background'],
            properties: [{
              property: 'background-color',
              name: t('styles.background'),
            },{
              property: 'border-radius',
              properties  : [
                { name: t('styles.top'), property: 'border-top-left-radius'},
                { name: t('styles.right'), property: 'border-top-right-radius'},
                { name: t('styles.bottom'), property: 'border-bottom-left-radius'},
                { name: t('styles.left'), property: 'border-bottom-right-radius'}
              ],
            },{
              property: 'border-collapse',
              type: 'radio',
              defaults: 'separate',
              list: [
                { value: 'separate', name: t('styles.borderCollapse.no')},
                { value: 'collapse', name: t('styles.borderCollapse.yes')}
              ],
            },
            {
              property: 'border',
              properties: [
                { name: t('styles.border.width'), property: 'border-width', defaults: '0'},
                { name: t('styles.border.style'), property: 'border-style'},
                { name: t('styles.border.color'), property: 'border-color'},
              ],
            },{
              property: 'background',
              properties: [
                { name: t('styles.bg.image'), property: 'background-image'},
                { name: t('styles.bg.repeat'), property:   'background-repeat'},
                { name: t('styles.bg.position'), property: 'background-position'},
                { name: t('styles.bg.attachment'), property: 'background-attachment'},
                { name: t('styles.bg.size'), property: 'background-size'}
              ],
            }],
        }];

        editor.onReady(() => {
            sectors.reset();
            sectors.add(styleManagerSectors);
        });
    }
}