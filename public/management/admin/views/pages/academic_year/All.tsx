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

export interface Props { }

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
                'id,title,start_month,end_month,is_locked,status',
            ),
        );
        dispatch(all({}));
    }, [dispatch]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                {/* Changed title to be static */}
                <Header title={'All Academic Year'} />

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
                                            label="Title"
                                            col_name="title"
                                            sort
                                        />
                                        <TableHeading
                                            label="Start Month"
                                            col_name="start_month"
                                            sort
                                        />
                                        <TableHeading
                                            label="End Month"
                                            col_name="end_month"
                                            sort
                                        />
                                        <TableHeading
                                            label="Is Locked"
                                            col_name="is_locked"
                                            sort
                                        />
                                        <TableHeading
                                            label="Status"
                                            col_name="role_serial"
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
                                                <td>{i.id}</td>
                                                <td>{i.title || ''}</td>
                                                <td>
                                                    {i.start_month || ''}
                                                </td>
                                                <td>{i.end_month || ''}</td>
                                                <td>
                                                    {i.is_locked ? 'Yes' : 'No'}
                                                </td>
                                                <td>{i.status}</td>
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
