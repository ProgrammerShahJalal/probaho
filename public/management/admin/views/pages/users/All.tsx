import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../store';
import { all } from './config/store/async_actions/all';
import setup from './config/setup';
import { initialState } from './config/store/inital_state';
import Header from './components/all_data_page/Header';
import TableFooter from './components/all_data_page/TableFooter';
import Paginate from '../../components/Paginate';
import Filter from './components/canvas/Filter';
import QuickView from './components/canvas/QuickView';
import storeSlice from './config/store';
import { anyObject } from '../../../common_types/object';
import TableRowAction from './components/all_data_page/TableRowAction';
import SelectItem from './components/all_data_page/SelectItem';
import SelectAll from './components/all_data_page/SelectIAll';
import TableHeading from './components/all_data_page/TableHeading';
import { useSearchParams } from 'react-router-dom';
import useUserRoles from '../../../hooks/useUserRoles';
import { truncateText, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';

export interface Props {}

const All: React.FC<Props> = () => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const { getRoleTitles } = useUserRoles(); 

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(storeSlice.actions.set_role('branch_admin'));


        dispatch(
            storeSlice.actions.set_select_fields(
                'id,uid,role_serial,name,email,gender,phone_number,photo,is_verified,is_blocked,is_approved,join_date,base_salary,status',
            ),
        );
        dispatch(all({}));
    }, [dispatch]); 

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    // Function to format role_serial for display
    function formatRoleSerial(value: any): string {
        try {
            // If value is a stringified array, parse it
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed.join(', ');
                } catch {
                    // fallback
                }
            }
            // If value is already an array, join with comma and space
            if (Array.isArray(value)) return value.join(', ');
            // If value is a single number, return as string
            if (typeof value === 'number') return value.toString();
            // If value is undefined/null, return empty string
            return '';
        } catch (error) {
            return '';
        }
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                {/* Changed title to be static */}
                <Header title={'All Users'} />

                <div className="content_body">
                    <div className="data_list">
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>
                                            <SelectAll />
                                        </th>
                                        <TableHeading
                                            label="ID"
                                            col_name="id"
                                            sort
                                        />
                                        <TableHeading
                                            label="User ID"
                                            col_name="uid"
                                            sort
                                        />
                                        <TableHeading
                                            label="Role Serial"
                                            col_name="role_serial"
                                            sort
                                        />
                                        <TableHeading
                                            label="Role"
                                            col_name="role_serial"
                                            sort
                                        />
                                        <TableHeading
                                            label="Photo"
                                            col_name="photo"
                                            sort
                                        />
                                        <TableHeading
                                            label="Name"
                                            col_name="name"
                                            sort
                                        />
                                        <TableHeading
                                            label="Email"
                                            col_name="email"
                                            sort
                                        />
                                        <TableHeading
                                            label="Status"
                                            col_name="status"
                                            sort
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {(state.all as any)?.data?.map(
                                        (i: { [key: string]: any }) => (
                                            <tr
                                                key={i.id}
                                                className={`table_rows table_row_${i.id}`}
                                            >
                                                <td>
                                                    <TableRowAction item={i} />
                                                </td>
                                                <td>
                                                    <SelectItem item={i} />
                                                </td>
                                                <td className="id-cell">{i.id}</td>
                                                <td className="id-cell">{i.uid || ''}</td>
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: formatRoleSerial(i.role_serial),
                                                        columnType: 'default'
                                                    })}
                                                />
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: getRoleTitles(i.role_serial),
                                                        columnType: 'title'
                                                    })}
                                                />
                                                <td>
                                                    <img
                                                        src={
                                                            i.photo
                                                                ? (i.photo.startsWith('http')
                                                                    ? i.photo
                                                                    : `/${i.photo}`)
                                                                : '/assets/dashboard/images/avatar.png'
                                                        }
                                                        alt=""
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                </td>
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.name,
                                                        columnType: 'name'
                                                    })}
                                                >
                                                    <span
                                                        className="quick_view_trigger"
                                                        onClick={() =>
                                                            quick_view(i)
                                                        }
                                                    >
                                                        {truncateText(i.name, 20)}
                                                    </span>
                                                </td>
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.email,
                                                        columnType: 'email'
                                                    })}
                                                />
                                                <td className="status-cell">{i.status}</td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Paginate
                            set_url={storeSlice.actions.set_url}
                            set_paginate={storeSlice.actions.set_paginate}
                            set_page={storeSlice.actions.set_page}
                            all={all}
                            data={state.all as any}
                            selected_paginate={state.paginate}
                        />
                    </div>
                </div>
                <TableFooter />
            </div>

            <Filter />
            <QuickView />
        </div>
    );
};

export default All;
