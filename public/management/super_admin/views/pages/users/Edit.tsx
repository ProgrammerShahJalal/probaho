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

    useEffect(() => {
        // Initialize documents from state.item.user_documents
        if (state.item?.user_documents) {
            try {
                const parsedDocuments = JSON.parse(state.item.user_documents);
                if (Array.isArray(parsedDocuments)) {
                    setDocuments(parsedDocuments.map((doc, index) => ({
                        ...doc,
                        // Ensure a unique key for React rendering, existing id or generate one
                        key: doc.id || `temp-existing-${index}-${Date.now()}`, 
                        fileName: typeof doc.file === 'string' ? doc.file.split('/').pop() : (doc.file instanceof File ? doc.file.name : doc.fileName || undefined),
                        // file itself is already in doc.file
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
            let fileDataToSend = doc.file; // This could be a URL string or a File object

            if (doc.file instanceof File) {
                // If it's a File object, append it to FormData
                form_data.append(`document_files[${index}]`, doc.file, doc.fileName || doc.file.name);
                // For the JSON part, we'll send the fileName
                fileDataToSend = doc.fileName || doc.file.name;
            }
            
            // Ensure fileName is set if file is a string path (for existing files not changed)
            let currentFileName = doc.fileName;
            if (typeof doc.file === 'string' && !currentFileName) {
                currentFileName = doc.file.split('/').pop();
            }


            return {
                id: doc.id?.toString().startsWith('temp-') ? undefined : doc.id, // Don't send temp IDs
                title: doc.title,
                file: fileDataToSend, // This will be string (path or new filename)
                fileName: currentFileName, // Keep original filename or new one
                issueDate: doc.issueDate,
                expireDate: doc.expireDate,
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

    // Handler to update a specific field of a document
    const handleDocumentFieldChange = (index: number, field: keyof Document, value: any) => {
        const updatedDocuments = documents.map((doc, i) => {
            if (i === index) {
                return { ...doc, [field]: value };
            }
            return doc;
        });
        setDocuments(updatedDocuments);
    };

    // Handler for file changes in a document
    const handleDocumentFileChange = (index: number, file: File | null) => {
        const updatedDocuments = documents.map((doc, i) => {
            if (i === index) {
                return { 
                    ...doc, 
                    file: file ?? '', // Ensure file is never null, fallback to empty string
                    fileName: file ? file.name : undefined 
                };
            }
            return doc;
        });
        setDocuments(updatedDocuments);
    };
    
    const addNewDocumentForm = () => {
        setDocuments([
            ...documents,
            {
                key: `temp-new-${documents.length}-${Date.now()}`, // Unique key for new form
                id: `temp-new-${documents.length}-${Date.now()}`, // Temporary ID for new documents
                title: '',
                file: '', // Store path or File object
                fileName: '',
                issueDate: '',
                expireDate: '',
            },
        ]);
    };

    const removeDocumentForm = (keyToRemove: string) => {
        setDocuments(documents.filter(doc => doc.key !== keyToRemove));
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
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">User Documents</h5>
                                        <button type="button" className="btn btn-sm btn-success" onClick={addNewDocumentForm}>
                                            <span className="material-symbols-outlined fill me-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>add_circle</span>
                                            Add Document
                                        </button>
                                    </div>

                                    {documents.map((doc, index) => (
                                        <div key={doc.key || doc.id || `doc-${index}`} className='mb-3 p-3 border rounded position-relative'>
                                            {documents.length > 0 && ( // Show remove button only if there's at least one doc form
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-2 me-2"
                                                    onClick={() => removeDocumentForm(doc.key!)}
                                                    style={{ lineHeight: '1', padding: '0.25rem 0.5rem' }}
                                                    title="Remove this document entry"
                                                >
                                                    <span className="material-symbols-outlined fill" style={{ fontSize: '16px', verticalAlign: 'middle' }}>delete</span>
                                                </button>
                                            )}
                                            {/* <h6 className="mb-3">Document {index + 1}</h6> */}
                                            <div className="form_auto_fit">
                                                <div className="form-group form-vertical">
                                                    <Input
                                                        label="Document Title"
                                                        name={`documents[${index}].title`}
                                                        value={doc.title}
                                                        onChange={(e) => handleDocumentFieldChange(index, 'title', e.target.value)}
                                                        placeholder="Enter document title"
                                                    />
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <InputFile
                                                        label="Document File"
                                                        name={`documents[${index}].file`}
                                                        default_file_name={typeof doc.file === 'string' && doc.file.includes('/') ? doc.file.split('/').pop() : doc.fileName}
                                                        default_preview_url={typeof doc.file === 'string' ? doc.file : null} // Pass the file URL as default_preview_url
                                                        onChange={(file) => handleDocumentFileChange(index, file)}
                                                    />
                                                    {/* Display existing file name if not a File object yet and not handled by InputFile's default - This might be redundant now with InputFile's own display */}
                                                    {/* {typeof doc.file === 'string' && doc.file && (!(typeof File !== 'undefined' && (doc.file as any) instanceof File)) && !doc.fileName && (
                                                        <small className="d-block mt-1">Current file: {doc.file.split('/').pop()}</small>
                                                    )} */}
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <DateEl
                                                        label="Issue Date"
                                                        name={`documents[${index}].issueDate`}
                                                        value={doc.issueDate}
                                                        handler={(data) => handleDocumentFieldChange(index, 'issueDate', data.value)}
                                                    />
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <DateEl
                                                        label="Expire Date"
                                                        name={`documents[${index}].expireDate`}
                                                        value={doc.expireDate}
                                                        handler={(data) => handleDocumentFieldChange(index, 'expireDate', data.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {documents.length === 0 && (
                                        <p className="text-muted">No documents added. Click "Add Document" to get started.</p>
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
