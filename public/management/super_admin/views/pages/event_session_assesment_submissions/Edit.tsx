import React, { useEffect, useRef, useState } from 'react';
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
import Select from 'react-select';
import DateEl from '../../components/DateEl';
import EventDropDown from "../events/components/dropdown/DropDown";
import SessionDropDown from "../event_sessions/components/dropdown/DropDown";


export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    const editorRef = useRef<any>(null); // Ref for CKEditor instance
    const [data, setData] = useState<string>(''); // State for CKEditor content


    // Fetch details when component mounts
    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);

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
                    <Header page_title={'Assign Marks to Event Session Assesment Submissons'}></Header>

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
                                <input
                                    type="hidden"
                                    name="event_session_assesment_id"
                                    defaultValue={get_value(`event_session_assesment_id`)}
                                />

                                <div>
                                    <div>
                                        <h2 style={{
                                            cursor: 'text'!,
                                        }} className='mb-4'>Submitted Content</h2>
                                    </div>
                                    <div>

                                        {[
                                            'submitted_content',
                                            'mark',
                                            'obtained_mark',
                                            'grade',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                {
                                                    i === 'mark' ? (
                                                        <>
                                                            <h6>Mark: {get_value(i)}</h6>
                                                        </>
                                                    ) : (
                                                        i === 'submitted_content' ? (
                                                            <div
                                                                className="post-content"
                                                                dangerouslySetInnerHTML={{ __html: get_value(i) }}
                                                            />
                                                        ) : i === 'obtained_mark' ? (
                                                            <Input type='number' name={i} value={get_value(i)} />
                                                        ): (
                                                            <Input name={i} value={get_value(i)} />
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
