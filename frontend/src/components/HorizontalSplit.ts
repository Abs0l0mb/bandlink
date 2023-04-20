'use strict';

import {
    Block,
    Div,
    ClientLocation
} from '@src/components';

export class HorizontalSplit extends Div {

    private leftZone: Div;
    private rightZone: Div;
    public leftContainer: Div;
    public rightContainer: Div;
    private resizer: Div;
    private mouseX: number | null = null;
    
    constructor(parent: Block) {

        super('split horizontal', parent);

        this.leftZone = new Div('left-zone', this);
        this.leftContainer = new Div('left-container', this.leftZone);
        this.resizer = new Div('resizer', this.leftZone);

        this.rightZone = new Div('right-zone', this);
        this.rightContainer = new Div('right-container', this.rightZone);

        this.resizer.onNative('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    /*
    **
    **
    */
    private onMouseDown(event: MouseEvent) : void {

        this.mouseX = event.clientX;

        this.setData('resizing', 1);
        ClientLocation.get().block.setData('resizing-x', 1);
    }

    /*
    **
    **
    */
    private onMouseMove(event: MouseEvent) : void {

        if (!this.mouseX)
            return;

        let mouseX = event.clientX;

        let diff = this.mouseX - mouseX;

        if (diff === 0)
            return;
        
        let absDiff = Math.abs(diff);
        
        let parentWidth = this.element.parentElement ? this.element.parentElement.offsetWidth : 0;
        let leftWidth = this.leftZone.element.offsetWidth;
        let rightWidth = this.rightZone.element.offsetWidth;

        let leftPercent: number;
        let rightPercent: number;

        if (diff > 0) {

            leftPercent = (leftWidth - absDiff) * 100 / parentWidth;
            rightPercent = (rightWidth + absDiff) * 100 / parentWidth;

            if (leftPercent <= 5) {
                leftPercent = 5;
                rightPercent = 95;
            }
        }
        else {

            leftPercent = (leftWidth + absDiff) * 100 / parentWidth;
            rightPercent = (rightWidth - absDiff) * 100 / parentWidth;

            if (rightPercent <= 5) {
                leftPercent = 95;
                rightPercent = 5;
            }
        }

        this.leftZone.setStyle('width', `${leftPercent}%`);
        this.rightZone.setStyle('width', `${rightPercent}%`);

        this.mouseX = mouseX;
    }

    /*
    **
    **
    */
    private onMouseUp(event: MouseEvent) : void {

        this.mouseX = null;

        this.setData('resizing', 0);
        ClientLocation.get().block.setData('resizing-x', 0);
    }
    
    /*
    **
    **
    */
    public setLeftWidth(percent: number) {

        this.leftZone.setStyle('width', `${percent}%`);
        this.rightZone.setStyle('width', `${100 - percent}%`);
    }

    /*
    **
    **
    */
    public setRightWidth(percent: number) {
        
        this.leftZone.setStyle('width', `${100 - percent}%`);
        this.rightZone.setStyle('width', `${percent}%`);
    }
}