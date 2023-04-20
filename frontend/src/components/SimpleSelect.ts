'use strict';

import {
    Block,
    Div
} from '@src/components';

export interface SimpleSelectItem {
    label: string;
    value: string | number;
}

export interface SimpleSelectData {
    label: string;
    items?: SimpleSelectItem[];
    value?: string | number;
    class?: string;
}

export class SimpleSelect extends Div {

    private select: Block;
    private text: Div;
    private value: number | string | null = null;
    private items: SimpleSelectItem[] = [];

    constructor(public data: SimpleSelectData, parent?: Block) {

        super('simple-select', parent);

        if (this.data.class)
            this.addClass(this.data.class);

        this.select = new Block('select', {}, this);
        
        this.select.onNative('change', this.onChange.bind(this));

        new Div('label', this).write(this.data.label);

        this.text = new Div('text', this);

        if (this.data.items)
            this.setItems(this.data.items);
        
        if (this.data.value)
            this.setValue(this.data.value);
    }

    /*
    **
    **
    */
    private onChange() : void {

        const number = new Number(this.select.element.value).valueOf();
        const value: string | number = !isNaN(number) ? number : this.select.element.value;

        console.log(this.value, value);

        if (this.value === value)
            return;

        for (let item of this.items) {

            if (item.value === value) {

                this.value = value;
                
                this.emit('value', this.value);

                this.select.element.value = this.value;
                
                this.text.write(item.label);
            }
        }
    }

    /*
    **
    **
    */
    public setItems(items: SimpleSelectItem[]) : void {

        this.select.empty();

        for (let item of items) {

            new Block('option', {
                value: item.value
            }, this.select).write(item.label);
        }

        this.items = items;

        this.value = null;
        this.text.empty();
    }

    /*
    **
    **
    */
    public setValue(value: string | number) : void {

        this.select.element.value = value;
        this.select.element.dispatchEvent(new Event('change'));
    }

    /*
    **
    **
    */
    public getValue() : string | number | null {

        return this.value;
    }
}