'use strict';

import { MariaDB, MariaDBTable, SQLServer, SQLServerQueryBinder } from '@src/classes';

export class Users extends MariaDBTable {

    static readonly USER_HAS_ADMIN_RIGHTS_TABLE: string = 'user_has_admin_rights';

    constructor() {
        
        super('users');
    }

    /*
    **
    **
    */
    public async getList() : Promise<any[]> {

        return await MariaDB.getRows(`
            SELECT 
            User_.id,
            User_.email,
            User_.create_time,
            User_.update_time,
            (
                SELECT GROUP_CONCAT(DISTINCT AdminRight.name SEPARATOR ',')
                FROM user_has_admin_rights UserHasRight
                JOIN admin_rights AdminRight ON AdminRight.id = UserHasRight.admin_right_id 
                WHERE UserHasRight.user_id = User_.id
            ) ADMIN_RIGHT_NAMES
            FROM users User_
            ORDER BY User_.id DESC
        `);
    }
}