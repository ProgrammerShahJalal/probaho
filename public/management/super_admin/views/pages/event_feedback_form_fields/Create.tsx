import $ from 'jquery';
import 'formBuilder';
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
import { feedbackDefaultFields } from './helpers/feedback_defaultFields';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fbTemplate = $('#build-wrap');

            setTimeout(() => {
                if (
                    fbTemplate.length > 0 &&
                    typeof fbTemplate.formBuilder === 'function'
                ) {
                    fbTemplate.formBuilder();
                } else {
                    console.info('formBuilder is intializing...');
                }
            }, 500); // Delay by 500ms to allow formBuilder to load
        }

        jQuery(($) => {
            const fbEditor = document.getElementById('build-wrap');
            var options = {
                defaultFields: feedbackDefaultFields,
            };
            const formBuilder = $(fbEditor).formBuilder(options);

            document
                .getElementById('saveData')
                ?.addEventListener('click', () => {
                    // console.log("external save clicked");
                    const result = formBuilder.actions.save();
                    // console.log("result:", result);

                    // Store result globally to use in form submission
                    localStorage.setItem(
                        'formBuilderData',
                        JSON.stringify(result),
                    );
                });
        });
    }, []);

    async function handle_submit(e) {
        e.preventDefault();

        // Retrieve the saved formBuilder data
        const savedData = localStorage.getItem('formBuilderData');
        const parsedData = savedData ? JSON.parse(savedData) : null;

        let form_data = new FormData(e.target);

        // Append the saved formBuilder data
        if (parsedData) {
            form_data.append('fields', JSON.stringify(parsedData));
        }

        const response = await dispatch(store(form_data) as any);

        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            localStorage.removeItem('formBuilderData'); // Clear saved data
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
                                <div>
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

                                    <div
                                        className="header2"
                                        id="build-wrap"
                                        style={{
                                            padding: 0,
                                            margin: '10px 0',
                                            backgroundColor: '#423050',
                                            backgroundImage:
                                                'url("https://formbuilder.online/assets/img/noise.png")',
                                            backgroundRepeat: 'repeat',
                                        }}
                                    >
                                        <div id="fb-editor"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group form-vertical">
                                <div className="saveDataWrap">
                                    <button
                                        id="saveData"
                                        className="btn btn_1 btn-outline-info"
                                        type="submit"
                                    >
                                        Submit
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
