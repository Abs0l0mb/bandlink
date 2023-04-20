'use strict';

import {
    Listener,
    Tools
} from '@src/components';

export class Block extends Listener {

    public element: any /*HTMLElement*/;
    public uid: string = Tools.uid();
    public data: any = {};
    
    constructor(private tag: any,
                private attributes?: any,
                parent?: any /*Block | HTMLElement*/) {

        super();

        this.element = this.tag instanceof HTMLElement ? this.tag : document.createElement(this.tag);
        
        if (typeof this.attributes === 'string')
            this.attributes = { class: attributes };
        
        if (this.attributes)
            this.setAttributes(this.attributes);
        
        if (parent)
            this.appendTo(parent);
    }

    /*
    **
    **
    */
    public getAttribute(key: string) : any {

        return this.element.getAttribute(key);
    }

    /*
    **
    **
    */
    public setAttribute(key: any, value: any) : Block {
    
        this.element.setAttribute(key, value);

        return this;
    }

    /*
    **
    **
    */
    public setAttributes(attributes: {[key: string] : string}) : Block {
        
        for (let key in attributes)
            this.setAttribute(key, attributes[key]);

        return this;
    }

    /*
    **
    **
    */
    public removeAttribute(key: string) : Block {

        this.element.removeAttribute(key);

        return this;
    }

    /*
    **
    **
    */
    public setData(key: string, value: string | number) : Block {

        this.setAttribute(`data-${key}`, value);

        return this;
    }

    /*
    **
    **
    */
    public getData(key: string) : any {

        return this.element.getAttribute(`data-${key}`)
    }

    /*
    **
    **
    */
    public getStyle(key: string) : any {

        return getComputedStyle(this.element).getPropertyValue(key);
    }

    /*
    **
    **
    */
    public setStyle(key: string, value: string) : Block {

        this.element.style.setProperty(key, value);
        
        return this;
    }

    /*
    **
    **
    */
    public setStyles(styles: {[key: string]: string}) : Block {

        for (let key in styles)
            this.setStyle(key, styles[key]);

        return this;
    }

    /*
    **
    **
    */
    public html(html: string) : Block {

        this.empty();
        this.element.innerHTML = html;

        return this;
    }

    /*
    **
    **
    */
    public empty() : Block {

        while(this.element.firstChild)
            this.element.removeChild(this.element.firstChild);

        return this;
    }

    /*
    **
    **
    */
    public write(text) : Block {

        this.empty();
        
        let textNode = document.createTextNode(text);
        this.element.appendChild(textNode);

        return this;  
    }

    /*
    **
    **
    */
    public append(child: any /*Block | HTMLElement*/) : Block { 

        if (child instanceof Block)
            this.element.append(child.element);
        else if (child instanceof HTMLElement)
            this.element.append(child);

        return this;
    }

    /*
    **
    **
    */
    public prepend(child: any /*Block | HTMLElement*/) : Block {

        if (child instanceof Block)
            this.element.prepend(child.element);
        else if (child instanceof HTMLElement)
            this.element.prepend(child);

        return this;
    }
    
    /*
    **
    **
    */
    public appendTo(parent: any /*Block | HTMLElement*/) : Block { 

        if (parent instanceof Block)
            parent.element.append(this.element);
        else if (parent instanceof HTMLElement)
            parent.append(this.element);

        return this;
    }
    
    /*
    **
    **
    */
    public prependTo(parent: any /*Block | HTMLElement*/) : Block {

        if (parent instanceof Block)
            parent.element.prepend(this.element);
        else if (parent instanceof HTMLElement)
            parent.prepend(this.element);
            
        return this;
    }

    /*
    **
    **
    */
    public hasClass(className: string) : boolean {

        return this.element.classList.contains(className);
    }

    /*
    **
    **
    */
    public addClass(className: string) : Block {
        
        let classes = className.split(' ');

        for (let className_ of classes)
            this.element.classList.add(className_);

        return this;
    }

    /*
    **
    **
    */
    public removeClass(className: string) : Block {

        this.element.classList.remove(className);

        return this;
    }

    /*
    **
    **
    */
    public onBeforeDelete(): void {}

    /*
    **
    **
    */
    public delete() : void {

        if (!this.element)
            return;
        
        if (typeof this.onBeforeDelete === 'function')
            this.onBeforeDelete();
        
        if (this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
        
        this.listeners = [];
    }

    /*
    **
    **
    */
    public isMounted() : boolean {

        return document.contains(this.element);
    }

    /*
    **
    **
    */
    public onNative(key: string, callback: any) {

        this.element.addEventListener(key, callback);

        return this;
    }

    /*
    **
    **
    */
    public setBackground(url: string) {

        this.setStyle('background-image', `url(${url})`);
    }
}