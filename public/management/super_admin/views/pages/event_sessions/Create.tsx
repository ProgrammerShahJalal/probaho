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

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        try {
            let form_data = new FormData(e.target);
            const response = await dispatch(store(form_data) as any);

            if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
                e.target.reset();
                (window as any).toaster(
                    'Event session created successfully!',
                    'success',
                );
            }
        } catch (error: any) {
            console.log('error', error);
            // Handle the new error response format
            if (error.response?.data?.status) {
                (window as any).toaster(error.response.data.status, 'warning');
            }
            // Handle validation array errors
            else if (error.response?.data?.data) {
                const errorMessages = error.response.data.data
                    .map((err: any) => err.msg.replace(/<b>|<\/b>/g, ''))
                    .join('<br>');
                (window as any).toaster(errorMessages, 'warning');
            }
            // Fallback for other errors
            else {
                (window as any).toaster(
                    error.response?.data?.message ||
                        'An unexpected error occurred',
                    'error',
                );
            }
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
                                    Event Session Informations
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
                                            name="events"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                console.log(data);
                                            }}
                                        />
                                    </div>

                                    {[
                                        'title',
                                        'topics',
                                        'start',
                                        'end',
                                        'total_time',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {i === 'start' || i === 'end' ? (
                                                <Input
                                                    type="time"
                                                    name={i}
                                                    required={true}
                                                />
                                            ) : i === 'total_time' ? (
                                                <Input
                                                    required={true}
                                                    name={i}
                                                    placeholder="Enter total time in minutes"
                                                />
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
