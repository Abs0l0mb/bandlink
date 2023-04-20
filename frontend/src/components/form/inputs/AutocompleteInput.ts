'use strict';

import {
    InputStructure,
    Block,
    Div,
    SelectItem,
    SelectValue
} from '@src/components';

export interface AutocompleteInputData {
    label: string;
    getItems: (prompt: string) => Promise<SelectItem[]>;
    getText: (value: SelectValue) => Promise<string>;
    value?: SelectValue;
    mandatory?: boolean;
    class?: string;
}

export class AutocompleteInput extends InputStructure {

    private input: Block;
    private itemsContainer: Div;
    private itemsContainerDisplayed: boolean = false;
    private value: SelectValue = null;
    private text: string = '';
    private displayTimeouts: any[] = [];
    private initialParentScrollHeight: number;
    private isOver: boolean = false;
    private searchTimeout: any;
    private scrollCallback: (scrollBottom: number) => void = () => {};
    private lastScrollTop: number;
    private items: SelectItem[] = [];
    private itemsToDisplay: SelectItem[] = [];
    
    constructor(public data: AutocompleteInputData, parent?: Block) {

        super(data, parent);

        this.setCustomType('autocomplete');

        this.input = new Block('input', {}, this.inputContainer)
            .onNative('mousedown', this.onMouseDown.bind(this))
            .onNative('focusin', this.onFocusIn.bind(this))
            .onNative('focusout', this.onFocusOut.bind(this))
            .onNative('keydown', this.onKeyDown.bind(this))
            .onNative('input', this.onInput.bind(this))
            .onNative('keydown', this.onKeyDown.bind(this));

        this.onNative('mouseover', this.onMouseOver.bind(this));
        this.onNative('mouseout', this.onMouseOut.bind(this));
        
        this.itemsContainer = new Div('items-container', this)
            .onNative('scroll', this.onScroll.bind(this));

        this.setSearching(true);

        setTimeout(() => {
            this.initialParentScrollHeight = this.element.parentElement.scrollHeight;
        }, 50);

        this.populate();

        if (this.data.value)
            this.setValue(this.data.value);

        this.resgisterEnterDownListener();
    }

    /*
    **
    **
    */
    public async setValue(value: SelectValue) : Promise<void> {

        this.input.element.value = await this.data.getText(value);

        this.text = this.input.element.value;
        this.value = value;

        this.emit('value', this.value);

        this.setFilled(true);
        this.setSearching(false);
        this.populate();
    }

    /*
    **
    **
    */
    public getValue() : SelectValue {

        return this.value;
    }

    /*
    **
    **
    */
    public getText() : string {

        return this.text;
    }

    /*
    **
    **
    */
    private async displayItemsContainer() : Promise<void> {

        if (this.itemsContainerDisplayed)
            return;

        this.clearDisplayTimeouts();

        this.setData('items-display-state', 'started');

        this.displayTimeouts.push(setTimeout(() => {
            
            this.setData('items-display-state', 'displayed');

            this.itemsContainerDisplayed = true;

            this.displayTimeouts.push(setTimeout(this.scrollParentIfNeeded.bind(this), 150));
            
        }, 50));
    }

    /*
    **
    **
    */
    private async hideItemsContainer() : Promise<void> {

        this.clearDisplayTimeouts();
        
        this.setData('items-display-state', 'hidden');

        this.itemsContainerDisplayed = false;
    }

    /*
    **
    **
    */
    private scrollParentIfNeeded() : void {
        
        /*if (!this.element.parentElement)
            return;

        if (this.element.offsetTop + this.element.offsetHeight <= this.element.parentElement.offsetHeight)
            return;

        if (this.element.parentElement.scrollHeight - this.initialParentScrollHeight > 0)
            this.element.parentElement.scrollTop = this.element.parentElement.scrollHeight;*/
    }

    /*
    **
    **
    */
    private clearDisplayTimeouts() : void {

        for (let timeout of this.displayTimeouts)
            clearTimeout(timeout);
    }

    /*
    **
    **
    */
    private onMouseOver() : void {

        this.isOver = true;
    }

    /*
    **
    **
    */
    private onMouseOut() : void {

        this.isOver = false;
    }

    /*
    **
    **
    */
    private async onMouseDown() : Promise<void> {

        this.displayItemsContainer();
    }

    /*
    **
    **
    */
    private async onFocusIn() : Promise<void> {

        this.displayItemsContainer();
    }

    /*
    **
    **
    */
    private onFocusOut() : void {

        if (!this.isOver) 
            this.hideItemsContainer();
    }

    /*
    **
    **
    */
    private onInput() : void {

        this.setFilled(this.input.element.value.length > 0);

        this.value = null;
        this.setSearching(true);

        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(this.populate.bind(this), 50);
    }

    /*
    **
    **
    */
    protected onKeyDown(event: KeyboardEvent) : void {

        if (event.key === 'Tab')
            event.preventDefault();
    }

    /*
    **
    **
    */
    private async populate() : Promise<void> {

        this.items = await this.data.getItems(this.input.element.value);

        this.displayItemsGradually();
        this.scrollParentIfNeeded();
    }

    /*
    **
    **
    */
    private async displayItemsGradually() : Promise<void> {

        this.itemsContainer.empty();

        if (this.items.length === 0) {

            new Div('no-items', this.itemsContainer).write('No results found')
                .onNative('mousedown', () => {
                    this.input.element.blur();
                    this.hideItemsContainer();
                });

            return;
        }

        this.scrollCallback = (scrollBottom: number) => {};
        
        this.itemsContainer.element.scrollTop = 0;

        this.itemsToDisplay = [...this.items];

        this.displaySomeItems(true);

        this.scrollCallback = (scrollBottom: number) => {
            if (scrollBottom < 225)
                this.displaySomeItems(false);
        }
    }

    /*
    **
    **
    */
    private onScroll(event: UIEvent) : void {

        if (this.itemsContainer.element.scrollTop !== this.lastScrollTop)
            this.onScrollY();
        
        this.lastScrollTop = this.itemsContainer.element.scrollTop;
    }

    /*
    **
    **
    */
    private onScrollY() : void {

        const scrollBottom = this.itemsContainer.element.scrollHeight 
         - this.itemsContainer.element.clientHeight
         - this.itemsContainer.element.scrollTop;

        this.scrollCallback(scrollBottom);
    }

    /*
    **
    **
    */
    private async displaySomeItems(initialDisplay: boolean) : Promise<void> {
        
        let displayCount: number = initialDisplay ? 35 : 15;
        
        for (let i=0; i<displayCount; i++) {
            
            const item: SelectItem | undefined = this.itemsToDisplay.shift();
            
            if (!item)
                break;

            new Div({}, this.itemsContainer)
                .write(item.label)
                .onNative('mousedown', () => {
                    this.setValue(item.value);
                    this.input.element.blur();
                    this.hideItemsContainer();
                });
        }
    }
    
    /*
    **
    **
    */
    private setSearching(status: boolean) : void {

        this.setData('searching', status ? 1 : 0);
    }
}