'use strict';

import {
    Div,
    Block
} from '@src/components';

export class Grid extends Div {

    constructor(parent: Block) {

        super('grid', parent);
    }
}