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
        const columns = ['id', 'user_name', 'blog_title', 'comment'];
        const rows: string[][] = [];

        state.selected.forEach((data: anyObject) => {
            const row: Array<string> = [];
            row.push(data.id || '');
            row.push(`${data.user?.first_name || ''} ${data.user?.last_name || ''}`.trim());
            row.push(data.blog?.title || '');
            row.push(data.comment || '');
            rows.push(row);
        });

        new CsvBuilder(`${setup.module_name}.csv`)
            .setColumns(['ID', 'User Name', 'Blog Title', 'Comment'])
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
