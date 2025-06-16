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
                'id,title,place,event_type,poster,session_start_date_time,session_end_date_time,reg_start_date,reg_end_date,price,discount_price,status',
            ),
        );
        dispatch(all({}));
    }, [searchParams]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    let formateDateTime = (date: string) => {
        return moment(date).format('Do MMM YY, h:mm:ss A');
    };

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
                                            label={`Place`}
                                            col_name={`place`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Poster`}
                                            col_name={`poster`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Session Start Date Time`}
                                            col_name={`session_start_date_time`}
                                            sort={false}
                                        />
                                        {/* <TableHeading
                                            label={`Session End Date Time`}
                                            col_name={`session_end_date_time`}
                                            sort={false}
                                        /> */}

                                        <TableHeading
                                            label={`Price`}
                                            col_name={`price`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Discount Price`}
                                            col_name={`discount_price`}
                                            sort={true}
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
                                        (state.all as any).data.map((i: { [key: string]: any }, index) => {
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
                                                        {i.place?.slice(0, 30)} {i.place?.length > 30 && '...'}
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
                                                                src={i.poster}
                                                                alt="poster"
                                                            />
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {formateDateTime(i.session_start_date_time)}
                                                    </td>
                                                    <td>
                                                        ${i.price}
                                                    </td>
                                                    <td>
                                                        ${i.discount_price}
                                                    </td>
                                                </tr>
                                            );
                                        })
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
