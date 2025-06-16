import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import InputImage from './components/management_data_page/InputImage';
import { anyObject } from '../../../common_types/object';
import DateEl from '../../components/DateEl';
import storeSlice from './config/store';
import { useParams } from 'react-router-dom';
import { details } from './config/store/async_actions/details';
import Select from 'react-select';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from "../events/components/dropdown/DropDown";
import SessionDropDown from "../event_sessions/components/dropdown/DropDown";
import AssesmentDropDown from "../event_sessions_assesments/components/dropdown/DropDown";

export interface Props { }


const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [data, setData] = useState<anyObject>({});


    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);

        form_data.append('description', data.getData());

        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
        }
    }



    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);



    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    /* CKEDITOR RICH TEXT*/
    useEffect(() => {
        let editor = CKEDITOR.replace('description');
        setData(editor);
    }, [])



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


                                <h5 className="mb-4">Events Session Assesment Submissions Informations</h5>
                                <div className="row">

                                    <div className='col-8'>


                                        <label className='mb-4'>Description</label>
                                        <div id='description' className='pb-6'>

                                        </div>

                                        {[
                                            'submitted_content',
                                            'mark',
                                            'obtained_mark',
                                        ].map((i) => (
                                            <div className="form-group form-vertical">
                                                    <Input name={i} />
                                            </div>
                                        ))}

                                    </div>

                                    <div className='col-4'>

                                        <div className="form_auto_fit">

                                            <div className="form-group form-vertical">
                                                <label>Events</label>
                                                <EventDropDown name="events"
                                                    multiple={false}
                                                    get_selected_data={(data) => {
                                                        console.log(data)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>Sessions</label>
                                                <SessionDropDown name="sessions"
                                                    multiple={false}
                                                    get_selected_data={(data) => {
                                                        console.log(data)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>Assesments</label>
                                                <AssesmentDropDown name="assesments"
                                                    multiple={false}
                                                    get_selected_data={(data) => {
                                                        console.log(data)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

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
