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
import Input from './components/management_data_page/Input';
import Select from 'react-select';
import DateEl from '../../components/DateEl';
import EventDropDown from "../events/components/dropdown/DropDown";
import UserDropDown from "../users/components/dropdown/DropDown";
import EnrollmentDropDown from "../event_enrollments/components/dropdown/DropDown";
import PaymentDropDown from "../event_payments/components/dropdown/DropDown";
import moment from 'moment/moment';

export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);




    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(update(form_data) as any);
    }

    function get_value(key) {
        try {
            // Handle nested user object
            if (key === 'user_id' && state.item.user) {
                return `${state.item.user.first_name} ${state.item.user.last_name}`;
            }

            // Handle nested event object
            if (key === 'event_id' && state.item.event) {
                return state.item.event.title;
            }

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
                                    <div className="form_auto_fit">

                                        <div className="form-group form-vertical">
                                            <h4><strong>Event Title:</strong> {get_value('event_id')}</h4>
                                            <p><strong>Date:</strong> {moment(get_value('date')).format('LLL')}</p>
                                            <p><strong>Amount:</strong> {get_value('amount')}</p>
                                            <p><strong>Transaction ID:</strong> {get_value('trx_id')}</p>
                                            <p><strong>Media:</strong> {get_value('media')}</p>

                                        </div>
                                    </div>

                                    <><label>Update Status</label>
                                        <select
                                            name="status"
                                            className="form-control"
                                            defaultValue={get_value('status')}
                                            onChange={(e) => console.log('Status Changed', e.target.value)}

                                            style={{
                                                width: '30%',
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="success">Success</option>
                                        </select></>

                                </div>

                                <div className="form-group form-vertical mt-10">
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
