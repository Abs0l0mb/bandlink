'use strict';

import { 
    TitledPage,
    TabsView,
    MyDataTable,
    MySessionsTable
} from '@src/components';

export class MePage extends TitledPage {

    private tabsView: TabsView;

    constructor() {

        super('My account');

        this.tabsView = new TabsView([
            {
                text: 'Data',
                event: 'data'
            },
            {
                text: 'Sessions',
                event: 'sessions'
            }
        ], this.content);

        this.tabsView.on('data', () => {
            new MyDataTable(this.tabsView.view.empty());
        });

        this.tabsView.on('sessions', () => {
            new MySessionsTable(this.tabsView.view.empty());
        });
    }
}