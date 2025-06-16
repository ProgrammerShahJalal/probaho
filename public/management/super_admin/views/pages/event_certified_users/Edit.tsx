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
import InputImage from './components/management_data_page/InputImage';
import Select from 'react-select';
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

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);


    let statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'deactive', label: 'Deactive' },
    ];



    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
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
                                      
                                        {[
                                            'scores',
                                            'grade',
                                            'date',
                                            'is_submitted',
                                            'image',

                                        ].map((i) => (
                                            <div className="form-group form-vertical">
                                                {i === 'date' ? (
                                                <>
                                                    <label>Date</label>
                                                    <DateEl
                                                        value={get_value('date')}
                                                        name="date"
                                                        handler={() => console.log('Date added')}
                                                    />
                                                </>
                                            ) : i === 'is_submitted' ? (
                                                <>
                                                    <label>Is Submitted?</label>
                                                    <div className='flex flex-1'>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="is_submitted"
                                                                value="1"
                                                                defaultChecked={get_value('is_submitted') === 1}
                                                            />{' '}
                                                            Yes
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="is_submitted"
                                                                value="0"
                                                                defaultChecked={get_value('is_submitted') !== 1}
                                                            />{' '}
                                                            No
                                                        </label>
                                                    </div>
                                                </>
                                            ) :
                                                (

                                                    i === 'image' ? (
                                                        <div className="form-group grid_full_width form-vertical">
                                                            <InputImage
                                                                label={'image'}
                                                                name={'image'}
                                                                defalut_preview={get_value(
                                                                    'image',
                                                                )}
                                                            />

                                                        </div>
                                                    ) : (
                                                        <Input
                                                            name={i}
                                                            value={get_value(i)}
                                                        />
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
