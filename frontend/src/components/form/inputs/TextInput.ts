'use strict';

import {
    InputStructure,
    Block
} from '@src/components';

export interface TextInputData {
    label: string;
    mandatory?: boolean;
    maxLength?: number;
    autocomplete?: boolean;
    class?: string;
}

export class TextInput extends InputStructure {

    protected input: Block;

    constructor(public data: TextInputData, parent?: Block) {

        super(data, parent);

        this.setCustomType('text');
        
        this.input = new Block('input', {
            type: 'text',
            autocomplete: this.data.autocomplete ? this.data.autocomplete : 'none',
            maxlength: this.data.maxLength ? this.data.maxLength : 'none',
            novalidate: true
        }, this.inputContainer);

        this.input.onNative('input', this.onInput.bind(this));

        this.resgisterEnterDownListener();
    }

    /*
    **
    **
    */
    private onInput() : void {

        this.setFilled(this.input.element.value.length > 0);
    }

    /*
    **
    **
    */
    public setValue(value: string | number) : void {
        
        this.input.element.value = value;

        this.onInput();
    }

    /*
    **
    **
    */
    public getValue() : string | number {

        return this.input.element.value.toString();
    }
}