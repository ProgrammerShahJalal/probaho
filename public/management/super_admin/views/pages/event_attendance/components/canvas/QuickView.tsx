import React from 'react';
import { createPortal } from 'react-dom';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import moment from 'moment/moment';
export interface Props { }

const modalRoot = document.getElementById('filter-root');

const QuickView: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    function close_canvas(action: boolean = true) {
        dispatch(storeSlice.actions.set_show_quick_view_canvas(action));
    }


    let formateDate = (date: string) => {
        return moment(date).format('Do MMM YY');
    };
    const formateTime = (time: string) => {
        
        const formattedTime = moment(time, ['HH:mm:ss', 'h:mm A', 'YYYY-MM-DD HH:mm:ss']).format('h:mm A');
    
        if (formattedTime === 'Invalid date') {
            console.error('Invalid time format:', time);
            return 'Invalid time';
        }
    
        return formattedTime;
    };

    if (modalRoot && state.show_quick_view_canvas) {
        return createPortal(
            <div className="off_canvas quick_view">
                <div className="off_canvas_body">
                    <div className="header">
                        <h3 className="heading_text">Quick View</h3>
                        <button
                            className="close_button"
                            onClick={() => close_canvas(false)}
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="data_content">
                        <table className="table quick_modal_table">
                            <tbody>
                                <tr>
                                    <th>Event Title</th>
                                    <th>:</th>
                                    <th>{state.item.event?.title?.slice(0, 30)}{state.item.event?.title?.length > 30 && '...'}</th>
                                </tr>
                                <tr>
                                    <th>Session Title</th>
                                    <th>:</th>
                                    <th>{state.item.session?.title?.slice(0, 30)}{state.item.session?.title?.length > 30 && '...'}</th>
                                </tr>
                                <tr>
                                    <th>User Name</th>
                                    <th>:</th>
                                    <th>{state.item.user?.first_name} {state.item.user?.last_name}</th>
                                </tr>
                                <tr>
                                    <th>Date</th>
                                    <th>:</th>
                                    <th>{formateDate(state.item.date)}</th>
                                </tr>
                                <tr>
                                    <th>Time</th>
                                    <th>:</th>
                                    <th>{formateTime(state.item.time)}</th>
                                </tr>
                                <tr>
                                    <th>Is Present</th>
                                    <th>:</th>
                                    <th>{state.item.is_present !== undefined ? (state.item.is_present ? 'Yes' : 'No') : 'N/A'}</th>
                                </tr>
                                
                                {/* <tr>
                                    <th>Status</th>
                                    <th>:</th>
                                    <th>{state.item.status}</th>
                                </tr> */}
                            </tbody>
                        </table>
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

export default QuickView;
