'use strict';

import {
    Table, 
    Block, 
    Api,
    TableRow,
    AddUserPopup,
    EditUserPopup,
    DeleteUserPopup,
    Button
} from '@src/components';

export class AdminUsersTable extends Table {

    constructor(parent: Block) {

        super({
            title: 'Users',
            selectable: true,
            rowOptions: [
                {
                    text: 'Edit',
                    event: 'edit'
                },
                {
                    text: 'Delete',
                    event: 'delete'
                }
            ],
            actions: [
                {
                    text: 'Add user',
                    event: 'add'
                }
            ],
        }, parent);

        this.on('edit', (tableRow: TableRow) => {
            new EditUserPopup(tableRow.rowData.ID)
                .on('success', this.asyncPopulation.bind(this));
        });

        this.on('delete', (tableRow: TableRow) => {
            new DeleteUserPopup(tableRow.rowData.ID)
                .on('done', tableRow.delete.bind(tableRow));
        });

        this.on('add', (button: Button) => {
            button.load();
            let popup = new AddUserPopup();
            popup.on('success', this.asyncPopulation.bind(this));
            popup.on('hide', () => {
                button.unload();
            });
        });

        this.asyncPopulation();
    }
    
    /*
    **
    **
    */
    private async asyncPopulation() : Promise<void> {

        let rows: any[] = [];
        
        let entries: any[] = await Api.get('/users');

        let columns = {
            'ID': Table.NUMBER,
            'Email': Table.STRING,
            'Department': Table.STRING,
            'Admin Rights': Table.STRING,
            'Access Rights': Table.STRING,
            'Create Time': Table.DATE,
            'Update Time': Table.DATE
        }

        for (let entry of entries) {
            
            rows.push({
                'ID': entry.id,
                'Email': entry.email,
                'Department': entry.department,
                'Admin Rights': entry.ADMIN_RIGHT_NAMES ? entry.ADMIN_RIGHT_NAMES.split(',').join(', ') : null,
                'Access Rights': entry.ACCESS_RIGHT_NAMES ? entry.ACCESS_RIGHT_NAMES.split(',').join(', ') : null,
                'Create Time': entry.create_time ? new Date(entry.create_time).toLocaleString('en-US') : null,
                'Update Time': entry.update_time ? new Date(entry.update_time).toLocaleString('en-US') : null
            });
        }

        this.populate(columns, rows);
    }
}