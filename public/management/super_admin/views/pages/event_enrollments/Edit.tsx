import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { update } from './config/store/async_actions/update';
import DateEl from '../../components/DateEl';
import EventDropDown from "../events/components/dropdown/DropDown";
import UserDropDown from "../users/components/dropdown/DropDown";

export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();


    const [isPaid, setIsPaid] = useState('');
    const [status, setStatus] = useState('');


    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    useEffect(() => {
        // when data is loaded, update local state
        if (state.item && state.item.id) {
            setIsPaid(state.item.is_paid ?? '0');
            setStatus(state.item.status ?? 'pending');
        }
    }, [state.item]);

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(update(form_data) as any);
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

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <form
                                onSubmit={(e) => handle_submit(e)}
                                className="mx-auto pt-3"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    defaultValue={get_value(`id`)}
                                />

                                <div>
                                    <h5 className="mb-4">
                                        Input Data
                                    </h5>
                                    <div className="form_auto_fit">

                                        <div className="form-group form-vertical">
                                            <label>Events</label>
                                            <EventDropDown name="events"
                                                multiple={false}
                                                default_value={get_value('event_id') ? [{ id: get_value('event_id') }] : []}
                                                get_selected_data={(data) => {
                                                    console.log(data)
                                                }}
                                            />
                                        </div>

                                        <div className="form-group form-vertical">
                                            <label>Users</label>
                                            <UserDropDown name="users"
                                                multiple={false}
                                                default_value={get_value('user_id') ? [{ id: get_value('user_id') }] : []}
                                                get_selected_data={(data) => {
                                                    console.log(data)
                                                }}
                                            />
                                        </div>

                                        <div className="form-group form-vertical">
                                            <label>Is Paid?</label>
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
                                            <label>Status</label>
                                            <select
                                                name="status"
                                                className="form-control"
                                                value={status}
                                                onChange={handleStatusChange}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="accepted">Accepted</option>
                                            </select>
                                        </div>

                                        <div className="form-group form-vertical">
                                            <DateEl
                                                name={"date"}
                                                value={get_value('date')}
                                                handler={(data) => console.log('Date Changed', data)}
                                            />
                                        </div>


                                    </div>



                                </div>

                                <div className="form-group form-vertical">
                                    <label></label>
                                    <div className="form_elements">
                                        <button className="btn btn-outline-info">
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <Footer>
                        {state?.item?.id && (
                            <li>
                                <Link
                                    to={`/${setup.route_prefix}/details/${state.item?.id}`}
                                    className="outline"
                                >
                                    <span className="material-symbols-outlined fill">
                                        visibility
                                    </span>
                                    <div className="text">Details</div>
                                </Link>
                            </li>
                        )}
                    </Footer>
                </div>
            </div>
        </>
    );
};

export default Edit;
