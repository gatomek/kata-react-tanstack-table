import type {SortDirection} from "@tanstack/react-table";

interface SortMarkerProps {
    direction: false | SortDirection;
}

export function SortMarker(props: Readonly<SortMarkerProps>) {
    if (props.direction === 'asc') {
        return <span>⬆</span>
    }

    if (props.direction === 'desc') {
        return <span>⬇︎</span>
    }

    return (
        <span>⫶</span>
    )
}
