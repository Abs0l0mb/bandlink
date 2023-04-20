'use strict';

import { MariaDBTableEntry, User } from '@src/classes';

export class Session extends MariaDBTableEntry {

    private user: User | null = null;

    constructor(public id: number | null, public data: any | null = null) {
        
        super('sessions', id, data);
    }

    /*
    **
    **
    */
    public async getUser() : Promise<User | null> {

        if (!this.isLoaded())
            return null;

        if (this.user)
            return this.user;

        let user = new User(this.data.user_id);
        await user.load();
        
        this.user = user;

        return this.user;
    }
}