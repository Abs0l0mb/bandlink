'use strict';

import {
    Popup,
    Form,
    FormField,
    TextInput,
    PasswordInput,
    Api,
    ClientLocation
} from '@src/components';

export class LoginPopup extends Popup {

    private form: Form;

    private email: FormField;
    private password: FormField;

    constructor() {

        super({
            validText: 'Sign in',
            title: `${ClientLocation.get().title} - Sign in`,
            closeZoneHidden: true,
            notRemovable: true
        });

        this.addClass('small');

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
            label: 'Email'
        }));

        this.email.linkToErrorKey('email');

        //========
        //PASSWORD
        //========

        this.password = this.form.add(new PasswordInput({
            label: 'Password'
        }));

        this.password.linkToErrorKey('password');

        this.form.on('enter-down', this.onValid.bind(this));

        this.ready();
    }

    /*
    **
    **
    */
    public async onValid() : Promise<void> {

        this.validButton.load();

        try {

            await Api.post('/login', {
                email: this.email.input.getValue(),
                password: this.password.input.getValue()
            });

            ClientLocation.get().auth.check();

            this.hide();

        } catch(error: any) {

            this.form.displayError(error);
            this.validButton.unload();
        }
    }
}