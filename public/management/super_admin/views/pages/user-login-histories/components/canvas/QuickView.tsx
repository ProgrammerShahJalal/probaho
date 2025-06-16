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

    let formateDateTime = (date: string) => {
        return moment(date).format('Do MMM YY, h:mm:ss A');
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
                                    <th>ID</th>
                                    <th>:</th>
                                    <th>{state.item.id}</th>
                                </tr>
                                <tr>
                                    <th>User ID</th>
                                    <th>:</th>
                                    <th>{state.item.user_id}</th>
                                </tr>
                                <tr>
                                    <th>Login Date</th>
                                    <th>:</th>
                                    <th>{formateDateTime(state.item.login_date)}</th>
                                </tr>
                                <tr>
                                    <th>Logout Date</th>
                                    <th>:</th>
                                    <th>{formateDateTime(state.item.logout_date)}</th>
                                </tr>
                                <tr>
                                    <th>Device</th>
                                    <th>:</th>
                                    <th>{state.item.device}</th>
                                </tr>
                                <tr>
                                    <th>Total Session Time</th>
                                    <th>:</th>
                                    <th>{state.item.total_session_time} seconds</th>
                                </tr>
                                
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
