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
        const columns = ['id', 'event_title', 'session_title', 'title', 'description', 'mark', 'pass_mark', 'start', 'end'];
        const rows: string[][] = [];

        state.selected.forEach((data: anyObject) => {
            const row: Array<string> = [];
            row.push(data.id || '');
            row.push(data.event?.title || '');
            row.push(data.session?.title || '');
            row.push(data.title || '');
            row.push(data.description || '');
            row.push(data.mark || '');
            row.push(data.pass_mark || '');
            row.push(data.start || '');
            row.push(data.end || '');
            rows.push(row);
        });

        new CsvBuilder(`${setup.module_name}.csv`)
            .setColumns(['ID', 'Event Title', 'Session Title', 'Title', 'Description', 'Mark', 'Pass Mark', 'Start', 'End'])
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
