import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from "../events/components/dropdown/DropDown";
import UserDropDown from "../users/components/dropdown/DropDown";
import EnrollmentDropDown from "../event_enrollments/components/dropdown/DropDown";
import PaymentDropDown from "../event_payments/components/dropdown/DropDown";
import DateEl from '../../components/DateEl';


export interface Props { }


const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
        }
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

                                <h5 className="mb-4">Event Payment Refunds Informations</h5>
                                <div className="form_auto_fit">

                                    <div className="form-group form-vertical">
                                        <label>Event</label>
                                        <EventDropDown name="event_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>User</label>
                                        <UserDropDown name="user_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>Enrollment</label>
                                        <EnrollmentDropDown name="event_enrollment_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>Payment</label>
                                        <PaymentDropDown name="payment_id"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data)
                                            }}
                                        />
                                    </div>

                                    {[
                                        'date',
                                        'amount',
                                        'trx_id',
                                        'media',
                                    ].map((i) => (
                                        <div key={i} className="form-group form-vertical">
                                            {
                                                i === 'date' ? (
                                                    <DateEl
                                                        name={"date"}
                                                        value={get_value('date')}
                                                        handler={(data) => console.log('Date Changed', data)}
                                                    />
                                                ) : (
                                                    i === 'media' ? (
                                                        <><label>Media</label>
                                                            <select>
                                                                <option value="Stripe">Stripe</option>
                                                                <option value="Manual">Manual</option>
                                                            </select></>
                                                    ) : (
                                                        i === 'is_refunded' ? (
                                                            <><label>Is Refunded</label>
                                                                <select>
                                                                    <option value="false">False</option>
                                                                    <option value="true">True</option>
                                                                </select>
                                                            </>
                                                        ) : (
                                                            <Input name={i} />
                                                        )
                                                    )
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="form-group form-vertical">
                                <label></label>
                                <div className="form_elements">
                                    <button className="btn btn_1 btn-outline-info">
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
