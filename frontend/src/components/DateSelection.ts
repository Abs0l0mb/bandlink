'use strict';

import {
    Div,
    ClientLocation,
    Tools
} from '@src/components';

import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';

export interface DateSelectionOption {
    date?: Date
}

export class DateSelection extends Div {

    private closeZone: Div;
    private box: Div;
    private vanillaCalendar: any/*VanillaCalendar*/;
    private date: Date | null;

    constructor(private x: number, private y: number, private options: DateSelectionOption = {}) {
        
        super('date-selection', ClientLocation.get().block);

        this.closeZone = new Div('close-zone', this).onNative('click', this.hide.bind(this));

        this.box = new Div('box', this).setStyles({
            left: '0px',
            top: '0px'
        });

        this.vanillaCalendar = new VanillaCalendar(this.box.element, {
            actions: {
                clickDay: this.onDayClick.bind(this)
            }
        });

        this.vanillaCalendar.init();

        if (this.options.date)
            this.setDate(this.options.date);

        this.show();
    }

    /*
    **
    **
    */
    public setDate(date: Date) : void {

        if (!date)
            return;

        const ISOString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

        this.vanillaCalendar.settings.selected = {
            dates: [ISOString.split('T')[0]],
            month: date.getMonth(),
            year: date.getFullYear()
        };

        this.vanillaCalendar.update();

        this.date = date;
    }

    /*
    **
    **
    */
    private onDayClick(element: any, dates: any) : void {

        if (!dates[0]) {
            this.hide();
            return;
        }

        this.date = new Date(dates[0]);
        
        this.emit('date', this.date);

        this.hide();
    }

    /*
    **
    **
    */
    private async show() : Promise<void> {

        await Tools.sleep(50);
        
        let x = this.x;
        let y = this.y;

        if (x + this.box.element.offsetWidth >= document.body.scrollWidth)
            x -= this.box.element.offsetWidth;

        if (y + this.box.element.offsetHeight >= document.body.scrollHeight)
            y -= this.box.element.offsetHeight;
        
        this.box.setStyles({
            left: `${x}px`,
            top: `${y}px`
        });

        this.setData('displayed', 1);
    }

    /*
    **
    **
    */
    public async hide() : Promise<void> {

        this.emit('hide');
        
        this.setData('displayed', 0);

        await Tools.sleep(250);
        
        this.delete();
    }
}