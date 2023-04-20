'use strict';

import { 
    Block, 
    Div, 
    Tools, 
    Api,
    TableHeadCell, TableHeadCellSearchData, TableHeadCellSortData,
    TableRow,
    Button,
    SimpleSelect
} from '@src/components';

export interface TableRowOption {
    text: string;
    event: string;
}

export interface TableAction {
    text: string;
    event: string;
}

export interface TableConfiguration {
    selectable?: boolean;
    rowOptions?: TableRowOption[];
    title?: string;
    theme?: string;
    actions?: TableAction[];
    exportableAsXLSX?: boolean;
    filters?: any[];
    filtersValue?: string;
    hiddenColumns?: string[];
    extraData?: any[];
    extraDataColumnPrefix?: string;
}

export interface TableColumnsData {
    [key: string]: any;
}

export interface TableRowData {
    [key: string]: any;
}

export interface TableSearchData {
    [headCellKey: string]: {
        headCell: TableHeadCell,        
        data: TableHeadCellSearchData
    }
}

export interface TableSortData {
    headCell: TableHeadCell;
    data: TableHeadCellSortData;
}

export class Table extends Div {

    private title: Div;
    public table: Block;
    public columnsData: TableColumnsData;
    private headCells: TableHeadCell[] = [];
    private bodies: Block[] = [];
    public rows: TableRow[] = [];
    private rowsData: TableRowData[];
    private selectedRowsData: TableRowData[];
    private leftRowsData: TableRowData[] = [];
    private actionsContainer: Div;
    private downloadXLSXButton: Button;
    private filtersContainer: Div;
    private scrollCallback: (scrollBottom: number) => void = () => {};
    private lastScrollTop: number = 0;
    private lastScrollLeft: number = 0;
    private lastScrollLeftRatio: number = 0;
    private searchData: TableSearchData = {};
    private sortData: TableSortData;

    static readonly NUMBER = 1;
    static readonly STRING = 2;
    static readonly DATE = 3;
    static readonly PERCENT = 4;

    static readonly SORT_DISABLED = 0;
    static readonly SORT_ASCENDING = 1;
    static readonly SORT_DESCENDING = 2;
    
    constructor(public configuration: TableConfiguration, parent: Block) {

        super('table', parent);

        //===============
        //THEME ATTRIBUTE
        //===============

        if (this.configuration.theme)
            this.setData('theme', this.configuration.theme);

        //====================
        //SELECTABLE ATTRIBUTE
        //====================

        if (this.configuration.selectable)
            this.setData('selectable', this.configuration.selectable ? 1 : 0);

        //=====
        //TITLE
        //=====

        if (this.configuration.title) {
            this.title = new Div('title', this);
            new Block('span', {}, this.title).write(this.configuration.title);
        }

        //=====
        //TABLE
        //=====

        if (Array.isArray(this.configuration.filters))
            this.filtersContainer = new Div('filters-container', this);

        this.table = new Block('table', {
            cellpadding: 0,
            cellspacing: 0
        }, this);

        //=======
        //FILTERS
        //=======

        if (Array.isArray(this.configuration.filters)) {

            for (let data of this.configuration.filters) {

                console.log(data);
                
                const filter = new SimpleSelect({
                    label: data.label,
                    items: data.items,
                    value: data.value,
                    class: 'filter'
                }, this.filtersContainer);

                filter.on('value', async (value) => {
                    this.setData('populated', 0);
                    this.displayLoaderRow();
                    await Tools.sleep(250);
                    this.emit(data.event, value);
                });
            }
        }

        //==========
        //LOADER ROW
        //==========

        this.displayLoaderRow();

        //=======
        //ACTIONS
        //=======

        if (this.configuration.actions) {
            
            this.actionsContainer = new Div('actions-container', this);

            this.setData('has-actions', 1);

            for (let action of this.configuration.actions) {

                let button = new Button({
                    label: action.text
                }, this.actionsContainer).onNative('click', () => {
                    this.emit(action.event, button);
                });
            }
        }

        //====================
        //DOWNLOAD XLSX ACTION
        //====================

        if (this.configuration.exportableAsXLSX) {

            if (!this.actionsContainer)
                this.actionsContainer = new Div('actions-container', this);

            this.downloadXLSXButton = new Button({
                label: "Export"
            }, this.actionsContainer).onNative('click', this.downloadXLSX.bind(this));
        }

        //===============
        //SCROLL LISTENER
        //===============

        if (this.element.parentElement)
            this.element.parentElement.addEventListener('scroll', this.onScroll.bind(this));
    }

    /*
    **
    **
    */
    public async populate(columnsData: TableColumnsData, rowsData: TableRowData[]) : Promise<void> {

        this.table.empty();

        this.downloadXLSXButton?.setData('displayed', rowsData.length > 0 ? 1 : 0);

        //==========
        //IF NO ROWS
        //==========

        if (!rowsData || rowsData.length === 0) {
            this.displayNoDataRow();
            this.setData('populated', 1);
            return;
        }

        //=======
        //IF ROWS
        //=======

        this.columnsData = columnsData;
        this.rowsData = rowsData;

        //========
        //HEAD ROW
        //========

        let head = new Block('tr', {
            class: 'head-row'
        }, this.table);
        
        if (this.configuration.rowOptions)
            new Block('th', {
                class: 'options-head-cell'
            }, head);

        for (let column in columnsData) {
            
            if (this.configuration.hiddenColumns && this.configuration.hiddenColumns.includes(column))
                continue;

            let headCell = new TableHeadCell(column, head);

            headCell.on('search-data', (data: TableHeadCellSearchData) => {
                this.onHeadCellSearchData(headCell, data);
            });

            headCell.on('sort-data', (data: TableHeadCellSortData) => {
                this.onHeadCellSortData(headCell, data);
            });

            headCell.on('resize', this.restoreScrollLeft.bind(this));

            this.headCells.push(headCell);
        }

        await Tools.sleep(25);
        head.setData('displayed', 1);
        
        //====
        //ROWS
        //====

        this.displayRowsGradually(rowsData);

        //===============
        //POPULATION DONE
        //===============

        this.setData('populated', 1);
    }

    /*
    **
    **
    */
    private async displayRowsGradually(rowsData: TableRowData[]) : Promise<void> {

        for (let body of this.bodies)
            body.delete();

        this.scrollCallback = (scrollBottom: number) => {};
        
        if (this.element.parentElement)
            this.element.parentElement.scrollTop = 0;

        this.rows = [];
        this.leftRowsData = [...rowsData];

        this.displaySomeRows(false);

        this.scrollCallback = (scrollBottom: number) => {
            if (scrollBottom < 225)
                this.displaySomeRows(true);
        }
    }

    /*
    **
    **
    */
    private async displaySomeRows(scrollDisplay: boolean) : Promise<void> {

        const body = new Block('tbody', {}, this.table);
        
        let displayCount: number;

        if (scrollDisplay) {
            body.addClass('scroll-display');
            displayCount = Math.floor(window.innerHeight * 0.5 / TableRow.HEIGHT);
        }
        else
            displayCount = Math.floor(window.innerHeight * 1.25 / TableRow.HEIGHT);
        
        this.bodies.push(body);
        for (let i=0; i<displayCount; i++) {
            
            const rowData = this.leftRowsData.shift();
            
            if (!rowData)
                break;

            const row = new TableRow(rowData, this, body);

            row.on('update-rows-data', this.updateRowsData.bind(this));

            this.rows.push(row);
        }
        
        this.table.setData('display-fix', parseInt(this.table.getData('display-fix')) === 1 ? 0 : 1);
        
        await Tools.sleep(25);
        
        body.setData('displayed', 1);
    }

    /*
    **
    **
    */
    private displayNoDataRow() : void {

        let noDataRow = new Block('tr', 'no-data-row', this.table.empty());
        new Block('td', {}, noDataRow).write('No data to display');  
    }

    /*
    **
    **
    */
    private async displayLoaderRow() : Promise<void> {

        let loaderRow = new Block('tr', 'loader-row', this.table.empty());
        new Block('td', {}, loaderRow);
    }

    /*
    **
    **
    */
    private onHeadCellSearchData(headCell: TableHeadCell, data: TableHeadCellSearchData) : void {

        this.searchData[headCell.uid] = {
            headCell: headCell,
            data: data
        };

        this.computeSearchAndSort();
    }

    /*
    **
    **
    */
    private onHeadCellSortData(headCell: TableHeadCell, data: TableHeadCellSortData) : void {

        this.sortData = {
            headCell: headCell,
            data: data
        };

        for (let cell of this.headCells) {
            if (cell.uid !== headCell.uid)
                cell.resetSort();
        }

        this.computeSearchAndSort();
    }

    /*
    **
    **
    */
    private computeSearchAndSort() : void {

        let selectedRowsData: TableRowData[] = [];
        let rowsDataCopy: TableRowData[] = [...this.rowsData];
        
        //=========
        //SEARCHING
        //=========

        if (this.searchData) {
        
            rowsLoop:
            for (let rowData of rowsDataCopy) {

                headCellsLoop:
                for (let searchData of Object.values(this.searchData)) {

                    const {headCell, data} = searchData;

                    if (!headCell)
                        continue headCellsLoop;

                    if (rowData[headCell.column] === null || rowData[headCell.column] === undefined)
                        rowData[headCell.column] = 'null';

                    const columnType = this.columnsData[headCell.column];

                    if (columnType === Table.STRING || columnType === Table.DATE || columnType === Table.PERCENT) {
                        if (data.text.trim() === '' || rowData[headCell.column]?.toString().toLowerCase().search(new RegExp(data.text.toLowerCase(), 'g')) !== -1)
                            continue headCellsLoop;
                        else
                            continue rowsLoop;
                    }
                    else if (columnType === Table.NUMBER) {
                        if (data.text.trim() === '' || rowData[headCell.column].toString() === data.text)
                            continue headCellsLoop;
                        else
                            continue rowsLoop;
                    }
                    else
                        continue rowsLoop;
                }

                selectedRowsData.push(rowData);
            }
        }
        else 
            selectedRowsData = rowsDataCopy;

        //=======
        //SORTING
        //=======

        if (this.sortData) {
        
            if ([Table.SORT_ASCENDING, Table.SORT_DESCENDING].includes(this.sortData.data.sort))
                selectedRowsData = Table.sort(selectedRowsData, this.sortData.headCell.column, this.sortData.data.sort, this.getColumnType(this.sortData.headCell));
        }

        //==========
        //COMMITTING
        //==========

        this.selectedRowsData = selectedRowsData;

        this.displayRowsGradually(selectedRowsData);
    }

    /*
    **
    **
    */
    private getColumnType(headCell: TableHeadCell) : number {

        for (let column in this.columnsData) {
            if (headCell.column === column)
                return this.columnsData[column];
        }

        return 0;
    }

    /*
    **
    **
    */
    public async downloadXLSX() : Promise<void> {

        this.downloadXLSXButton.load();

        await Tools.sleep(100);

        let data: string[] = [];

        let head: string[] = [];
        
        if (this.configuration.extraData) {
            let prefix = this.configuration.extraDataColumnPrefix ? this.configuration.extraDataColumnPrefix + ' ' : '';
            for (let column of Object.keys(this.configuration.extraData))
                head.push(prefix + column);
        }

        for (let column of Object.keys(this.rowsData[0]))
            head.push(column);
        
        data.push(head.join(';'));
        
        for (let rowData of this.rowsData) {
            
            let row: string[] = [];

            if (this.configuration.extraData) {
                for (let extraValue of Object.values(this.configuration.extraData))
                    row.push(extraValue);
            }
            
            for (let value of Object.values(rowData))
                row.push(value);

            data.push(row.join(';'));
        }

        let csvString = data.join('\r\n');

        let base64 = await Api.post('/convert-csv', {
            csv: csvString
        });

        let blob = Tools.base64ToBlob(base64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        let a = document.createElement("a");

        a.href = URL.createObjectURL(blob);

        a.download = "wft-export.xlsx";
        document.body.appendChild(a);
        a.click(); 
        document.body.removeChild(a);

        this.downloadXLSXButton.unload();
    }

    /*
    **
    **
    */
    static sort(input: TableRowData[], column: string, sort: number, columnType: number) : TableRowData[] {

        switch(columnType) {

            case Table.NUMBER:
                return Table.numberSort(input, column, sort);
                break;

            case Table.STRING:
                return Table.stringSort(input, column, sort);
                break;

            case Table.DATE:
                return Table.dateSort(input, column, sort);
                break;

            case Table.PERCENT:
                return Table.percentSort(input, column, sort);
        }

        return input;
    }

    /*
    **
    **
    */
    static numberSort(input: TableRowData[], column: string, sort: number) : TableRowData[] {

        return input.sort((a, b) => {
            if (sort === Table.SORT_ASCENDING)
                return a[column] - b[column];
            else
                return b[column] - a[column];
        });
    }

    /*
    **
    **
    */
    static stringSort(input: TableRowData[], column: string, sort: number) : TableRowData[] {
        
        return input.sort((a, b) => {
            if (!a[column]) a[column] = 'null';
            if (!b[column]) b[column] = 'null';
            if (sort === Table.SORT_ASCENDING)
                return a[column].toString().localeCompare(b[column]);
            else
                return b[column].toString().localeCompare(a[column]);
        });
    }

    /*
    **
    **
    */
    static dateSort(input: TableRowData[], column: string, sort: number) : TableRowData[] {

        return input.sort((a, b) => {
            if (sort === Table.SORT_ASCENDING)
                return new Date(a[column]).getTime() - new Date(b[column]).getTime();
            else
                return new Date(b[column]).getTime() - new Date(a[column]).getTime();
        });
    }

    /*
    **
    **
    */
    static percentSort(input: TableRowData[], column: string, sort: number) : TableRowData[] {

        return input.sort((a, b) => {
            if (sort === Table.SORT_ASCENDING)
                return parseFloat(a[column]) - parseFloat(b[column]);
            else
                return parseFloat(b[column]) - parseFloat(a[column]);
        });
    }

    /*
    **
    **
    */
    private onScroll(event: UIEvent) : void {

        if (!this.element.parentElement)
            return; 

        if (this.element.parentElement.scrollTop !== this.lastScrollTop)
            this.onScrollY(event);
        
        if (this.element.parentElement.scrollLeft !== this.lastScrollLeft)
            this.onScrollX(event);
        
        this.lastScrollTop = this.element.parentElement.scrollTop;
        this.lastScrollLeft = this.element.parentElement.scrollLeft;
    }

    /*
    **
    **
    */
    private onScrollY(event: UIEvent) : void {

        if (!this.element.parentElement)
            return; 

        const scrollBottom = this.element.parentElement.scrollHeight 
         - this.element.parentElement.clientHeight
         - this.element.parentElement.scrollTop;

        this.scrollCallback(scrollBottom);
    }

    /*
    **
    **
    */
    private onScrollX(event: UIEvent) : void {

        if (!this.element.parentElement)
            return; 

        this.lastScrollLeftRatio = this.element.parentElement.scrollLeft * 100 / (this.element.parentElement.scrollWidth - this.element.parentElement.clientWidth);
    }

    /*
    **
    **
    */
    private restoreScrollLeft() : void {

        if (!this.element.parentElement)
            return; 

        this.element.parentElement.scrollLeft = (this.element.parentElement.scrollWidth - this.element.parentElement.clientWidth) * this.lastScrollLeftRatio / 100;
    }

    /*
    **
    **
    */
    private updateRowsData() : void {

        let rowsData: any[] = [];

        for (let row of this.rows) {
            
            let rowData: any = {};
            
            for (let key in row.cells)
                rowData[key] = row.cells[key].value;
            
            rowsData.push(rowData);
        }

        this.rowsData = rowsData;
    }
}