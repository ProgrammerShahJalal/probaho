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
                'id,event_id,event_session_id,title,description,mark,pass_mark,start,end,status',
            ),
        );
        dispatch(all({}));
    }, [searchParams]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    let formatTime = (time: string) => {
        return moment(time, 'HH:mm').format('h:mmA');
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
                                            label={`Event Title`}
                                            col_name={`event_id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Session Title`}
                                            col_name={`event_session_id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={` Assesment Title`}
                                            col_name={`title`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Mark`}
                                            col_name={`mark`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Start`}
                                            col_name={`start`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`End`}
                                            col_name={`end`}
                                            sort={true}
                                        />
                                    
                                        <TableHeading
                                            label={`Status`}
                                            col_name={`status`}
                                            sort={false}
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {(state.all as any)?.data?.map(
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
                                                    <td>{i.id}</td>
                                                    <td>{i.event?.title?.slice(0, 30)}{i.event?.title?.length > 30 && '...'}</td>
                                                    <td>{i.session?.title?.slice(0, 30)}{i.session?.title?.length > 30 && '...'}</td>

                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            {i.title?.slice(0, 30)}{i.title?.length > 30 && '...'}

                                                        </span>
                                                    </td> 
                                                    <td>{i.mark}</td> 
                                                    <td>{formatTime(i.start)}</td>
                                                    <td>{formatTime(i.end)}</td>
                                                    <td>{i.status}</td>
                                                </tr>
                                            );
                                        },
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
