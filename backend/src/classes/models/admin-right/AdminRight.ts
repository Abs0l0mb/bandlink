'use strict';

import { MariaDBTableEntry } from '@src/classes';

export class AdminRight extends MariaDBTableEntry {

    constructor(public id: number | null, public data: any | null = null) {
        
        super('admin_rights', id, data);
    }
}