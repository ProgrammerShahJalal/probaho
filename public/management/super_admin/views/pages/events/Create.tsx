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
import DateTime from '../../components/DateTime';
import EventCategoryDropDown from '../event_category/components/dropdown/DropDown';
import EventTagDropDown from '../event_tags/components/dropdown/DropDown';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [data, setData] = useState<anyObject>({});
    const [clearImagePreview, setClearImagePreview] = useState(false);

    async function handle_submit(e) {
        e.preventDefault();
        setClearImagePreview(false); // Reset before submission
        let form_data = new FormData(e.target);
        // console.log('data', data.getData())

        // Check if full_description is empty
        const fullDescription = data.getData();
        // if (!fullDescription || fullDescription.trim() === '') {
        //     (window as anyObject).toaster(
        //         'Full description is required',
        //         'warning',
        //     ); // Add 'warning' as second parameter
        //     return; // Stop form submission
        // }

        form_data.append('full_description', data.getData());

        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            setClearImagePreview(true); // Trigger clearing the preview
            // init_nominee();
        }
        e.target.reset();
        setClearImagePreview(true); // Trigger clearing the preview
    }

    const dispatch = useAppDispatch();


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
        let editor = CKEDITOR.replace('full_description');
        setData(editor);
    }, []);

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
                                <h5 className="mb-4">Events Informations</h5>
                                <div className="row">
                                    <div className="col-8">
                                        <div className="form-control form-group">
                                            <label className="mb-4">
                                                {' '}
                                                Full Description
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <div id="full_description"></div>
                                        </div>
                                        <div className="form-group">
                                            <label>
                                                Short Description
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="short_description"
                                                id="short_description"
                                                rows={3}
                                            ></textarea>
                                        </div>

                                        {[
                                            'pre_requisities',
                                            'terms_and_conditions',
                                            'price',
                                            'discount_price',
                                            'poster',
                                        ].map((i) => (
                                            <div className="form-group form-vertical">
                                                {i === 'poster' ? (
                                                    <div className="form-group grid_full_width form-vertical">
                                                        <InputImage
                                                            label={'Poster'}
                                                            name={'poster'}
                                                            clearPreview={
                                                                clearImagePreview
                                                            }
                                                            required={true}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        name={i}
                                                        required={true}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="col-4">
                                        <div className="form_auto_fit">
                                            <div className="form-group form-vertical">
                                                <label>
                                                    Title
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    id="title"
                                                    aria-describedby="titleHelp"
                                                    placeholder="Enter Event Title"
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>
                                                    Place
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="place"
                                                    id="place"
                                                    aria-describedby="placeHelp"
                                                    placeholder="Enter Event Place"
                                                />
                                            </div>

                                            <div className="form-group form-vertical">
                                                <label>Event Categories</label>
                                                <EventCategoryDropDown
                                                    name="event_categories"
                                                    multiple={true}
                                                    get_selected_data={(
                                                        data,
                                                    ) => {
                                                        console.log(data);
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>Event Tags</label>
                                                <EventTagDropDown
                                                    name="event_tags"
                                                    multiple={true}
                                                    get_selected_data={(
                                                        data,
                                                    ) => {
                                                        console.log(data);
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group-container"></div>

                                            {/* RADIO OPTIONS */}
                                            <label>
                                                Event Type{' '}
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <div
                                                className="form-group-container"
                                                style={{ paddingBottom: 10 }}
                                            >
                                                {['online', 'offline'].map(
                                                    (type) => (
                                                        <label
                                                            key={type}
                                                            style={{
                                                                display:
                                                                    'block',
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="event_type"
                                                                value={type}
                                                                checked={
                                                                    get_value(
                                                                        'event_type',
                                                                    ) === type
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    dispatch(
                                                                        storeSlice.actions.set_item(
                                                                            {
                                                                                ...state.item,
                                                                                event_type:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        ),
                                                                    );
                                                                }}
                                                            />
                                                            {type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                type.slice(1)}
                                                        </label>
                                                    ),
                                                )}
                                            </div>

                                            <div className="form-group grid_full_width form-vertical">
                                                <label>
                                                    Reg Start Date
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <DateEl
                                                    value={''}
                                                    name={'reg_start_date'}
                                                    handler={(data) => {
                                                        console.log(
                                                            'arguments',
                                                            data,
                                                        );
                                                    }}
                                                ></DateEl>
                                            </div>
                                            <div className="form-group grid_full_width form-vertical">
                                                <label>
                                                    Reg End Date
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <DateEl
                                                    value={''}
                                                    name={'reg_end_date'}
                                                    handler={(data) => {
                                                        console.log(
                                                            'arguments',
                                                            data,
                                                        );
                                                    }}
                                                ></DateEl>
                                            </div>
                                            <div className="form-group grid_full_width form-vertical">
                                                <label>
                                                    Session Start Date Time
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <DateTime
                                                    value={''}
                                                    name={
                                                        'session_start_date_time'
                                                    }
                                                    handler={(data) => {
                                                        console.log(
                                                            'arguments',
                                                            data,
                                                        );
                                                    }}
                                                ></DateTime>
                                            </div>
                                            <div className="form-group grid_full_width form-vertical">
                                                <label>
                                                    Session End Date Time
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <DateTime
                                                    value={''}
                                                    name={
                                                        'session_end_date_time'
                                                    }
                                                    handler={(data) => {
                                                        console.log(
                                                            'arguments',
                                                            data,
                                                        );
                                                    }}
                                                ></DateTime>
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
