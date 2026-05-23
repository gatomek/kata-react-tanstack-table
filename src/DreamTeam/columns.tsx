import {type CellContext, type ColumnHelper, createColumnHelper, type HeaderContext,} from '@tanstack/react-table'
import type {Person} from "./types.ts";
import styles from './DreamTeam.module.css';

const columnHelper: ColumnHelper<Person> = createColumnHelper<Person>();

const handler = (person: Person): void => {
    alert(JSON.stringify(person));
}

export const columns = [
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