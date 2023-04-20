'use strict';

import {
    Popup,
    Api,
    Form,
    FormField,
    TextInput
} from '@src/components';

export class EditMyDataPopup extends Popup {

    private form: Form;

    private email: FormField;

    constructor() {

        super({
            validText: 'Update',
            cancellable: true,
            title: `Edit my data`,
        });

        this.build();
    }

    /*
    **
    **
    */
    private async build() : Promise<void> {

        this.form = new Form(this.content);

        //=====
        //EMAIL
        //=====

        this.email = this.form.add(new TextInput({
            label: 'Email',
            mandatory: true
        }));

        this.email.linkToErrorKey('email');

        this.populate();
    }

    /*
    **
    **
    */
    private async populate() : Promise<void> {
        
        try {

            let data: any = await Api.get('/me');

            this.email.input.setValue(data.email);
            
            this.ready();
            
        } catch(error: any) {
            console.log(error);
        }
    }

    /*
    **
    **
    */
    public async onValid() : Promise<void> {

        this.validButton.load();

        try {

            await Api.post('/me/update', {
                email: this.email.input.getValue()
            });

            this.emit('success', {
                'Email': this.email.input.getValue()
            });
            
            this.hide();

        } catch(error: any) {
            
            this.form.displayError(error);
            this.validButton.unload();
        }
    }
}