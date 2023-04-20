'use strict';

import {
    Div,
    Block,
    ClientLocation,
    Tools,
    Button,
    Popup
} from '@src/components';

import * as monaco from 'monaco-editor';

export abstract class HTMLEditor extends Div {

    protected editorZone: Div;
    protected codeZone: Div;
    protected previewZone: Div;
    protected iframe: Div;
    protected controlsZone: Div;
    protected nameInput: Block;
    protected saveButton: Button;
    protected lastSavedName: string;
    protected lastSavedCode: string;
    protected editor: monaco.editor.IStandaloneCodeEditor;
    protected messageListener: () => {};

    constructor() {

        super('html-editor', ClientLocation.get().block);

        this.messageListener = this.onMessage.bind(this);
        window.addEventListener('message', this.messageListener, true);
    }

    /*
    **
    **
    */
    protected async init() : Promise<void> {

        this.initEditor();
        this.initControls();

        await this.onPopulate();

        await Tools.sleep(10);
        this.setData('displayed', 1);
    }

    /*
    **
    **
    */
    private initEditor() : void {
        
        this.editorZone = new Div('editor-zone', this);
        
        this.codeZone = new Div('code-zone', this.editorZone);

        this.editor = monaco.editor.create(this.codeZone.element, {
            value: '<div></div>',
            language: 'html',
            automaticLayout: true,
            theme: 'vs-dark'
        });

        this.editor.onDidChangeModelContent(this.onCode.bind(this));

        this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, this.save.bind(this));

        this.previewZone = new Div('preview-zone', this.editorZone);

        this.iframe = new Block('iframe', {}, this.previewZone);
    }

    /*
    **
    **
    */
    private initControls() : void {
        
        this.controlsZone = new Div('controls-zone', this);

        this.nameInput = new Block('input', {
            placeholder: 'Name'
        }, this.controlsZone).onNative('input', this.computeSaveButtonState.bind(this));

        this.saveButton = new Button({
            label: 'Save'
        }, this.controlsZone).onNative('click', this.save.bind(this));

        new Button({
            label: 'Exit'
        }, this.controlsZone).onNative('click', this.exit.bind(this));
    }

    /*
    **
    **
    */
    private async save() : Promise<void> {
        
        await this.onSave();

        this.lastSavedName = this.nameInput.element.value;
        this.lastSavedCode = this.editor.getValue();

        this.computeSaveButtonState();
    }

    /*
    **
    **
    */
    private exit() : void {

        this.setData('displayed', 0);

        window.removeEventListener('message', this.messageListener, true);
        
        this.emit('success');

        setTimeout(function() {
            this.delete();
        }.bind(this), 350);
    }

    /*
    **
    **
    */
    private computeSaveButtonState() : void {

        if (this.lastSavedName === this.nameInput.element.value && this.lastSavedCode === this.editor.getValue())
            this.saveButton.disable();
        else
            this.saveButton.enable();
    }

    /*
    **
    **
    */
    protected displayError(message: any) : void {

        new Popup({
            title: 'Error received',
            class: 'smaller',
            message: message,
            validText: 'Ok',
            cancellable: false,
            ready: true
        });
    }

    /*
    **
    **
    */
    private onCode() : void {

        const blob = new Blob([this.editor.getValue()], {
            type: 'text/html'
        });

        const objectURL = URL.createObjectURL(blob);
        
        this.iframe.setAttribute('src', objectURL);

        this.computeSaveButtonState();
    }

    /*
    **
    **
    */
    private onMessage(event: MessageEvent) : void {

        const message = JSON.parse(event.data);

        if (typeof message === 'object' && message !== null && message.type === 'route-request' && typeof message.route === 'string')
            alert(`route-request received: ${message.route}`);
    }

    /*
    **
    **
    */
    protected abstract onPopulate() : Promise<void>;

    /*
    **
    **
    */
    protected abstract onSave() : Promise<void>;
}