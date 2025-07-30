import React, { useEffect } from 'react';
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
import moment from 'moment/moment';
import { formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';

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
                'id,branch_user_id,branch_id,academic_year_id,branch_class_building_id,title,code,capacity,status',
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
                <Header title={setup.all_page_title} />

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
                                        <TableHeading
                                            label="Academic Year"
                                            col_name="academic_year_id"
                                            sort
                                        />
                                        <TableHeading
                                            label="Building"
                                            col_name="branch_class_building_id"
                                            sort
                                        />
                                        <TableHeading
                                            label="Title"
                                            col_name="title"
                                            sort
                                        />
                                        <TableHeading
                                            label="Code"
                                            col_name="code"
                                            sort
                                        />
                                        <TableHeading
                                            label="Capacity"
                                            col_name="capacity"
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
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.branch_user_id ? formatArrayForTable(i.users, 'name') : i.branch_user_id,
                                                        columnType: 'name',
                                                        maxLength: 16,
                                                    })}
                                                />
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.academic_year_id ? formatArrayForTable(i.academic_years, 'title') : i.academic_year_id,
                                                        columnType: 'title',
                                                        maxLength: 20,
                                                    })}
                                                />
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.branch_class_building_id ? formatArrayForTable(i.branch_class_building_id, 'title') : i.branch_class_building_id,
                                                        columnType: 'title',
                                                        maxLength: 20,
                                                    })}
                                                />
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.title,
                                                        columnType: 'title',
                                                        maxLength: 20,
                                                    })}
                                                />
                                                <td
                                                    {...getTruncatedCellProps({
                                                        text: i.code,
                                                        columnType: 'code',
                                                        maxLength: 20,
                                                    })}
                                                />
                                                <td >{i.capacity}</td>
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
