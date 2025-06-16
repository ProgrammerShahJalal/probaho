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

            // Handle nested blog object
            if (key === 'event_id' && state.item.event) {
                return state.item.event.title;
            }

            // Handle nested event session object
            if (key === 'event_session_id' && state.item.session) {
                return state.item.session.title;
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

                            <table className="table quick_modal_table table-hover">
                                <tbody>
                                    {[
                                        { key: 'event_id', label: 'Event Title' },
                                        { key: 'event_session_id', label: 'Session Title' },
                                        { key: 'title', label: ' Assesment Title' },
                                        { key: 'mark' },
                                        { key: 'pass_mark', label: 'Pass Mark' },
                                        { key: 'start', formatter: formatTime },
                                        { key: 'end', formatter: formatTime },
                                        { key: 'status' },
                                    ].map(({ key, label, formatter }) => (
                                        <tr key={key}>
                                            <td>{label || key.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>{formatter ? formatter(get_value(key)) : get_value(key)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                    <div className="text">Edit</div>
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
