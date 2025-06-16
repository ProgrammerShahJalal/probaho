import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import setup from './config/setup';
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

export interface Props { }

const All: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    let [searchParams] = useSearchParams();

    useEffect(() => {
        // dispatch(storeSlice.actions.set_role('all'));

        dispatch(
            storeSlice.actions.set_select_fields(
                'id,user_id,blog_id,comment,parent_comment_id,status',
            ),
        );
        dispatch(all({}));
    }, [searchParams]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header></Header>

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
                                            label={`ID`}
                                            col_name={`id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Commenter`}
                                            col_name={`user_id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Blog Title`}
                                            col_name={`blog_id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Parent Comment`}
                                            col_name={`parent_comment_id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Replay`}
                                            col_name={`comment`}
                                            sort={true}
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                {(state.all as any)?.data?.length > 0 ? (
                                    (state?.all as any)?.data?.map(
                                        (i: { [key: string]: any }) => {
                                            return (
                                                <tr
                                                    key={i.id}
                                                    className={`table_rows table_row_${i.id}`}
                                                >
                                                    <td>
                                                        <TableRowAction
                                                            item={i}
                                                        />
                                                    </td>
                                                    <td>
                                                        <SelectItem item={i} />
                                                    </td>
                                                    <td className="text-nowrap">
                                                        {i.id}
                                                    </td>
                                                    <td className="text-nowrap">
                                                        {i.user?.first_name} {i.user?.last_name}
                                                    </td>

                                                    <td className="text-truncate" style={{ maxWidth: '200px' }} title={i.blog?.title}>
                                                        {i.blog?.title?.slice(0, 40)}{i.blog?.title?.length > 40 && '...'}
                                                    </td>

                                                    <td className="text-truncate" style={{ maxWidth: '150px' }} title={i.parent_comment?.comment}>
                                                        {i.parent_comment?.comment?.slice(0, 30)}{i.parent_comment?.comment?.length > 30 && '...'}
                                                    </td>

                                                    <td className="text-truncate" style={{ maxWidth: '150px' }} title={i.comment}>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            {i.comment?.slice(0, 30)}{i.comment?.length > 30 && '...'}
                                                        </span>
                                                    </td>

                                                    {/* <td>
                                                        {i.status}
                                                    </td> */}
                                                </tr>
                                            );
                                        },
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center py-4">
                                            No data found
                                        </td>
                                    </tr>
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
                        ></Paginate>
                    </div>
                </div>
                <TableFooter></TableFooter>
            </div>

            <Filter></Filter>
            <QuickView></QuickView>
        </div>
    );
};

export default All;
