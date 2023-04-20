'use strict';

import { MariaDBTable } from '@src/classes';

export class AdminRights extends MariaDBTable {

    public static USERS = 'USERS';
    public static ACCESS_RIGHTS = 'ACCESS RIGHTS';
    public static REPORTS = 'REPORTS';
    public static REPORT_LOGS = 'REPORT LOGS';
    public static PAGES = 'PAGES'; 
    public static HTML_CONTENTS = 'HTML CONTENTS'; 
    
    constructor() {
        
        super('admin_rights');
    }
}