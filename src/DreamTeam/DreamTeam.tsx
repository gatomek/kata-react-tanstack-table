import {
    type Cell,
    type CellContext,
    type Column,
    type ColumnFiltersState,
    type ColumnHelper,
    type ColumnOrderState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type HeaderContext,
    type Row,
    type RowSelectionState,
    type Updater,
    useReactTable
} from '@tanstack/react-table'
import {type CSSProperties, useState} from "react";
import styles from './DreamTeam.module.css';
import {type Person} from "./types.ts";
import {noPersons, persons} from './data';

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

const columnHelper: ColumnHelper<Person> = createColumnHelper<Person>();

const handler = (person: Person): void => {
    alert(JSON.stringify(person));
}

const defaultColumns = [
    {
        id: 'select-col',
        cell: (props: CellContext<Person, unknown>) => (
            <input
                type={"checkbox"}
                checked={props.row.getIsSelected()}
                disabled={!props.row.getCanSelect()}
                onChange={props.row.getToggleSelectedHandler()}
            />
        ),
        size: 50,
        maxSize: 50,
        minSize: 50,
        enableHiding: false,
        enableResizing: false,
    },
    columnHelper.display(
        {
            id: 'actions',
            cell: (props) => <button className={styles.button}
                                     onClick={() => handler(props.row.original)}>{props.row.original.userId}</button>,
            size: 50,
            maxSize: 50,
            minSize: 50,
            enableResizing: false,
            enableHiding: false,
            enableColumnFilter: false,
            enableSorting: false,
        }
    ),
    columnHelper.accessor('userId',
        {
            header: () => <span>UserId</span>,
            cell: (props: CellContext<Person, string>) => props.row.original.userId,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            size: 75,
            enableSorting: false
        }
    ),
    columnHelper.accessor('name.first',
        {
            cell: (props: CellContext<Person, string>) => props.getValue(),
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor((row: Person) => row.name.last,
        {
            id: 'lastName',
            cell: (props: CellContext<Person, string>) => props.getValue().toUpperCase(),
            header: () => <span>Last Name</span>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor((row: Person) => `${row.name.last} ${row.name.first}`,
        {
            id: 'fullName',
            cell: (props: CellContext<Person, string>) => <i>{props.getValue()}</i>,
            header: () => <span>Full Name</span>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            size: 200,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor('age',
        {
            header: () => 'Age',
            cell: (props: CellContext<Person, number>) => props.renderValue(),
            footer: (props: HeaderContext<Person, number>) => props.column.id,
            size: 75,
            filterFn: 'inNumberRange'
        }
    ),
    columnHelper.accessor('visits',
        {
            header: () => <span>Visits</span>,
            footer: (props: HeaderContext<Person, number>) => props.column.id,
            size: 75,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor('job',
        {
            header: 'Stanowisko',
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor('room',
        {
            header: 'Pokój',
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString',
        }
    ),
    {
        accessorFn: (row: Person) => row.rating,
        header: 'Rating',
        filterFn: 'includesString' as const
    }
]

export function DreamTeam() {
    const [file] = useState<Person[]>((): Person[] => [...persons]);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [colFilterMode, setColFilterMode] = useState(false);
    const [colFilters, setColFilters] = useState<ColumnFiltersState>([]);

    const [globalFilterMode, setGlobalFilterMode] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable(
        {
            data: file ?? noPersons,
            columns: defaultColumns,
            enableRowSelection: true,
            enableMultiRowSelection: false,
            enableFilters: colFilterMode || globalFilterMode,
            getRowId: row => row.userId,
            enableColumnFilters: colFilterMode,
            enableGlobalFilter: globalFilterMode,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
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
                    left: ['select-col', 'actions', 'userId']
                }
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
        if (index == 0)
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

    console.log('rerender');

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
                                                cursor: 'pointer',
                                                zIndex: header.column.getIsPinned() ? 2 : 0, // header above body
                                            }}
                                        >
                                            {
                                                header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                            {
                                                header.column.getCanSort() ?
                                                    <span style={{minWidth: '30px', minHeight: '30px'}}>
                                                {
                                                    header.column.getIsSorted() ? (
                                                        header.column.getIsSorted() === 'desc' ? ' ▽' : ' △'
                                                    ) : ' ·'
                                                }
                                                </span> : undefined
                                            }
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
                            <tr key={row.id}
                                onClick={row.getToggleSelectedHandler()}
                            >
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
                            <div>Column order: <div>{table.getAllColumns().map(c => c.id).map(c => (
                                <div key={"a." + c}>
                                    <button className={styles.button} onClick={() => moveUp(c)}>⇧</button>
                                    <button className={styles.button} onClick={() => moveDown(c)}>⇩</button>
                                    &nbsp;{c}
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
                        <span>{
                            <div>
                                <input value={globalFilter ?? ''}
                                       disabled={!globalFilterMode}
                                       onChange={(e): void => {
                                           calcGlobalFilter(e.target.value);
                                       }}
                                       placeholder="Search..."
                                />
                            </div>
                        }
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}
