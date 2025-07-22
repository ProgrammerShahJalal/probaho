import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
import { getValue } from '../utils/getValue';

export interface Props {}

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

    const renderFieldValue = (fieldName: string) => {
        switch (fieldName) {
            case 'branch_user_id':
                return (
                    <>
                        {state.item[fieldName]?.map((id: number, index: number) => (
                            <span key={id}>
                                {id} - {state.item.users?.find((u: any) => u.id === id)?.name || 'Unknown User'}
                                {index < state.item[fieldName].length - 1 && ', '}
                            </span>
                        ))}
                    </>
                );
            case 'academic_year_id':
                return (
                    <>
                        {state.item[fieldName]?.map((id: number, index: number) => (
                            <span key={id}>
                                {id} - {state.item.academic_years?.find((ay: any) => ay.id === id)?.title || 'Unknown Year'}
                                {index < state.item[fieldName].length - 1 && ', '}
                            </span>
                        ))}
                    </>
                );
            case 'branch_id':
                return (
                    <>
                        {state.item[fieldName]?.map((id: number, index: number) => (
                            <span key={id}>
                                {id} - {state.item.branches?.find((b: any) => b.id === id)?.name || 'Unknown Branch'}
                                {index < state.item[fieldName].length - 1 && ', '}
                            </span>
                        ))}
                    </>
                );
            default:
                return state.item[fieldName];
        }
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
                                        'branch_user_id',
                                        'academic_year_id',
                                        'branch_id',
                                        'title',
                                        'description',
                                        'value',
                                    ].map((i) => (
                                        <tr key={i}>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>
                                                {renderFieldValue(i)}
                                                <br />
                                            </td>
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
                                    <span className="material-symbols-outlined fill">edit_square</span>
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
