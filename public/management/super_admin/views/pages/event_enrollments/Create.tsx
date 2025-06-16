import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from '../events/components/dropdown/DropDown';
import UserDropDown from '../users/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import ManualEnrollmentNotice from './ManualEnrollmentNotice';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    const [isPaid, setIsPaid] = useState('0');
    const [status, setStatus] = useState('pending');

    const [selectedEventId, setSelectedEventId] = useState(0);
    const [selectedUserId, setSelectedUserId] = useState(0);

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
            setIsPaid('0');
            setStatus('pending');
            setSelectedEventId(0);
            setSelectedUserId(0);
        }
    }

    function handleIsPaidChange(e) {
        const value = e.target.value;
        setIsPaid(value);
        // Auto-update status based on is_paid value
        if (value === '1') {
            setStatus('accepted');
        } else {
            setStatus('pending');
        }
    }

    function handleStatusChange(e) {
        setStatus(e.target.value);
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

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="mx-auto pt-3"
                        >
                            <div>
                                <ManualEnrollmentNotice />
                                <div className="form_auto_fit">
                                    <div className="form-group form-vertical">
                                        <label>
                                            Events
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <EventDropDown
                                            name="event_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data);
                                                setSelectedEventId(
                                                    Number(data?.ids),
                                                );
                                            }}
                                        />
                                    </div>

                                    <div className="form-group form-vertical">
                                        <label>
                                            Users
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <UserDropDown
                                            name="user_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data);
                                                setSelectedUserId(
                                                    Number(data?.ids),
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>
                                            Date
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <DateEl
                                            name={'date'}
                                            value={get_value('date')}
                                            handler={(data) =>
                                                console.log(
                                                    'Date Changed',
                                                    data,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="form-group form-vertical">
                                        <label>
                                            Is Paid?
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="is_paid"
                                            className="form-control"
                                            value={isPaid}
                                            onChange={handleIsPaidChange}
                                        >
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </div>

                                    <div className="form-group form-vertical">
                                        <label>
                                            Status
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="status"
                                            className="form-control"
                                            value={status}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                            <option value="accepted">
                                                Accepted
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Conditionally render the submit button */}
                            {selectedEventId && selectedUserId ? (
                                <div className="form-group form-vertical">
                                    <label></label>
                                    <div className="form_elements">
                                        <button
                                            type="submit"
                                            className="btn btn_1 btn-outline-info"
                                        >
                                            submit
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group form-vertical">
                                    <label></label>
                                    <div className="form_elements"></div>
                                </div>
                            )}
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
