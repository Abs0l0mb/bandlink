'use strict';

import {
    Div,
    Form
} from '@src/components';

export class InlineInputsContainer extends Div {

    constructor(form: Form) {

        super('inline-inputs-container', form);
    }
}