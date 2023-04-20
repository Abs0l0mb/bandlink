'use strict';

import { 
    MariaDB,
    MariaDBTableEntry,
    MariaDBQueryBinder,
    SQLServer,
    SQLServerQueryBinder
} from '@src/classes';

export class User extends MariaDBTableEntry {

    constructor(public id: number | null, public data: any | null = null) {
        
        super('users', id, data);
    }

    /*
    **
    **
    */
    public async getAdminRights() : Promise<string[]> {

        const binder = new MariaDBQueryBinder();

        const rows = await MariaDB.getRows(`
            SELECT DISTINCT(AdminRight.name)
            FROM admin_rights AdminRight
            JOIN user_has_admin_rights UserHasRight ON UserHasRight.admin_right_id = AdminRight.id
            WHERE UserHasRight.user_id = ${binder.addParam(this.id)}
        `, binder.getParams());

        let adminRights: any[] = [];

        for (let row of rows)
            adminRights.push(row.name);
        
        return adminRights;
    }

    /*
    **
    **
    */
    public async getData() : Promise<any[]> {

        const binder = new MariaDBQueryBinder();

        return await MariaDB.getRow(`
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
            ) ADMIN_RIGHT_NAMES,
            (
                SELECT GROUP_CONCAT(DISTINCT AdminRight.id SEPARATOR ',')
                FROM user_has_admin_rights UserHasRight
                JOIN admin_rights AdminRight ON AdminRight.id = UserHasRight.admin_right_id 
                WHERE UserHasRight.user_id = User_.id
            ) ADMIN_RIGHTS
            FROM users User_
            WHERE User_.id = ${binder.addParam(this.id)}
        `, binder.getParams());
    }

    /*
    **
    **
    */
    public async getSessions() : Promise<any[]> {

        const binder = new MariaDBQueryBinder();
        
        return await MariaDB.getRows(`
            SELECT 
            Session_.*
            FROM sessions Session_
            WHERE Session_.user_id = ${binder.addParam(this.id)}
        `, binder.getParams());
    }

    /*
    **
    **
    */
    public async resetAdminRights() : Promise<void> {

        const binder = new MariaDBQueryBinder();
        
        await MariaDB.exec(`
            DELETE FROM user_has_admin_rights WHERE user_id = ${binder.addParam(this.id)}
        `, binder.getParams());
    }
}