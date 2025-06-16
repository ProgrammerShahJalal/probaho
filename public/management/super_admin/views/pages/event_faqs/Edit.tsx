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
import EventDropDown from '../events/components/dropdown/DropDown';

const Edit: React.FC = () => {
    const state = useSelector((state: RootState) => state[setup.module_name]);
    const dispatch = useAppDispatch();
    const params = useParams();


    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);


    function get_value(key: string) {
        return state.item?.[key] || state.item?.info?.[key] || '';
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await dispatch(update(formData) as any);
    };


    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header page_title={setup.edit_page_title} />
                {Object.keys(state.item).length > 0 && (
                    <div className="content_body custom_scroll">
                        <form onSubmit={handleSubmit} className="mx-auto pt-3">
                            <input type="hidden" name="id" defaultValue={get_value('id')} />
                            
                            <h5 className="mb-4">Input Data</h5>
                            <div>
                                <div className="form-group form-vertical">
                                    <label>Events</label>
                                    <EventDropDown 
                                        name="event_id"
                                        multiple={false}
                                        default_value={get_value('event_id') ? [{ id: get_value('event_id') }] : []}
                                    />
                                </div>

                                <div className="form-group form-vertical">
                                    <Input name="title" value={get_value('title')} />
                                </div>

                                <div className="form-group form-vertical">
                                    <label>Description</label>
                                    <textarea 
                                        name="description" 
                                        defaultValue={get_value('description')} 
                                        className="form-control" 
                                        rows={5} 
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <button type="submit" className="btn btn-outline-info">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                <Footer>
                    {state?.item?.id && (
                        <li>
                            <Link to={`/${setup.route_prefix}/details/${state.item.id}`} className="outline">
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
