import React, { useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
export interface Props {
    children: React.ReactNode;
    item: anyObject;
}
const TableRow: React.FC<Props> = (props: Props) => {
    const tr = useRef(null);
    function active_row() {
        if (tr && tr.current) {
            const table_rows = document.querySelectorAll('.table_rows');
            if (table_rows.length) {
                [...table_rows].forEach((i) => i.classList.remove('active'));
            }
            (tr.current as HTMLElement).classList.add('active');
        }
    }
    return (
        <tr
            className="table_rows"
            key={props.item.id}
            ref={tr}
            onClick={active_row}
        >
            {props.children}
        </tr>
    );
};

export default TableRow;
