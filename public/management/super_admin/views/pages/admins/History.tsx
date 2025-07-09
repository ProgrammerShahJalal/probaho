import React, { useEffect } from 'react';
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

export interface Props { }

const History: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(storeSlice.actions.set_role('marketing'));
        dispatch(
            storeSlice.actions.set_select_fields(
                'id, uid, mo, gm, agm, ed, name, email, image, status',
            ),
        );
        dispatch(all({}));
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header title="Employee History"></Header>

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
                                            label={`User ID`}
                                            col_name={`uid`}
                                            sort={true}
                                        />
                                        <th>Image</th>
                                        <TableHeading
                                            label={`Name`}
                                            col_name={`name`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Month`}
                                            col_name={`month`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Booking Money`}
                                            col_name={`booking_money`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Down payment`}
                                            col_name={`down_payment`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Installment`}
                                            col_name={`installment`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Reference`}
                                            col_name={`reference`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`From Total Income`}
                                            col_name={`from_total_income`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Total`}
                                            col_name={`total`}
                                            sort={true}
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
                                                    {/* ID  */}
                                                    <td>{i.id}</td>
                                                    {/* UID  */}
                                                    <td>{`100${i.id}`}</td>
                                                    {/* IMAGE  */}
                                                    <td>
                                                        <img
                                                            src={
                                                                i.image
                                                                    ? `/${i.image}`
                                                                    : '/assets/dashboard/images/avatar.png'
                                                            }
                                                            alt=""
                                                            style={{
                                                                height: 30,
                                                            }}
                                                        />
                                                    </td>
                                                    {/* Name  */}
                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            {i.name}
                                                        </span>
                                                    </td>
                                                    {/* Month  */}
                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            january
                                                        </span>
                                                    </td>
                                                    {/* Booking Money  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                        /-
                                                    </td>
                                                    {/* Down Payment  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                        /-
                                                    </td>
                                                    {/* Installment  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                        /-
                                                    </td>
                                                    {/* Referance  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                    </td>
                                                    {/* From Total Income  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                        /-
                                                    </td>
                                                    {/* Total  */}
                                                    <td>
                                                        {Math.round(
                                                            Math.random() *
                                                            0,
                                                        )}
                                                        /-
                                                    </td>
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

export default History;
