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
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';

export interface Props { }
interface Document {
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
    // State for managing documents
    const [documents, setDocuments] = useState<Document[]>([]);
    const [docTitle, setDocTitle] = useState('');
    const [docFile, setDocFile] = useState<File | null>(null);
    const [docIssueDate, setDocIssueDate] = useState('');
    const [docExpireDate, setDocExpireDate] = useState('');

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);

    useEffect(() => {
        // Initialize documents from state.item.user_documents
        if (state.item?.user_documents) {
            try {
                const parsedDocuments = JSON.parse(state.item.user_documents);
                if (Array.isArray(parsedDocuments)) {
                    setDocuments(parsedDocuments.map(doc => ({
                        ...doc,
                        fileName: typeof doc.file === 'string' ? doc.file.split('/').pop() : undefined,
                    })));
                }
            } catch (error) {
                console.error("Failed to parse user_documents JSON:", error);
                setDocuments([]);
            }
        } else {
            setDocuments([]);
        }
    }, [state.item?.user_documents]);


    async function handle_submit(e) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        let form_data = new FormData(form);

        // Append user_infos directly from state or an empty string if not present
        form_data.append('user_infos', state.item?.user_infos || '');

        const processedDocuments = documents.map((doc, index) => {
            let fileIdentifier = doc.file; // Could be a URL string or a File object

            if (doc.file instanceof File) {
                form_data.append(`document_file_${index}`, doc.file);
                // For backend processing, send the original file name or a reference
                fileIdentifier = doc.file.name;
            }

            return {
                title: doc.title,
                file: fileIdentifier, // Send filename or existing URL/path
                fileName: doc.fileName || (doc.file instanceof File ? doc.file.name : undefined),
                issueDate: doc.issueDate,
                expireDate: doc.expireDate,
                id: doc.id // Keep id if present
            };
        });

        form_data.append('user_documents', JSON.stringify(processedDocuments));

        // Remove the default user_documents if it was part of form elements to avoid duplication
        if (form_data.has('user_documents_text_editor')) { // Assuming a name for the old text editor if it was a form field
            form_data.delete('user_documents_text_editor');
        }

        // Append other fields that might not be automatically picked up if they are not standard inputs
        // For example, if 'id' is not part of the form elements but is needed by the backend
        if (!form_data.has('id') && state.item?.id) {
            form_data.append('id', state.item.id.toString());
        }

        const response = await dispatch(update(form_data) as any);
        // TODO: Handle response, e.g., show success/error message
    }

    const handleAddDocument = () => {
        if (!docTitle || !docFile || !docIssueDate || !docExpireDate) {
            alert('Please fill all document fields.');
            return;
        }
        const newDocument: Document = {
            title: docTitle,
            file: docFile,
            fileName: docFile.name,
            issueDate: docIssueDate,
            expireDate: docExpireDate,
            id: `temp-${Date.now()}` // Temporary ID for new documents
        };
        setDocuments([...documents, newDocument]);
        // Reset document input fields
        setDocTitle('');
        setDocFile(null);
        const fileInput = document.getElementById('docFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        setDocIssueDate('');
        setDocExpireDate('');
    };

    const handleRemoveDocument = (docIdToRemove: string) => {
        setDocuments(documents.filter(doc => doc.id !== docIdToRemove));
    };

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    // Prevent 'e' and other non-numeric characters in number input
    const handleNumberKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

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
                                    <h5 className="mb-4">Input Data</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'name',
                                            'phone_number',
                                            'role',
                                            'is_verified',
                                            'is_approved',
                                            'is_blocked',
                                            'photo',
                                            'join_date',
                                            'base_salary',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                {i === 'base_salary' ? (
                                                    <>
                                                        <Input
                                                            type='number'
                                                            name={i}
                                                            value={get_value(i)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                dispatch(storeSlice.actions.set_item({
                                                                    ...state.item,
                                                                    [i]: value,
                                                                }));
                                                                let el = document.querySelector('input[name="base_salary_in_text"]');
                                                                if (el) {
                                                                    (el as HTMLInputElement).value = value ? (window as any).convertAmount(value).bn + ' টাকা মাত্র' : '';
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberKeyDown}
                                                        />
                                                        <div className="form-group form-vertical mt-2">
                                                            <input
                                                                type="text"
                                                                name="base_salary_in_text"
                                                                id="base_salary_in_text"
                                                                readOnly
                                                                className="form-control mt-1"
                                                                placeholder="Base salary in words"
                                                            />
                                                        </div>
                                                    </>
                                                ) : i === 'name' || i === 'phone_number' ? (
                                                    <Input name={i} value={get_value(i)} />
                                                ) : i === 'join_date' ? (
                                                    <DateEl
                                                        label="Join Date"
                                                        name={i}
                                                        value={get_value(i) ? String(get_value(i)).slice(0, 10) : ''}
                                                        handler={(data) => dispatch(storeSlice.actions.set_item({ ...state.item, [i]: data.value }))}
                                                    />
                                                ) : i === 'photo' ? (
                                                    <div className="form-group grid_full_width form-vertical">
                                                        <InputImage
                                                            label="Photo"
                                                            name="photo"
                                                            defalut_preview={get_value('photo')}
                                                        />
                                                    </div>
                                                ) : i === 'role' ? (
                                                    <>
                                                        <label>
                                                            User Roles
                                                        </label>
                                                        <UserRolesDropDown
                                                            name="role"
                                                            multiple={false}
                                                            default_value={
                                                                get_value(
                                                                    'role',
                                                                )
                                                                    ? [
                                                                        {
                                                                            id: get_value(
                                                                                'role',
                                                                            ),
                                                                        },
                                                                    ]
                                                                    : []
                                                            }
                                                            get_selected_data={(
                                                                data,
                                                            ) =>
                                                                console.log(
                                                                    data,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <div>
                                                        <label>{i}</label>
                                                        <div>
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name={i}
                                                                    value="1"
                                                                    checked={
                                                                        get_value(
                                                                            i,
                                                                        ) == '1'
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        dispatch(
                                                                            storeSlice.actions.set_item(
                                                                                {
                                                                                    ...state.item,
                                                                                    [i]: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            ),
                                                                        )
                                                                    }
                                                                />{' '}
                                                                Yes
                                                            </label>
                                                            <label className="">
                                                                <input
                                                                    type="radio"
                                                                    name={i}
                                                                    value="0"
                                                                    checked={
                                                                        get_value(
                                                                            i,
                                                                        ) == '0'
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        dispatch(
                                                                            storeSlice.actions.set_item(
                                                                                {
                                                                                    ...state.item,
                                                                                    [i]: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            ),
                                                                        )
                                                                    }
                                                                />{' '}
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-4">User Informations</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'user_infos',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">

                                                {/* <label>{i.replaceAll('_', ' ')}</label> */}
                                                <TextEditor
                                                    name={i}
                                                    value={get_value(i)}
                                                    onChange={(value) =>
                                                        dispatch(
                                                            storeSlice.actions.set_item({
                                                                ...state.item,
                                                                [i]: value,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* User Documents Section */}
                                <div>
                                    <h5 className="mb-4">User Documents</h5>
                                    {/* Inputs for adding a new document */}
                                    <div className="form_auto_fit mb-3 p-3 border rounded">
                                        <h6>Add New Document</h6>
                                        <div className="form-group form-vertical">
                                            <label>Document Title</label>
                                            <input type="text" className="form-control" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <label>Document File</label>
                                            <input type="file" id="docFileInput" className="form-control" onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)} />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <label>Issue Date</label>
                                            <input type="date" className="form-control" value={docIssueDate} onChange={(e) => setDocIssueDate(e.target.value)} />
                                        </div>
                                        <div className="form-group form-vertical">
                                            <label>Expire Date</label>
                                            <input type="date" className="form-control" value={docExpireDate} onChange={(e) => setDocExpireDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-sm btn-info mt-2" onClick={handleAddDocument}>Add Document</button>

                                    {/* List of added documents */}
                                    {documents.length > 0 && (
                                        <div className="mt-4">
                                            <h6>Uploaded Documents</h6>
                                            <ul className="list-group">
                                                {documents.map((doc, index) => (
                                                    <li key={doc.id || `doc-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>{doc.title}</strong><br />
                                                            <small>File: {doc.fileName || (doc.file instanceof File ? doc.file.name : 'No file selected/retained')}</small><br />
                                                            <small>Issue Date: {doc.issueDate}</small><br />
                                                            <small>Expire Date: {doc.expireDate}</small>
                                                        </div>
                                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveDocument(doc.id!)}>Remove</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {/* End of User Documents Section */}

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
