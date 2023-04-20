'use strict';

import {
    Page,
    LoginPopup
} from '@src/components';

export class LoginPage extends Page {
    
    constructor() {

        super('Login');

        new LoginPopup();
    }
}