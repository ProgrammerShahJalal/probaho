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
import InputFile from './components/management_data_page/InputFile';
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';
import { getValueForEdit } from '../utils/getValue';

export interface Props { }
interface Document {
    key?: string;
    id?: string;
    title: string;
    file: File | string;
    fileName?: string;
    issueDate: string;
    expireDate: string;
}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);

    useEffect(() => {
        if (state.item?.user_documents) {
            try {
                const parsedDocuments = JSON.parse(state.item.user_documents);
                if (Array.isArray(parsedDocuments)) {
                    setDocuments(parsedDocuments.map((doc, index) => ({
                        ...doc,
                        key: doc.id || `temp-existing-${index}-${Date.now()}`,
                        fileName: typeof doc.file === 'string' ? doc.file.split('/').pop() : (doc.file instanceof File ? doc.file.name : doc.fileName || undefined),
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

        form_data.append('user_infos', state.item?.user_infos || '');

        const processedDocuments = documents.map((doc, index) => {
            let fileDataToSend = doc.file;
            if (doc.file instanceof File) {
                form_data.append(`document_files[${index}]`, doc.file, doc.fileName || doc.file.name);
                fileDataToSend = doc.fileName || doc.file.name;
            }

            let currentFileName = doc.fileName;
            if (typeof doc.file === 'string' && !currentFileName) {
                currentFileName = doc.file.split('/').pop();
            }

            return {
                id: doc.id?.toString().startsWith('temp-') ? undefined : doc.id,
                title: doc.title,
                file: fileDataToSend,
                fileName: currentFileName,
                issueDate: doc.issueDate,
                expireDate: doc.expireDate,
            };
        });
        form_data.append('user_documents', JSON.stringify(processedDocuments));

        if (form_data.has('user_documents_text_editor')) {
            form_data.delete('user_documents_text_editor');
        }

        if (!form_data.has('id') && state.item?.id) {
            form_data.append('id', state.item.id.toString());
        }

        const response = await dispatch(update(form_data) as any);
    }

    const handleDocumentFieldChange = (index: number, field: keyof Document, value: any) => {
        const updatedDocuments = documents.map((doc, i) => {
            if (i === index) {
                return { ...doc, [field]: value };
            }
            return doc;
        });
        setDocuments(updatedDocuments);
    };

    const handleDocumentFileChange = (index: number, file: File | null) => {
        const updatedDocuments = documents.map((doc, i) => {
            if (i === index) {
                return {
                    ...doc,
                    file: file ?? '',
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
                key: `temp-new-${documents.length}-${Date.now()}`,
                id: `temp-new-${documents.length}-${Date.now()}`,
                title: '',
                file: '',
                fileName: '',
                issueDate: '',
                expireDate: '',
            },
        ]);
    };

    const removeDocumentForm = (keyToRemove: string) => {
        setDocuments(documents.filter(doc => doc.key !== keyToRemove));
    };

    // function get_value(key) {
    //     try {
    //         let value = state.item[key] ?? state.item?.info?.[key];
    //         if (key === 'role_serial') {
    //             if (typeof value === 'string') {
    //                 try {
    //                     const parsed = JSON.parse(value);
    //                     if (Array.isArray(parsed)) return parsed;
    //                 } catch {
    //                 }
    //             }
    //             if (Array.isArray(value)) return value;
    //             if (typeof value === 'number') return [value];
    //             return [];
    //         }
    //         return value ?? '';
    //     } catch (error) {
    //         return '';
    //     }
    // }

    const handleNumberKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    useEffect(() => {
        const value = getValueForEdit(state, 'base_salary');
        let el = document.querySelector('input[name="base_salary_in_text"]');
        if (el && value) {
            (el as HTMLInputElement).value = (window as any).convertAmount(value).bn + ' টাকা মাত্র';
        }
    }, [getValueForEdit(state, 'base_salary')]);

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
                                            'name',
                                            'phone_number',
                                            'role_serial',
                                            'is_verified',
                                            'is_approved',
                                            'is_blocked',
                                            'gender',
                                            'join_date',
                                            'base_salary',
                                            'photo',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                {i === 'base_salary' ? (
                                                    <>
                                                        <Input
                                                            type='number'
                                                            name={i}
                                                            value={getValueForEdit(state, i)}
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
                                                    <Input name={i} value={getValueForEdit(state, i)} />
                                                ) : i === 'join_date' ? (
                                                    <DateEl
                                                        label="Join Date"
                                                        name={i}
                                                        value={getValueForEdit(state, i) ? String(getValueForEdit(state, i)).slice(0, 10) : ''}
                                                        handler={(data) => dispatch(storeSlice.actions.set_item({ ...state.item, [i]: data.value }))}
                                                    />
                                                ) : i === 'photo' ? (
                                                    <div className="form-group grid_full_width form-vertical">
                                                        <InputImage
                                                            label="Photo"
                                                            name="photo"
                                                            defalut_preview={getValueForEdit(state, 'photo')}
                                                        />
                                                    </div>
                                                ) : i === 'role_serial' ? (
                                                    <>
                                                        <label>
                                                            User Roles
                                                        </label>
                                                        <UserRolesDropDown
                                                            name="role_serial"
                                                            multiple={true}
                                                            default_value={
                                                                getValueForEdit(state,
                                                                    'role_serial',
                                                                )
                                                                    ? [
                                                                        {
                                                                            id: getValueForEdit(state,
                                                                                'role_serial',
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
                                                ) : i === 'gender' ? (
                                                    <>
                                                        <label>
                                                            Gender
                                                            <span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <div className="form_elements">
                                                            <select
                                                            name="gender"
                                                            value={getValueForEdit(state, i)}
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    storeSlice.actions.set_item({
                                                                        ...state.item,
                                                                        [i]: e.target.value,
                                                                    })
                                                                )
                                                            }
                                                            required={false}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="others">Others</option>
                                                        </select>
                                                        </div>
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
                                                                        getValueForEdit(state,
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
                                                                        getValueForEdit(state,
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

                                <div className="mb-4">
                                    <div
                                        style={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#2c2f36',
                                            zIndex: 10,
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid #444'
                                        }}
                                        className="mb-3"
                                    >
                                        <h5 className="mb-0">User Documents</h5>
                                        <button type="button" className="btn btn-sm btn-success" onClick={addNewDocumentForm}>
                                            <span className="material-symbols-outlined fill me-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>add_circle</span>
                                            Add Document
                                        </button>
                                    </div>
                                    {documents.map((doc, index) => (
                                        <div key={doc.key || doc.id || `doc-${index}`} className='mb-3 p-3 border rounded position-relative'>
                                            {documents.length > 0 && (
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
                                                        default_preview_url={typeof doc.file === 'string' ? doc.file : null}
                                                        onChange={(file) => handleDocumentFileChange(index, file)}
                                                    />
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

                                <div>
                                    <h5 className="mb-4">User Information</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'user_infos',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                <TextEditor
                                                    name={i}
                                                    value={getValueForEdit(state, i)}
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
