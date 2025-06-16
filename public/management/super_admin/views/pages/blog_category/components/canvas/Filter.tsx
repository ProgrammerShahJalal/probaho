import React from 'react';
import { createPortal } from 'react-dom';
import DateElFilter from '../../../../components/DateElFilter';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { all } from '../../config/store/async_actions/all';
export interface Props { }

const modalRoot = document.getElementById('filter-root');

const Filter: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    function get_data(data: { [key: string]: any }): void {
        // console.log(data);
        set_filter({
            key: data.key,
            value: data.value,
        });
    }

    function close_filter(action: boolean = true) {
        dispatch(storeSlice.actions.set_show_filter_canvas(action));
    }

    function set_filter(data: { key: string; value: string | number }) {
        dispatch(
            storeSlice.actions.set_filter_criteria({
                key: data.key,
                value: data.value,
            }),
        );
    }

    function submit() {
        dispatch(storeSlice.actions.set_only_latest_data(true));
        dispatch(all({}) as any);
    }

    if (modalRoot && state.show_filter_canvas) {
        return createPortal(
            <div className="off_canvas data_filter">
                <div className="off_canvas_body">
                    <div className="header">
                        <h3 className="heading_text">Filter</h3>
                        <button
                            className="close_button"
                            onClick={() => close_filter(false)}
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="data_content">
                        <div className="filter_item">
                            <label htmlFor="start_date">Start Date</label>
                            <DateElFilter
                                value={''}
                                name={'start_date'}
                                handler={get_data}
                            ></DateElFilter>
                        </div>
                        <div className="filter_item">
                            <label htmlFor="end_date">End Date</label>
                            <DateElFilter
                                value={''}
                                name={'end_date'}
                                handler={get_data}
                            ></DateElFilter>
                        </div>
                        

                        <div className="filter_item">
                            <button
                                onClick={submit}
                                type="button"
                                className="btn btn-sm btn-outline-info"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="off_canvas_overlay"></div>
            </div>,
            modalRoot,
        );
    } else {
        return <></>;
    }
};

export default Filter;
