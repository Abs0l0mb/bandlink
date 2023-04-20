'use strict';

import {
    Table,
    Block,
    Api,
    TableRow,
    EditMyDataPopup
} from '@src/components';

export class MyDataTable extends Table {

    constructor(parent: Block) {

        super({
            rowOptions: [
                {
                    text: 'Edit',
                    event: 'edit'
                }
            ]
        }, parent);

        this.on('edit', (tableRow: TableRow) => {
            new EditMyDataPopup()
                .on('success', tableRow.update.bind(tableRow));
        });

        this.asyncPopulation();
    }
    
    /*
    **
    **
    */
    private async asyncPopulation() : Promise<void> {

        let rows: any[] = [];
        
        let data: any = await Api.get('/me');

        let columns = {
            'ID': Table.NUMBER,
            'Email': Table.STRING,
            'Access Rights': Table.STRING,
            'Create Time': Table.DATE,
            'Update Time': Table.DATE
        }

        rows.push({
            'ID': data.id,
            'Email': data.email,
            'Access Rights': data.ACCESS_RIGHT_NAMES ? data.ACCESS_RIGHT_NAMES.split(',').join(', ') : null,
            'Create Time': data.create_time ? new Date(data.create_time).toLocaleString('en-US') : null,
            'Update Time': data.update_time ? new Date(data.update_time).toLocaleString('en-US') : null
        });

        this.populate(columns, rows);
    }
}