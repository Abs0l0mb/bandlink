'use strict';

import {
    TextInput,
    Block
} from '@src/components';

export interface NumberInputData {
    label: string;
    mandatory?: boolean;
    class?: string;
}

export class NumberInput extends TextInput {

    protected input: Block;

    constructor(public data: NumberInputData, parent?: Block) {

        super(data, parent);

        this.setCustomType('number');
        
        this.input.setAttribute('type', 'number');

        this.resgisterEnterDownListener();
    }
}