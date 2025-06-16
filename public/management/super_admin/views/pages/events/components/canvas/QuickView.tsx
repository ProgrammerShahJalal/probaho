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
 let formateDate = (date: string) => {
         return moment(date).format('Do MMM YY');
    }

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
                                    <th>Title</th>
                                    <th>:</th>
                                    <th>{state.item.title?.slice(0, 40)} {state.item.title?.length > 40 && '...'}</th>
                                </tr>
                                <tr>
                                    <th>Place</th>
                                    <th>:</th>
                                    <th>{state.item.place?.slice(0, 30)}{state.item.place?.length > 30 && '...'}</th>
                                </tr>
                                <tr>
                                    <th>Event Type</th>
                                    <th>:</th>
                                    <th>{state.item.event_type}</th>
                                </tr>
                                <tr>
                                    <th>Poster</th>
                                    <th>:</th>
                                    <th>
                                        <div
                                         
                                        style={{
                                            aspectRatio: '4/4',
                                            maxWidth: '30px',
                                        }}
                                        >
                                        <img
                                         className='w-100'
                                        src={state.item.poster}
                                        alt={state.item.title}
                                        />
                                        </div>
                                    </th>
                                </tr>


                                <tr>
                                    <th>Session Start Date Time</th>
                                    <th>:</th>
                                    <th> { formateDateTime(state.item.session_start_date_time)}</th>
                                </tr>
                                <tr>
                                    <th>Session End Date Time</th>
                                    <th>:</th>
                                    <th> { formateDateTime(state.item.session_end_date_time)}</th>
                                </tr>
                                <tr>
                                    <th>Registration Start Date</th>
                                    <th>:</th>
                                    <th> { formateDate(state.item.reg_start_date)}</th>
                                </tr>
                                <tr>
                                    <th>Registration End Date</th>
                                    <th>:</th>
                                    <th> { formateDate(state.item.reg_end_date)}</th>
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    <th>:</th>
                                    <th> ${state.item.price}</th>
                                </tr>
                                <tr>
                                    <th>Discount Price</th>
                                    <th>:</th>
                                    <th> ${state.item.discount_price}</th>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <th>:</th>
                                    <th>{state.item.status}</th>
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
