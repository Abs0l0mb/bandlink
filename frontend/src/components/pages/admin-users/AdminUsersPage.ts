'use strict';

import { 
    TitledPage,
    VerticalSplit,
    AdminUsersTable,
    AdminUserSessionsTable,
    TableRow
} from '@src/components';

export class AdminUsersPage extends TitledPage {

    private split: VerticalSplit;

    constructor() {

        super('Users administration');

        this.addTitleClass('admin');
        
        this.split = new VerticalSplit(this.content);

        new AdminUsersTable(this.split.topContainer)
            .on('select', (tableRow: TableRow) => {
                new AdminUserSessionsTable(tableRow.rowData, this.split.bottomContainer.empty());
            });
    }
}