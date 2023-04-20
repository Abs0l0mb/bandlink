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
    Checkbox
} from '@src/components';

export interface Right {
    id: number,
    checkbox: Checkbox
}

export class EditUserPopup extends Popup {

    private form: Form;

    private email: FormField;
    private adminRights: Right[] = [];
    private accessRights: Right[] = [];

    constructor(private userId: number) {

        super({
            validText: 'Update',
            cancellable: true,
            title: `Edit user ${userId}`,
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

        this.email = this.form.add(new AutocompleteInput({
            label: 'Email',
            mandatory: true,
            async getItems(prompt: string) : Promise<SelectItem[]> { 

                const items: SelectItem[] = [];

                for (let proposition of await Api.get('/users/email-propositions', {
                    prompt: prompt
                })) {

                    items.push({ 
                        label: proposition.EMAIL,
                        value: proposition.EMAIL
                    });
                }

                return items;
            },
            async getText(value: SelectValue) : Promise<string> {
                
                return !value ? '' : value.toString();
            }
        }));

        this.email.linkToErrorKey('email');

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

        //=============
        //ACCESS RIGHTS
        //=============

        new Div('checkboxes-label', this.form).write('Access rights');

        for (let accessRight of await Api.get('/access-rights')) {

            const checkbox = new Checkbox({
                label: accessRight.name
            });

            this.accessRights.push({
                id: accessRight.id,
                checkbox: checkbox
            });

            this.form.add(checkbox);
        }

        this.populate();
    }

    /*
    **
    **
    */
    private async populate() : Promise<void> {
        
        try {

            let data: any = await Api.get('/user', {
                id: this.userId
            });

            this.email.input.setValue(data.email);

            if (data.ADMIN_RIGHTS) {
                
                for (let adminRightId of data.ADMIN_RIGHTS.split(',')) {
                    checkbox_loop:
                    for (let adminRight of this.adminRights) {
                        if (adminRight.id === parseInt(adminRightId)) {
                            adminRight.checkbox.setValue(true);
                            break checkbox_loop;
                        }
                    }
                }
            }

            if (data.ACCESS_RIGHTS) {
            
                for (let accessRightId of data.ACCESS_RIGHTS.split(',')) {
                    checkbox_loop:
                    for (let accessRight of this.accessRights) {
                        if (accessRight.id === parseInt(accessRightId)) {
                            accessRight.checkbox.setValue(true);
                            break checkbox_loop;
                        }
                    }
                }
            }

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

            await Api.post('/user/update', {
                id: this.userId,
                email: this.email.input.getValue(),
                adminRights: this.getCheckedAdminRights(),
                accessRights: this.getCheckedAccessRights()
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

    /*
    **
    **
    */
    private getCheckedAccessRights() : number[] {

        const output: number[] = [];

        for (let accessRight of this.accessRights) {
            if (accessRight.checkbox.getValue())
                output.push(accessRight.id);
        }

        return output;
    }
}