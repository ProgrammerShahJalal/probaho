import React from 'react';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import { RootState } from '../../../../../store';
import { useSelector } from 'react-redux';
import { CsvBuilder } from 'filefy';
import { anyObject } from '../../../../../common_types/object';

export interface Props {}

const ExportSelected: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    function handle_export(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        const columns = ['id', 'event_enrollment_id', 'event_payment_id', 'event_title', 'user_name', 'date', 'amount', 'trx_id', 'media', 'is_refunded', 'status'];
        const rows: string[][] = [];

        state.selected.forEach((data: anyObject) => {
            const row: Array<string> = [];
            row.push(data.id || '');
            row.push(data.event_enrollment_id || '');
            row.push(data.event_payment_id || '');
            row.push(data.event?.title || '');
            row.push(`${data.user?.first_name || ''} ${data.user?.last_name || ''}`.trim());
            row.push(data.date || '');
            row.push(data.amount || '');
            row.push(data.trx_id || '');
            row.push(data.media || '');
            row.push(data.is_refunded || '');
            row.push(data.status || '');
            rows.push(row);
        });

        new CsvBuilder(`${setup.module_name}.csv`)
            .setColumns(['ID', 'Event Enrollment ID', 'Event Payment ID', 'Event Title', 'User Name', 'Date', 'Amount', 'Trx ID', 'Media', 'Is Refunded', 'Status'])
            .addRows(rows)
            .exportFile();
    }

    if (state.selected.length <= 0) {
        return <></>;
    }

    return (
        <>
            <a href="#" onClick={(e) => handle_export(e)}>
                <span className="material-symbols-outlined fill">download</span>
                <div className="text">Export ({state.selected.length})</div>
            </a>
        </>
    );
};

export default ExportSelected;
