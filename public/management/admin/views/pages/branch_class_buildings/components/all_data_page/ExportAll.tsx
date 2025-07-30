import React, { useState } from 'react';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import { RootState } from '../../../../../store';
import { useSelector } from 'react-redux';
import { CsvBuilder } from 'filefy';
import { anyObject } from '../../../../../common_types/object';
import ConfirmModal from '../../../../components/ConfirmModal';

export interface Props {}

const ExportAll: React.FC<Props> = (props: Props) => {
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
            'title',
            'code',
            'capacity',
            'image',
            'status',
        ];
        const rows: string[][] = [];

        const data = (state.all as any)?.data;

        if (data && Array.isArray(data)) {
            data.forEach((data: anyObject) => {
                const row: Array<string> = [];
                columns.forEach((key: string) => {
                    // Handle potential undefined or null values by converting them to empty strings
                    row.push(data[key] === null || data[key] === undefined ? '' : String(data[key]));
                });
                rows.push(row);
            });
        }

        new CsvBuilder(`${setup.module_name}_all.csv`)
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

    // Conditionally render the button only if there's data to export
    const data_to_export = (state.all as any)?.data;
    if (!data_to_export || data_to_export.length === 0) {
        return null; // Or some disabled state if preferred
    }

    return (
        <div>
            <a href="#" onClick={(e) => handle_export_click(e)}>
                <span className="material-symbols-outlined fill">download</span>
                <div className="text text-white">Export All</div>
            </a>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirm_export}
                message="Are you sure you want to export all records?"
                title="Confirm Export All"
            />
        </div>
    );
};

export default ExportAll;
