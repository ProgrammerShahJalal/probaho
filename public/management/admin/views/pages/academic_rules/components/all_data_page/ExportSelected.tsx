import React, { useState } from 'react';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import { RootState } from '../../../../../store';
import { useSelector } from 'react-redux';
import { CsvBuilder } from 'filefy';
import { anyObject } from '../../../../../common_types/object';
import ConfirmModal from '../../../../components/ConfirmModal';

export interface Props {}

const ExportSelected: React.FC<Props> = (props: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const confirm_export = () => {
        const columns = [
            'id',
            'branch_user_id',
            'branch_id',
            'academic_year_id',
            'academic_rules_types_id',
            'title',
            'description',
            'date',
            'file', // optional
            'status',
        ];
        const rows: string[][] = [];

        state.selected.forEach((data: anyObject) => {
            const row: Array<string> = [];
            columns.forEach((key: string) => {
                // Handle potential undefined or null values by converting them to empty strings
                row.push(data[key] === null || data[key] === undefined ? '' : String(data[key]));
            });
            rows.push(row);
        });

        new CsvBuilder(`${setup.module_name}_selected.csv`)
            .setColumns(columns)
            .addRows(rows)
            .exportFile();
        setIsModalOpen(false); // Close modal after export
    };

    function handle_export_click(
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) {
        e.preventDefault();
        setIsModalOpen(true);
    }

    if (state.selected.length <= 0) {
        return <></>;
    }

    return (
        <>
            <a href="#" onClick={(e) => handle_export_click(e)}>
                <span className="material-symbols-outlined fill">download</span>
                <div className="text text-white">Export ({state.selected.length})</div>
            </a>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirm_export}
                message={`Are you sure you want to export ${state.selected.length} selected records?`}
                title="Confirm Export Selected"
            />
        </>
    );
};

export default ExportSelected;
