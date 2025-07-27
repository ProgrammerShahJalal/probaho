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
import UsersDropDown from '../users/components/dropdown/DropDown';
import AcademicYearsDropDown from '../academic_year/components/dropdown/DropDown';
import { getValueForEdit } from '../utils/getValue';


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
                                    {state.item.is_locked && (
                                        <div className="alert alert-warning">
                                            This academic year is locked and cannot be edited.
                                        </div>
                                    )}
                                    
                                    {/* Row 1: Branch User and Academic Year */}
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <div className="form-group form-vertical">
                                                <label>Branch User</label>
                                                <UsersDropDown
                                                    name="branch_user_id"
                                                    multiple={false}
                                                    default_value={
                                                        getValueForEdit(state, 'branch_user_id')
                                                            ? [
                                                                {
                                                                    id: getValueForEdit(state, 'branch_user_id'),
                                                                },
                                                            ]
                                                            : []
                                                    }
                                                    get_selected_data={(data) =>
                                                        console.log(data)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group form-vertical">
                                                <label>Academic Year</label>
                                                <AcademicYearsDropDown
                                                    name="academic_year_id"
                                                    multiple={false}
                                                    default_value={
                                                        getValueForEdit(state, 'academic_year_id')
                                                            ? [
                                                                {
                                                                    id: getValueForEdit(state, 'academic_year_id'),
                                                                },
                                                            ]
                                                            : []
                                                    }
                                                    get_selected_data={(data) =>
                                                        console.log(data)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Title */}
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <div className="form-group form-vertical">
                                                <Input name="title" value={getValueForEdit(state, 'title')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Description */}
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <div className="form-group form-vertical">
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    className="form-control"
                                                    rows={4}
                                                    defaultValue={getValueForEdit(state, 'description')}
                                                    placeholder="Enter description..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 4: Value */}
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <div className="form-group form-vertical">
                                                <label>Value</label>
                                                <textarea
                                                    name="value"
                                                    className="form-control"
                                                    rows={3}
                                                    defaultValue={getValueForEdit(state, 'value')}
                                                    placeholder="Enter value..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label></label>
                                        <div className="form_elements">
                                            <button className="btn btn-outline-info" disabled={state.item.is_locked}>
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
