'use strict';

import {
    Popup,
    Api
} from '@src/components';

export class DeleteUserPopup extends Popup {

    constructor(private userId: number) {

        super({
            validText: 'Delete',
            validRed: true,
            cancellable: true,
            title: `Delete user confirmation`,
            message: `Do you want to delete user ${userId}?`
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

            await Api.post('/user/delete', {
                id: this.userId
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