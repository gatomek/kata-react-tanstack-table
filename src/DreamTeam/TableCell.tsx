import styles from './TableCell.module.css';
import type {ReactNode, SyntheticEvent} from "react";
import {SortMarker} from "./SortMarker.tsx";

interface TableCellProps {
    children: ReactNode;
    align?: 'start' | 'center' | 'end';
    type?: 'header' | 'cell';
    showSorting?: boolean;
    sortDirection?: 'asc' | 'desc' | false;
    onClick?: (evt:SyntheticEvent) => void;
    isPinned?: boolean;
}

export function TableCell(
    {
        children,
        align = 'start',
        type = 'cell',
        showSorting = false,
        sortDirection = false,
        onClick,
        isPinned = false,
    }: Readonly<TableCellProps>) {
    const cn0 = styles.tableCell;
    const cn1 = align === 'center' ? styles.center : (align === 'end' ? styles.end : styles.start);
    const cn2 = type === 'header' ? styles.header : undefined;
    const cn3 = isPinned ? styles.pinned : undefined;
    const cn = [cn0, cn1, cn2, cn3].filter(Boolean).join(' ');
    return (
        <div className={cn}
            onClick={onClick}
        >
            {
                children
            }
            {
                type === 'header' && showSorting && <SortMarker direction={sortDirection === 'asc' ? 'asc' : (sortDirection === 'desc' ? 'desc' : false)}/>
            }
        </div>
    );
}
