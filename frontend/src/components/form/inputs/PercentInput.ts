'use strict';

import {
    NumberInput,
    Block
} from '@src/components';

export interface PercentInputData {
    label: string;
    mandatory?: boolean;
    class?: string;
}

export class PercentInput extends NumberInput {

    constructor(public data: PercentInputData, parent?: Block) {

        super(data, parent);

        this.setCustomType('percent');

        this.resgisterEnterDownListener();
    }
}