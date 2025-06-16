import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
export interface Props { }

const Details: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    function get_value(key) {
        try {

            // Handle nested user object
            if (key === 'user_id' && state.item.user) {
                return state.item.user.first_name + " " + state.item.user.last_name;
            }
            // Handle nested event object
            if (key === 'event_id' && state.item.event) {
                return state.item.event.title;
            }
            // Handle nested session object
            if (key === 'event_session_id' && state.item.session) {
                return state.item.session.title;
            }
            // Handle nested session object
            if (key === 'event_session_assesment_id' && state.item.assesment) {
                return state.item.assesment.title;
            }

            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    let formatTime = (time: string) => {
        return moment(time, 'HH:mm').format('h:mmA');
    };


    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.details_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">

                            
                                
                                    {[
                                        { key: 'submitted_content' },
                                        { key: 'event_id', label: 'Event Title' },
                                        { key: 'event_session_id', label: 'Session Title' },
                                        { key: 'event_session_assesment_id', label: 'Assessment Title' },
                                        { key: 'user_id', label: 'User Name' },
                                        { key: 'mark' },
                                        {
                                            key: 'obtained_mark',
                                            formatter: (value) => value || 'N/A'
                                        },
                                        {
                                            key: 'grade',
                                            formatter: (value) => value || 'N/A'
                                        },
                                    ].map(({ key, label, formatter }) => (

                                        key === 'submitted_content' ? (
                                            <div
                                            key={key}
                                                className="post-content form-group form-vertical"
                                                dangerouslySetInnerHTML={{ __html: get_value(key) }}
                                            />
                                        ) : (
                                            <table key={key} className="table quick_modal_table table-hover">
                                                <tbody>
                                                <tr key={key}>
                                                <td>{label || key.replaceAll('_', ' ')}</td>
                                                <td>:</td>
                                                <td>{formatter ? formatter(get_value(key)) : get_value(key)}</td>
                                            </tr>
                                                </tbody>
                                            </table>
                                            
                                        )

                                    ))}
                                
                            
                        </div>
                    )}

                    <Footer>
                        {state.item?.id && (
                            <li>
                                <Link
                                    to={`/${setup.route_prefix}/edit/${state.item.id}`}
                                    className="btn-outline-info outline"
                                >
                                    <span className="material-symbols-outlined fill">
                                        edit_square
                                    </span>
                                    <div className="text">Assign Marks</div>
                                </Link>
                            </li>
                        )}
                    </Footer>
                </div>
            </div>
        </>
    );
};

export default Details;
