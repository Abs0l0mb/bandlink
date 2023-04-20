'use strict';

import {
    Block,
    Div,
    ClientLocation
} from '@src/components';

export class VerticalSplit extends Div {

    public topContainer: Div;
    public bottomContainer: Div;
    private topZone: Div;
    private bottomZone: Div;
    private resizer: Div;
    private mouseY: number | null = null;

    constructor(parent: Block) {

        super('split vertical', parent);

        this.topZone = new Div('top-zone', this);
        this.topContainer = new Div('top-container', this.topZone);
        this.resizer = new Div('resizer', this.topZone);

        this.bottomZone = new Div('bottom-zone', this);
        this.bottomContainer = new Div('bottom-container', this.bottomZone);

        this.resizer.onNative('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    /*
    **
    **
    */
    private onMouseDown(event: MouseEvent) : void {

        this.mouseY = event.clientY;

        this.setData('resizing', 1);
        ClientLocation.get().block.setData('resizing-y', 1);
    }

    /*
    **
    **
    */
    private onMouseMove(event: MouseEvent) : void {

        if (!this.mouseY)
            return;

        let mouseY = event.clientY;

        let diff = this.mouseY - mouseY;

        if (diff === 0)
            return;
        
        let absDiff = Math.abs(diff);

        let parentHeight = this.element.parentElement ? this.element.parentElement.offsetHeight : 0;
        let topHeight = this.topZone.element.offsetHeight;
        let bottomHeight = this.bottomZone.element.offsetHeight;

        let topPercent: number;
        let bottomPercent: number;

        if (diff > 0) {

            topPercent = (topHeight - absDiff) * 100 / parentHeight;
            bottomPercent = (bottomHeight + absDiff) * 100 / parentHeight;

            if (topPercent <= 10) {
                topPercent = 10;
                bottomPercent = 90;
            }
        }
        else {

            topPercent = (topHeight + absDiff) * 100 / parentHeight;
            bottomPercent = (bottomHeight - absDiff) * 100 / parentHeight;
            
            if (bottomPercent <= 10){
                topPercent = 90;
                bottomPercent = 10;
            }
        }

        this.topZone.setStyle('height', `${topPercent}%`);
        this.bottomZone.setStyle('height', `${bottomPercent}%`);
        
        this.mouseY = mouseY;
    }

    /*
    **
    **
    */
    private onMouseUp(event: MouseEvent) : void {

        this.mouseY = null;

        this.setData('resizing', 0);
        ClientLocation.get().block.setData('resizing-y', 0);
    }

    /*
    **
    **
    */
    public setTopHeight(percent: number) {

        this.topZone.setStyle('height', `${percent}%`);
        this.bottomZone.setStyle('height', `${100 - percent}%`);
    }

    /*
    **
    **
    */
    public setBottomHeight(percent: number) {
        
        this.topZone.setStyle('height', `${100 - percent}%`);
        this.bottomZone.setStyle('height', `${percent}%`);
    }
}