import React from 'react';
import { createPortal } from 'react-dom';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { all } from '../../config/store/async_actions/all';
import DateElFilter from '../../../../components/DateElFilter';
export interface Props { }

const modalRoot = document.getElementById('filter-root');

const Filter: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    
    const filterCriteria = {
        start_date: '',
        end_date: '',
    };

    function get_data(data: { [key: string]: any }): void {
        // Ensure `key` and `value` exist and process them
        console.log('data', data);
        if (data.key && data.value) {
            const formattedDate = data.value.split('T')[0]; // Extract the date part
            filterCriteria[data.key] = formattedDate;
        }
    }
    
    function close_filter(action = true) {
        dispatch(storeSlice.actions.set_show_filter_canvas(action));
    }

    function set_filter(data: { key: string; value: string }) {
        dispatch(
            storeSlice.actions.set_filter_criteria({
                key: data.key,
                value: data.value,
            }),
        );
    }

    function submit() {
        // Apply the date filter

        set_filter({ key: 'start_date', value: filterCriteria.start_date });
        set_filter({ key: 'end_date', value: filterCriteria.end_date });
        dispatch(all({}) as any);
        close_filter(false);
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
