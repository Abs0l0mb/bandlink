'use strict';

import {
    Popup,
    Div, 
    Api,
    Form,
    FormField,
    SelectItem,
    SelectValue,
    AutocompleteInput,
    Checkbox,
    TextInput
} from '@src/components';

export interface Right {
    id: number,
    checkbox: Checkbox
}

export class AddUserPopup extends Popup {

    private form: Form;

    private email: FormField;
    private password: FormField;
    private adminRights: Right[] = [];

    constructor() {

        super({
            validText: 'Add',
            cancellable: true,
            title: `Add user`,
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
        //LOGIN
        //=====

        this.email = this.form.add(new TextInput({
            label: 'Email',
            mandatory: true
        }));

        this.email.linkToErrorKey('email');

        this.password = this.form.add(new TextInput({
            label: 'Password',
            mandatory: true
        }));

        this.password.linkToErrorKey('password');

        //============
        //ADMIN RIGHTS
        //============

        new Div('checkboxes-label', this.form).write('Admin rights');

        for (let adminRight of await Api.get('/admin-rights')) {

            const checkbox = new Checkbox({
                label: adminRight.name
            });

            this.adminRights.push({
                id: adminRight.id,
                checkbox: checkbox
            });

            this.form.add(checkbox);
        }

        this.ready();
    }

    /*
    **
    **
    */
    public async onValid() : Promise<void> {

        this.validButton.load();

        try {

            await Api.post('/user/add', {
                email: this.email.input.getValue(),
                password: this.password.input.getValue(),
                adminRights: this.getCheckedAdminRights()
            });

            this.emit('success');
            this.hide();
                        
        } catch(error: any) {

            this.form.displayError(error);
            this.validButton.unload();
        }
    }

    /*
    **
    **
    */
    private getCheckedAdminRights() : number[] {

        const output: number[] = [];

        for (let adminRight of this.adminRights) {
            if (adminRight.checkbox.getValue())
                output.push(adminRight.id);
        }

        return output;
    }
}