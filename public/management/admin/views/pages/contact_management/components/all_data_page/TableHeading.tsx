import React from 'react';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../../store';
import setup from '../../config/setup';
import storeSlice from '../../config/store';
import { all } from '../../config/store/async_actions/all';
export interface Props {
    label: string;
    col_name: string;
    sort: boolean;
}

const TableHeading: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    function handle_sort() {
        if (props.sort) {
            const active_col_name = state.orderByCol;
            const active_order_by_asc = state.orderByAsc;

            dispatch(storeSlice.actions.set_order_by_col(props.col_name));
            dispatch(storeSlice.actions.set_only_latest_data(true));
            dispatch(storeSlice.actions.set_page(1));

            if (active_col_name !== props.col_name) {
                dispatch(storeSlice.actions.set_order_by_asc(true));
            } else {
                dispatch(
                    storeSlice.actions.set_order_by_asc(!active_order_by_asc),
                );
            }

            dispatch(all({}) as any);
        }
    }
    return (
        <>
            <th className={`col_${props.col_name}`}>
                <div
                    onClick={handle_sort}
                    className={`table_heading_label ${props.sort ? 'sort' : ''}`}
                >
                    <span>{props.label}</span>
                    {state.orderByCol == props.col_name &&
                        (state.orderByAsc ? (
                            <span className="material-symbols-outlined fill icon">
                                vertical_align_top
                            </span>
                        ) : (
                            <span className="material-symbols-outlined fill icon">
                                vertical_align_bottom
                            </span>
                        ))}
                </div>
            </th>
        </>
    );
};

export default TableHeading;
