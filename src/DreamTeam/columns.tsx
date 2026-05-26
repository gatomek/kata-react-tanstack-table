import {type CellContext, type ColumnHelper, createColumnHelper, type HeaderContext,} from '@tanstack/react-table'
import type {Person} from "./types.ts";
import styles from './DreamTeam.module.css';
import {TableCell} from "./TableCell.tsx";

const columnHelper: ColumnHelper<Person> = createColumnHelper<Person>();

const handler = (person: Person): void => {
    alert(JSON.stringify(person));
}

export const columns = [
    {
        id: 'counter',
        header: () => <TableCell type="header" align={"center"}>#</TableCell>,
        cell: (props: CellContext<Person, unknown>) => {
            const {pageIndex, pageSize} = props.table.getState().pagination;
            const rows = props.table.getRowModel().rows;
            return (
                <TableCell align={"center"}>
                    {
                        pageIndex * pageSize + rows.findIndex(r => r.id === props.row.id) + 1
                    }
                </TableCell>)
        },
        size: 50,
        maxSize: 50,
        minSize: 50,
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        enableResizing: false,
    },
    {
        id: 'select-col',
        header: () => <TableCell type="header">&nbsp;</TableCell>,
        cell: (props: CellContext<Person, unknown>) => (
            <TableCell align={"center"}>
                <input
                    type={"checkbox"}
                    checked={props.row.getIsSelected()}
                    disabled={!props.row.getCanSelect()}
                    onChange={props.row.getToggleSelectedHandler()}
                />
            </TableCell>
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
            header: () => <TableCell type="header">&nbsp;</TableCell>,
            cell: (props) =>
                <TableCell align={"center"}>
                    <button className={styles.button}
                            onClick={() => handler(props.row.original)}>{props.row.original.userId}</button>

                </TableCell>,
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
            header: () => <TableCell type={"header"}>Id</TableCell>,
            cell: (props: CellContext<Person, string>) =>
                <TableCell align={"center"}>
                    {
                        props.row.original.userId
                    }
                </TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            size: 75,
            enableSorting: false
        }
    ),
    columnHelper.accessor('name.first',
        {
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Name</TableCell>,
            cell: (props: CellContext<Person, string>) => <TableCell>{props.getValue()}</TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor((row: Person) => row.name.last,
        {
            id: 'lastName',
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Last Name</TableCell>,
            cell: (props: CellContext<Person, string>) => <TableCell>{props.getValue().toUpperCase()}</TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor((row: Person) => `${row.name.last} ${row.name.first}`,
        {
            id: 'fullName',
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Full Name</TableCell>,
            cell: (props: CellContext<Person, string>) => <TableCell>{props.getValue()}</TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            size: 200,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor('age',
        {
            header: (props: HeaderContext<Person, number>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Age</TableCell>,
            cell: (props: CellContext<Person, number>) =>
                <TableCell align={"end"}>
                    {
                        props.renderValue()
                    }
                </TableCell>,
            footer: (props: HeaderContext<Person, number>) => props.column.id,
            size: 75,
            filterFn: 'equals'
        }
    ),
    columnHelper.accessor('visits',
        {
            header: (props: HeaderContext<Person, number>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Visits</TableCell>,
            footer: (props: HeaderContext<Person, number>) => props.column.id,
            cell: (props: CellContext<Person, number>) =>
                <TableCell align={"end"}>
                    {
                        props.renderValue()
                    }
                </TableCell>,
            size: 75,
            filterFn: 'equals'
        }
    ),
    columnHelper.accessor('job',
        {
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Job</TableCell>,
            cell: (props: CellContext<Person, string>) =>
                <TableCell>
                    {
                        props.renderValue()
                    }
                </TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString'
        }
    ),
    columnHelper.accessor('room',
        {
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Room</TableCell>,
            cell: (props: CellContext<Person, string>) =>
                <TableCell align={"center"}>
                    {
                        props.renderValue()
                    }
                </TableCell>,
            footer: (props: HeaderContext<Person, string>) => props.column.id,
            filterFn: 'includesString',
        }
    ),
    columnHelper.accessor((row: Person) => row.rating ?? '', {
            id: 'rating',
            header: (props: HeaderContext<Person, string>) =>
                <TableCell type={"header"} showSorting={true} sortDirection={props.column.getIsSorted()}
                           onClick={props.column.getToggleSortingHandler()}>Rating</TableCell>,
            cell: (props: CellContext<Person, string>) =>
                <TableCell align={"center"}>
                    {
                        props.renderValue()
                    }
                </TableCell>,
            filterFn: 'includesString' as const,
            size: 100,
        }
    )
]