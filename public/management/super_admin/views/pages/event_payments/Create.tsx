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
import EventEnrollmentDropDown from '../event_enrollments/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';

export interface Props {}

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
                                <h5 className="mb-4">
                                    Event Payment Informations
                                </h5>
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
                                            }}
                                        />
                                    </div>

                                    {[
                                        'date',
                                        'amount',
                                        'trx_id',
                                        'media',
                                        'is_refunded',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {i === 'date' ? (
                                                <>
                                                    <label>
                                                        Date
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </label>
                                                    <DateEl
                                                        name={'date'}
                                                        value={get_value(
                                                            'date',
                                                        )}
                                                        handler={(data) =>
                                                            console.log(
                                                                'Date Changed',
                                                                data,
                                                            )
                                                        }
                                                    />
                                                </>
                                            ) : i === 'media' ? (
                                                <>
                                                    <div className="form-group form-vertical">
                                                        <label>
                                                            Media
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                        </label>
                                                        <select
                                                            name="media"
                                                            className="form-control"
                                                            onChange={(e) =>
                                                                console.log(
                                                                    'media Changed',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        >
                                                            <option value="Manual">
                                                                Manual
                                                            </option>
                                                            <option value="Stripe">
                                                                Stripe
                                                            </option>
                                                        </select>
                                                    </div>
                                                </>
                                            ) : i === 'is_refunded' ? (
                                                <>
                                                    <div className="form-group form-vertical">
                                                        <label>
                                                            Is Refunded
                                                        </label>
                                                        <select
                                                            name="is_refunded"
                                                            className="form-control"
                                                            onChange={(e) =>
                                                                console.log(
                                                                    'is_refunded Changed',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        >
                                                            <option value="false">
                                                                False
                                                            </option>
                                                            <option value="true">
                                                                True
                                                            </option>
                                                        </select>
                                                    </div>
                                                </>
                                            ) : (
                                                <Input
                                                    name={i}
                                                    required={true}
                                                />
                                            )}
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
