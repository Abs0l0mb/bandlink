'use strict';

export class Listener {

    public listeners: any[] = [];

    constructor() {
    }

    /*
    **
    **
    */
    public on(event: string, callback: any) : string {

        let id = Date.now().toString() + Math.random().toString();;

        this.listeners.push({
            id: id,
            event: event,
            callback: callback
        });

        return id;
    }

    /*
    **
    **
    */
    public off(key: string) : void {

        for (let i = 0; i < this.listeners.length; i++) {

            if (this.listeners[i] 
             && (this.listeners[i].event === key || this.listeners[i].id === key))
                this.listeners.splice(i, 1);
        }
    }

    /*
    **
    **
    */
    public emit(event: string, data?: any) : void {

        for (let i = 0; i < this.listeners.length; i++) {

            if (this.listeners[i] && this.listeners[i].event === event)
                this.listeners[i].callback(data);
        } 
    }
}