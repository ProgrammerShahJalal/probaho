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
import moment from 'moment/moment';

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
                'title,short_description,full_description,cover_image,is_published,publish_date,slug,seo_title,seo_keyword,seo_description,status,created_at',
            ),
        );
        dispatch(all({}));
    }, [searchParams]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

  let  formateTime = (date: string) => {
    return moment(date).format('Do MMM YY');
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
                                            label={`Title`}
                                            col_name={`title`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Cover Image`}
                                            col_name={`cover_image`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Is Published?`}
                                            col_name={`is_published`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Publish Date`}
                                            col_name={`publish_date`}
                                            sort={false}
                                        />
                                        {/* <TableHeading
                                            label={`Status`}
                                            col_name={`status`}
                                            sort={false}
                                        /> */}
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {(state.all as any)?.data?.length > 0 ? (
                                    (state.all as any)?.data?.map( (i: { [key: string]: any }) => {
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
                                                    <td>{i.id}</td>

                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            {i.title?.slice(0, 40)}{i.title?.length > 40 && '...'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                       <div
                                                       className="mx-auto"
                                                       style={{
                                                        aspectRatio: "4/4",
                                                        maxWidth: "30px",
                                                       }}
                                                       >
                                                       <img
                                                       className='w-100'
                                                        src={i.cover_image}
                                                        alt="cover_image"
                                                        />
                                                       </div>

                                                    </td>
                                                    
                                                    <td>
                                                   { i?.is_published !== "draft" ? "Published" : "Draft" }
                                                    </td>

                                                    <td>
                                                   { formateTime(i.publish_date)}
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
