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
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    let formateDate = (date: string) => {
         return moment(date).format('Do MMM YY');
    }
    let formateDateTime = (date: string) => {
        return moment(date).format('Do MMM YY, h:mm:ss A');
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
                                        'title',
                                        'place',
                                        'event_type',
                                        'price',
                                        'discount_price',
                                    ].map((i) => (
                                        <tr>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            {
                                                i === 'price' || i === 'discount_price' ? (
                                                    <td>${get_value(i)}</td>
                                                ): (
                                                    <td>{get_value(i)}</td>
                                                )
                                            }
                                        </tr>
                                    ))}
                                    {[
                                        'reg_start_date',
                                        'reg_end_date',
                                    ].map((i) => (
                                        <tr>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>{formateDate(get_value(i))}</td>
                                        </tr>
                                    ))}
                                    {[
                                        'session_start_date_time',
                                        'session_end_date_time',
                                    ].map((i) => (
                                        <tr>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>{formateDateTime(get_value(i))}</td>
                                        </tr>
                                    ))}

                                    {[
                                        'poster',
                                    ].map((i) => (
                                        <tr>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>
                                                <div

                                                    style={{
                                                        maxWidth: '30px',
                                                        aspectRatio: '4/4',
                                                    }}
                                                >
                                                    <img
                                                        className='w-100'
                                                        src={get_value(i)}
                                                        alt={get_value(i)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}



                                    {[
                                        'status',
                                    ].map((i) => (
                                        <tr>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>{get_value(i)}</td>
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
