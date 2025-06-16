import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { update } from './config/store/async_actions/update';
import storeSlice from './config/store';
import Input from './components/management_data_page/Input';
import InputImage from './components/management_data_page/InputImage';
import DateEl from '../../components/DateEl';
import CategoryDropDown from '../blog_category/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import setup from './config/setup';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import DateTime from '../../components/DateTime';
import moment from 'moment/moment';
import { anyObject } from '../../../common_types/object';
import EventCategoryDropDown from "../event_category/components/dropdown/DropDown";
import EventTagDropDown from "../event_tags/components/dropdown/DropDown";

const Edit: React.FC = () => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    const editorRef = useRef<any>(null); // Ref to hold the CKEditor instance
    const [data, setData] = useState<string>(''); // State for CKEditor content

    // Fetch details on component mount
    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);

    // Initialize CKEditor
    useEffect(() => {
        const fullDescriptionElement = document.querySelector(
            '[data-name="fullDescription"]',
        );
        if (fullDescriptionElement && !editorRef.current) {
            const editor = CKEDITOR.replace('full_description'); // Initialize CKEditor
            editorRef.current = editor; // Save the instance to the ref

            const defaultValue = get_value('full_description');
            if (defaultValue) {
                editor.setData(defaultValue);
            }

            // Cleanup function to destroy the editor on component unmount
            return () => {
                editor.destroy();
                editorRef.current = null;
            };
        }
    }, [state.item?.id]);


    const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form_data = new FormData(e.currentTarget);
        // form_data.append('full_description', data);

        // Get the editor data
        if (editorRef.current) {
            form_data.append('full_description', editorRef.current.getData()); // Access CKEditor instance correctly
        } else {
            console.error('CKEditor instance is not available');
        }

        // Dispatch the update action
                await dispatch(update(form_data) as any);
    };

    // Helper to get values from state
    const get_value = (key: string): string => {
        try {
            return state.item[key] || state.item?.info?.[key] || '';
        } catch {
            return '';
        }
    };

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header page_title={setup.edit_page_title} />
                {Object.keys(state.item).length > 0 && (
                    <div className="content_body custom_scroll">
                        <form onSubmit={handle_submit} className="mx-auto pt-3">
                            <input
                                type="hidden"
                                name="id"
                                defaultValue={get_value('id')}
                            />
                            <div>
                                <h5 className="mb-4">Input Data</h5>
                                <div className="row">
                                    <div className="col-8">
                                        <label className="mb-2">Full Description</label>
                                        {state.item && (
                                            <div
                                                data-name="fullDescription"
                                                id="full_description"
                                            ></div>
                                        )}

                                        <div className="form-group mt-4">
                                            <label>Short Description</label>
                                            <textarea
                                                className="form-control"
                                                defaultValue={get_value('short_description')}
                                                name="short_description"
                                                id="short_description"
                                                rows={3}
                                            ></textarea>
                                        </div>

                                        {['pre_requisities',
                                            'terms_and_conditions',
                                            'price',
                                            'discount_price',
                                            'poster',
                                        ].map(
                                            (i) => (
                                                <div key={i} className="form-group form-vertical">

                                                    {
                                                        i === 'poster' ? <div className="form-group grid_full_width form-vertical">
                                                            <InputImage
                                                                defalut_preview={get_value('poster')}
                                                                label="Poster"
                                                                name="poster"
                                                            />
                                                        </div> : <Input value={get_value(i)} name={i} />
                                                    }
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group form-vertical">
                                            <Input value={get_value('title')} name="title" />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <Input value={get_value('place')} name="place" />
                                        </div>

                                        <div className="form-group form-vertical">
                                            <label>Event Categories</label>
                                            <EventCategoryDropDown name="event_categories"
                                                multiple={true}
                                                default_value={get_value('event_categories') ? [{ id: get_value('event_categories') }] : []}
                                                get_selected_data={(data) => {
                                                    console.log(data)
                                                }}
                                            />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <label>Event Tags</label>
                                            <EventTagDropDown name="event_tags"
                                                multiple={true}
                                                default_value={get_value('event_tags') ? [{ id: get_value('event_tags') }] : []}
                                                get_selected_data={(data) => {
                                                    console.log(data)
                                                }}
                                            />
                                        </div>
                                        {/* Event Type Radio Buttons */}
                                        <label>Event Type</label>
                                        <div style={{ paddingBottom: 10 }}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="event_type"
                                                    value="online"
                                                    checked={get_value('event_type') === 'online'}
                                                    onChange={(e) =>
                                                        dispatch(
                                                            storeSlice.actions.set_item({
                                                                ...state.item,
                                                                event_type: e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />
                                                Online
                                            </label>
                                            <br />
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="event_type"
                                                    value="offline"
                                                    checked={get_value('event_type') === 'offline'}
                                                    onChange={(e) =>
                                                        dispatch(
                                                            storeSlice.actions.set_item({
                                                                ...state.item,
                                                                event_type: e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />
                                                Offline
                                            </label>
                                        </div>

                                        {/* Additional Form Fields */}

                                        <div className="form-group grid_full_width form-vertical">
                                            <label>Reg Start Date</label>
                                            <DateEl
                                                value={get_value('reg_start_date')}
                                                name="reg_start_date"
                                                handler={() => console.log('Date changed')}
                                            />
                                        </div>

                                        <div className="form-group grid_full_width form-vertical">
                                            <label>Reg End Date</label>
                                            <DateEl
                                                value={get_value('reg_end_date')}
                                                name="reg_end_date"
                                                handler={() => console.log('Date changed')}
                                            />
                                        </div>

                                        <div className="form-group grid_full_width form-vertical">
                                            <label>Session Start Date Time</label>
                                            <DateTime
                                                value={get_value('session_start_date_time')}
                                                name="session_start_date_time"
                                                handler={() => console.log('DateTime changed', data)}
                                            />
                                        </div>

                                        <div className="form-group grid_full_width form-vertical">
                                            <label>Session End Date Time</label>
                                            <DateTime
                                                value={get_value('session_end_date_time')}
                                                name="session_end_date_time"
                                                handler={() => console.log('DateTime changed', data)}
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-outline-info">Submit</button>
                        </form>
                    </div>
                )}
                <Footer>
                    {state?.item?.id && (
                        <li>
                            <Link
                                to={`/${setup.route_prefix}/details/${state.item.id}`}
                                className="outline"
                            >
                                <span className="material-symbols-outlined fill">visibility</span>
                                <div className="text">Details</div>
                            </Link>
                        </li>
                    )}
                </Footer>
            </div>
        </div>
    );
};

export default Edit;
