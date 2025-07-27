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


    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(storeSlice.actions.set_role('branch_admin'));


        dispatch(
            storeSlice.actions.set_select_fields(
                'id,branch_user_id,branch_id,academic_year_id,title,description,status',
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
                <Header title={'All Academic Calendar Event Types'} />

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
                                            label="Branch User"
                                            col_name="branch_user_id"
                                            sort
                                        />
                                        {/* <TableHeading
                                            label="Branch ID"
                                            col_name="branch_id"
                                            sort
                                        /> */}
                                        <TableHeading
                                            label="Academic Year"
                                            col_name="academic_year_id"
                                            sort
                                        />
                                        <TableHeading
                                            label="Title"
                                            col_name="title"
                                            sort
                                        />
                                        <TableHeading
                                            label="Description"
                                            col_name="description"
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
                                                <td>{i.id}</td>
                                                <td>{i.branch_user_id ? i.users?.map((u)=> u.name): i.branch_user_id}</td>
                                                {/* <td>{i.branch_id}</td> */}
                                                <td>{i.academic_year_id ? i.academic_years?.map((ay)=> ay.title): i.academic_year_id}</td>
                                                <td>{i.title}</td>
                                                <td>{i.description}</td>
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
