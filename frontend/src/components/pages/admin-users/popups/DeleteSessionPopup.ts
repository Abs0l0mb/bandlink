'use strict';

import {
    Popup,
    Api
} from '@src/components';

export class DeleteSessionPopup extends Popup {

    constructor(private sessionId: number) {

        super({
            validText: 'Delete',
            validRed: true,
            cancellable: true,
            title: `Delete session confirmation`,
            message: `Do you want to delete session ${sessionId}?`
        });

        this.ready();
    }

    /*
    **
    **
    */
    public async onValid() : Promise<void> {

        this.validButton.load();

        try {

            await Api.post('/session/delete', {
                id: this.sessionId
            });

            this.hide();
            
            this.emit('done');
            
        } catch(error: any) {

            console.log(error);
            
            this.unlock();
            this.validButton.unload();
        }
    }
}