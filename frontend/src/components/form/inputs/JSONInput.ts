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

export class JSONInput extends InputStructure {

    protected input: Block;

    constructor(public data: TextInputData, parent?: Block) {

        super(data, parent);

        this.setCustomType('json');
        
        this.input = new Block('textarea', {}, this.inputContainer);

        this.input.onNative('input', this.onInput.bind(this));

        setTimeout(this.computeHeight.bind(this), 10);
    }

    /*
    **
    **
    */
    private onInput() : void {

        this.computeHeight();

        this.setFilled(this.input.element.value.length > 0);
    }

    /*
    **
    **
    */
    public setValue(value: any | string) : void {
    
        if (typeof value === 'object')
            value = JSON.stringify(value, null, 4);
            
        this.input.element.value = value;

        this.onInput();
    }

    /*
    **
    **
    */
    public getValue() : string {

        return this.input.element.value.toString();
    }

    /*
    **
    **
    */
    private computeHeight() : void {

        this.inputContainer.element.style.height = '';
        this.inputContainer.element.style.height = this.input.element.scrollHeight + 'px';
    }
}