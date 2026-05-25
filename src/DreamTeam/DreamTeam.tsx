import {
    type Cell,
    type Column,
    type ColumnFiltersState,
    type ColumnOrderState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, 
    getPaginationRowModel,
    getSortedRowModel,
    type Row,
    type RowSelectionState,
    type Updater,
    useReactTable
} from '@tanstack/react-table'
import {type CSSProperties, useState} from "react";
import styles from './DreamTeam.module.css';
import {type Person} from "./types.ts";
import {persons} from './data';
import {columns} from "./columns.tsx";
import {SortMarker} from "./SortMarker.tsx";

const getPinningStyles = (column: Column<Person, unknown>): CSSProperties => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinned =
        isPinned === 'left' && column.getIsLastColumn('left')
    return {
        position: isPinned ? 'sticky' : 'relative',
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        background: isPinned ? 'white' : undefined,
        boxShadow: isLastLeftPinned ? '0px 0 4px -2px gray' : undefined,
    }
}

export function DreamTeam() {
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [colFilterMode, setColFilterMode] = useState(false);
    const [colFilters, setColFilters] = useState<ColumnFiltersState>([]);

    const [globalFilterMode, setGlobalFilterMode] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable(
        {
            data: persons,
            columns: columns,
            enableRowSelection: true,
            enableMultiRowSelection: false,
            enableFilters: colFilterMode || globalFilterMode,
            getRowId: row => row.userId,
            enableColumnFilters: colFilterMode,
            enableGlobalFilter: globalFilterMode,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            initialState: {
                columnVisibility: {
                    userId: true,
                },
                sorting: [
                    {
                        id: 'age',
                        desc: false
                    }
                ],
                columnPinning: {
                    left: ['counter', 'select-col', 'actions', 'userId']
                },
            },
            state: {
                columnOrder: columnOrder,
                columnFilters: colFilterMode ? colFilters : undefined,
                globalFilter: globalFilterMode ? globalFilter : undefined,
                rowSelection,
            },
            defaultColumn: {
                size: 150,
                minSize: 50,
                maxSize: 500
            },
            onColumnOrderChange: (cs: Updater<ColumnOrderState>) => setColumnOrder(cs),
            onRowSelectionChange: setRowSelection,
        }
    );

    const moveUp = (columnId: string) => {
        const columnIds = table.getState().columnOrder.length > 0 ?
            table.getState().columnOrder
            :
            table.getAllColumns().map(c => c.id);
        const index: number = columnIds.indexOf(columnId);
        if (index === 0)
            return;

        const switchIndex = index - 1;
        const switchColumnId = columnIds[switchIndex];

        const v = columnIds
            .toSpliced(switchIndex, 1, columnId)
            .toSpliced(index, 1, switchColumnId);
        setColumnOrder(v);
    }

    const moveDown = (columnId: string) => {
        const columnIds = table.getState().columnOrder.length > 0 ? table.getState().columnOrder : table.getAllColumns().map(c => c.id);
        const index: number = columnIds.indexOf(columnId);
        if (index == columnIds.length - 1)
            return;

        const switchIndex = index + 1;
        const switchColumnId = columnIds[switchIndex];

        const v = columnIds
            .toSpliced(switchIndex, 1, columnId)
            .toSpliced(index, 1, switchColumnId);
        setColumnOrder(v);
    }

    const calcColumnFilter = (columnId: string, value: string) => {
        const filters: ColumnFiltersState = [...colFilters.filter(f => f.id !== columnId), {id: columnId, value}];
        setColFilters(filters);
    }

    const calcGlobalFilter = (value: string) => {
        setGlobalFilter(value);
    }

    return (
        <div className={styles.root}>
            <div className={styles.tableWrapper}>

                <table className={styles.table}>
                    <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{
                                                ...getPinningStyles(header.column),
                                                cursor: header.column.getCanSort() ? 'pointer' : 'inherit',
                                                zIndex: header.column.getIsPinned() ? 2 : 0,
                                            }}
                                        >
                                            {

                                                header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                            <span style={{minWidth: '30px', minHeight: '30px'}}> {
                                                header.column.getCanSort() ?
                                                    <SortMarker direction={header.column.getIsSorted()}/>
                                                    :
                                                    undefined
                                            }
                                            </span>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                    </thead>
                    <tbody>
                    {
                        table.getRowModel().rows.map((row: Row<Person>) =>
                            <tr key={row.id}>
                                {
                                    row.getVisibleCells().map((cell: Cell<Person, unknown>) =>
                                        <td key={cell.id}
                                            style={{
                                                ...getPinningStyles(cell.column),
                                                backgroundColor: row.getIsSelected() ? 'bisque' : 'white'
                                            }}
                                        >{
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        }
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>

            <div className={styles.panel}>
                <div>
                    <button
                        className={styles.button}
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label='Go to first page'
                    >
                        {'<<'}
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label='Go to previous page'
                    >
                        {'<'}
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label='Go to next page'
                    >
                        {'>'}
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label='Go to last page'
                    >
                        {'>>'}
                    </button>
                    <select
                        aria-label='Select page size'
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.panel}>
                <div>
                    <div className={styles.autoMargin}>
                        <div>
                            <div><span>{table.getIsAllRowsSelected() ? '✅' : '⬜'}</span>is all rows selected ?</div>
                            <div><span>{table.getIsSomeRowsSelected() ? '✅' : '⬜'}</span>is some rows selected ?</div>
                            <div><span>{table.getIsAllColumnsVisible() ? '✅' : '⬜'}</span>is all column visible ?</div>
                            <div><span>{table.getIsAllRowsExpanded() ? '✅' : '⬜'}</span>is all rows expanded ?</div>
                            <div><span>{table.getIsSomeColumnsPinned() ? '✅' : '⬜'}</span>is all some columns pinned ?
                            </div>
                            <div><span>{table.getIsSomeColumnsVisible() ? '✅' : '⬜'}</span>is some columns visible ?
                            </div>
                            <div><span>{table.getCanNextPage() ? '✅' : '⬜'}</span>can next page</div>
                            <div><span>{table.getCanPreviousPage() ? '✅' : '⬜'}</span>can previous page</div>
                            <div><span>{table.getPageCount()}</span> - page count</div>
                            <div><span>{table.getLeftTotalSize()}</span> - left total size</div>
                            <div><span>{table.getRightTotalSize()}</span> - right total size</div>
                            <div><span>{table.getSelectedRowModel().rows.length}</span> - selected rows</div>
                        </div>
                    </div>
                    <div className={styles.autoMargin}>
                        <div>
                            <div>Column order: <div>{table.getAllColumns().map(c => (
                                <div key={c.id}>
                                    <button className={styles.button} onClick={() => moveUp(c.id)}>⇧</button>
                                    <button className={styles.button} onClick={() => moveDown(c.id)}>⇩</button>
                                    &nbsp;{c.id}
                                </div>
                            ))
                            }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.autoMargin}>
                    <div>
                        <div>
                            <pre>{JSON.stringify(table.getState(), null, '  ')}</pre>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.autoMargin}>
                        <span>Widoczność kolumn</span>
                        <span>{
                            table.getAllColumns().map((column) => (
                                <span key={column.id}>
                                    <br/>
                                    <label key={column.id}>
                                        <input
                                            checked={column.getIsVisible()}
                                            disabled={!column.getCanHide()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            type="checkbox"
                                        />&nbsp;
                                        {column.id}
                                    </label>
                                </span>
                            ))}
                        </span>
                    </div>
                    <div className={styles.autoMargin}>
                        <span>Filtracja kolumn</span>
                        &nbsp;
                        <input
                            checked={colFilterMode}
                            onChange={() => {
                                setColFilterMode(colFilterMode => !colFilterMode);
                            }}
                            type="checkbox"
                        />
                        <span>{
                            table.getAllColumns().map((column) => (
                                <span key={column.id}>
                                    <br/>
                                    <label key={column.id}>
                                        <input
                                            disabled={!column.getCanFilter()}
                                            value={String(colFilters.find((f) => f.id === column.id)?.value ?? '')}
                                            onChange={(e): void => {
                                                calcColumnFilter(column.id, e.target.value);
                                            }}/> {column.id}
                                    </label>
                                </span>
                            ))}
                        </span>
                    </div>
                    <div className={styles.autoMargin}>
                        <span>Filtracja tabeli</span>
                        &nbsp;
                        <input
                            checked={globalFilterMode}
                            onChange={(): void => {
                                const targetMode = !globalFilterMode;
                                if (!targetMode) {
                                    setGlobalFilter(null);
                                }
                                setGlobalFilterMode(targetMode);
                            }}
                            type="checkbox"
                        />
                        <div>{
                            <span>
                                <input value={globalFilter ?? ''}
                                       disabled={!globalFilterMode}
                                       onChange={(e): void => {
                                           calcGlobalFilter(e.target.value);
                                       }}
                                       placeholder="Search..."
                                />
                            </span>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
