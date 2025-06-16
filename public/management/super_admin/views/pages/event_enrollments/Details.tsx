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
                return `${state.item.user.first_name} ${state.item.user.last_name}`;
            }

            // Handle nested event object
            if (key === 'event_id' && state.item.event) {
                return state.item.event.title;
            }

            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }



    let formateDate = (date: string) => {
        return moment(date).format('Do MMM YY');
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
                                        { key: 'user_id', label: 'User Name' },
                                        { key: 'date', formatter: formateDate },
                                        { key: 'is_paid', formatter: (val) => val === '1' ? 'Yes' : 'No' },
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
