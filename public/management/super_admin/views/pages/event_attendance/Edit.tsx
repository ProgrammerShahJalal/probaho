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
import EventDropDown from "../events/components/dropdown/DropDown";
import SessionDropDown from "../event_sessions/components/dropdown/DropDown";
import UserDropDown from "../users/components/dropdown/DropDown";
import DateElA from '../../components/DateElA';
import Time from '../../components/Time';

export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [isPresent, setIsPresent] = useState(false);
    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);


    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        // Convert is_present checkbox value to "1" or "0" as a string
        const isPresentValue = isPresent ? "1" : "0";
        form_data.set('is_present', isPresentValue);
        const response = await dispatch(update(form_data) as any);
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

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setIsPresent(isChecked); // Update the state

        // Perform actions based on whether the checkbox is checked or unchecked
        if (isChecked) {
            console.log('Checkbox is checked');
            // Add any logic for when the checkbox is checked
        } else {
            console.log('Checkbox is unchecked');
            // Add any logic for when the checkbox is unchecked
        }
    };

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
                                            <label>Sessions</label>
                                            <SessionDropDown name="sessions"
                                                multiple={false}
                                                default_value={get_value('event_session_id') ? [{ id: get_value('event_session_id') }] : []}
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
                                            <label>Date</label>
                                            <DateElA
                                                name={"date"}
                                                value={get_value('date')}
                                                handler={(data) => console.log('Date Changed', data)}
                                                default_value={get_value('date')} />
                                        </div>

                                        <div className="form-group form-vertical">
                                            <label>Time</label>
                                            <Time
                                                name={"time"}
                                                value={get_value('time')}
                                                handler={(data) => console.log('Time Changed', data)}
                                                default_value={get_value('time')} />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <label>Is Present</label>
                                            <input
                                                type="checkbox"
                                                checked={get_value('is_present') || isPresent}
                                                onChange={handleCheckboxChange}
                                                name={"is_present"}
                                                value={get_value('is_present')}
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
