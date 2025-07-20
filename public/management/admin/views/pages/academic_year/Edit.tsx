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
// import InputImage from './components/management_data_page/InputImage'; // InputImage is used for user photo
import InputImage from './components/management_data_page/InputImage';
import InputFile from './components/management_data_page/InputFile'; // Import the new InputFile component
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';
import { getValueForEdit } from '../utils/getValue';
import Select from './components/management_data_page/Select';

export interface Props { }
interface Document {
    key?: string; // Optional: for React rendering
    id?: string; // Optional: for existing documents
    title: string;
    file: File | string; // File object for new/updated files, string (URL/path) for existing
    fileName?: string; // To display the name of an existing file
    issueDate: string;
    expireDate: string;
}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    // State for managing documents - each item will now have its own complete state
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);


    async function handle_submit(e) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        let form_data = new FormData(form);
        const response = await dispatch(update(form_data) as any);
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
                                    defaultValue={getValueForEdit(state, `id`)}
                                />

                                <div>
                                    <h5 className="mb-4">Input Data</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'title',
                                            'start_month',
                                            'end_month',
                                            'is_locked',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                {i === 'start_month' || i === 'end_month' ? (
                                                    <DateEl
                                                        label={i}
                                                        name={i}
                                                        value={getValueForEdit(state, i) ? String(getValueForEdit(state, i)).slice(0, 10) : ''}
                                                        handler={(data) => dispatch(storeSlice.actions.set_item({ ...state.item, [i]: data.value }))}
                                                    />
                                                ) : (
                                                    i === 'is_locked' ? (
                                                        <Select
                                                            name={i}
                                                            value={getValueForEdit(state, i)}
                                                            values={[
                                                                { value: '0', text: 'No' },
                                                                { value: '1', text: 'Yes' },
                                                            ]}
                                                        />
                                                    ) : (
                                                        <Input name={i} value={getValueForEdit(state, i)} />
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-group form-vertical">
                                            <label></label>
                                            <div className="form_elements">
                                                <button className="btn btn-outline-info">
                                                    submit
                                                </button>
                                            </div>
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
