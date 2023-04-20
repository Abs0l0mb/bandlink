'use strict';

import {
    Table, 
    Block, 
    Api,
    TableRow,
    DeleteSessionPopup
} from '@src/components';

export class AdminUserSessionsTable extends Table {

    constructor(private userData: any, parent: Block) {

        super({
            title: 'Sessions',
            rowOptions: [
                {
                    text: 'Delete',
                    event: 'delete'
                }
            ]
        }, parent);

        this.on('delete', (tableRow: TableRow) => {
            new DeleteSessionPopup(tableRow.rowData.ID)
                .on('done', tableRow.delete.bind(tableRow));
        });

        this.asyncPopulation();
    }
    
    /*
    **
    **
    */
    private async asyncPopulation() : Promise<void> {

        let rows: any[] = [];
        
        let entries: any[] = await Api.get('/user/sessions', {
            id: this.userData.ID
        });

        let columns = {
            'ID': Table.NUMBER,
            'Create Time': Table.DATE,
            'Update Time': Table.DATE,
            'Last Activity': Table.STRING,
            'Last IP': Table.STRING,
            'Browser Name': Table.STRING,
            'Browser Version': Table.STRING,
            'OS Name': Table.STRING,
            'OS Version': Table.STRING,
            'Device Type': Table.STRING
        }

        for (let entry of entries) {
            
            rows.push({
                'ID': entry.id,
                'Create Time': entry.create_time ? new Date(entry.create_time).toLocaleString('en-US') : null,
                'Update Time': entry.update_time ? new Date(entry.update_time).toLocaleString('en-US') : null,
                'Last Activity': entry.last_activity,
                'Last IP': entry.last_ip,
                'Browser Name': entry.browser_name,
                'Browser Version': entry.browser_version,
                'OS Name': entry.os_name,
                'OS Version': entry.os_version,
                'Device Type': entry.device_type
            });
        }

        this.populate(columns, rows);
    }
}