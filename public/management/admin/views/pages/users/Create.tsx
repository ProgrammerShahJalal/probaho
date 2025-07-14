import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import Select from './components/management_data_page/Select';
import InputImage from './components/management_data_page/InputImage';
import InputFile from './components/management_data_page/InputFile';
import { anyObject } from '../../../common_types/object';
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import { getValue } from '../utils/getValue';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';
import BloodGroupSelector from './components/management_data_page/BloodGroupSelector';

export interface Props { }
interface Document {
    key: string;
    title: string;
    file: File | string;
    fileName?: string;
    issueDate: string;
    expireDate: string;
}
interface UserInfo {
    key: string;
    title: string;
    type: 'text' | 'file';
    description: string | File;
}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [data, setData] = useState<anyObject>({});
    const [documents, setDocuments] = useState<Document[]>([]);
    const [userInfos, setUserInfos] = useState<UserInfo[]>([]);
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        // Append user_infos from state
        // form_data.append('user_infos', data['user_infos'] || '');
        const processedUserInfos = userInfos.map((info, index) => {
            if (info.type === 'file' && info.description instanceof File) {
                form_data.append(`info_files[${index}]`, info.description);
                return {
                    title: info.title,
                    type: info.type,
                    description: info.description.name,
                };
            }
            return info;
        });

        form_data.append('user_infos', JSON.stringify(processedUserInfos));

        // Process documents
        const processedDocuments = documents.map((doc, index) => {
            let fileDataToSend = doc.file;
            if (doc.file instanceof File) {
                form_data.append(`document_files[${index}]`, doc.file, doc.fileName || doc.file.name);
                fileDataToSend = doc.fileName || doc.file.name;
            }
            return {
                title: doc.title,
                file: fileDataToSend,
                fileName: doc.fileName || (typeof doc.file === 'string' ? doc.file.split('/').pop() : undefined),
                issueDate: doc.issueDate,
                expireDate: doc.expireDate,
            };
        });
        form_data.append('user_documents', JSON.stringify(processedDocuments));
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            setData({});
            setDocuments([]);
            setUserInfos([]);
        }
    }

    const handleUserInfoFieldChange = (index: number, field: keyof UserInfo, value: any) => {
        const updatedUserInfos = userInfos.map((info, i) => {
            if (i === index) {
                const newInfo = { ...info, [field]: value };
                if (field === 'type') {
                    newInfo.description = '';
                }
                return newInfo;
            }
            return info;
        });
        setUserInfos(updatedUserInfos);
    };

    const addNewUserInfoForm = () => {
        setUserInfos([
            ...userInfos,
            {
                key: `temp-new-${userInfos.length}-${Date.now()}`,
                title: '',
                type: 'text',
                description: '',
            },
        ]);
    };

    const removeUserInfoForm = (keyToRemove: string) => {
        setUserInfos(userInfos.filter(info => info.key !== keyToRemove));
    };

    useEffect(() => {
        if (getValue(state, 'role')) {
            setData((prevData) => ({
                ...prevData,
                role: getValue(state, 'role'),
            }));
        }
    }, [state.item]);

    const handleRoleSelection = useCallback((selectedRole) => {
        setData((prevData) => ({
            ...prevData,
            role: selectedRole.id,
        }));
    }, []);

    // Prevent 'e' and other non-numeric characters in number input
    const handleNumberKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    // Update base_salary_in_text when base_salary changes
    useEffect(() => {
        const value = data['base_salary'] || '';
        let el = document.querySelector('input[name="base_salary_in_text"]');
        if (el) {
            (el as HTMLInputElement).value = value ? (window as any).convertAmount(value).bn + ' টাকা মাত্র' : '';
        }
    }, [data['base_salary']]);

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
                    file: file ?? '',
                    fileName: file ? file.name : undefined,
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

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="mx-auto pt-3"
                        >
                            <div>
                                <h5 className="mb-4">Basic Informations</h5>
                                <div className="form_auto_fit">
                                    {[
                                        'name',
                                        'role_serial',
                                        'email',
                                        'gender',
                                        'phone_number',
                                        'blood_group',
                                        'join_date',
                                        'password',
                                        'photo',
                                        'base_salary',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {i === 'role_serial' ? (
                                                <>
                                                    <label>
                                                        User Roles
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </label>
                                                    <UserRolesDropDown
                                                        name="role_serial"
                                                        multiple={true}
                                                        get_selected_data={
                                                            handleRoleSelection
                                                        }
                                                    />
                                                </>
                                            ) : i === 'gender' ? (
                                                <>
                                                    <label>
                                                        Gender
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </label>
                                                    <div className="form_elements">
                                                        <select
                                                            name="gender"
                                                            required={true}
                                                            value={data[i] || ''}
                                                            onChange={(e) =>
                                                                setData((prev) => ({
                                                                    ...prev,
                                                                    [i]: e.target.value,
                                                                }))
                                                            }
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="others">Others</option>
                                                        </select>
                                                    </div>

                                                </>
                                            ) : i === 'blood_group' ? (
                                                <BloodGroupSelector
                                                    name={i}
                                                    value={data[i] || ''}
                                                    onChange={(e) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            [i]: e.target.value,
                                                        }))
                                                    }
                                                    required={true}
                                                />
                                            ) : i === 'photo' ? (
                                                <div className="form-group grid_full_width form-vertical">
                                                    <InputImage
                                                        required={true}
                                                        label="Photo"
                                                        name="photo"
                                                        defalut_preview={getValue(state,
                                                            'photo',
                                                        )}
                                                    />
                                                </div>
                                            ) : i === 'join_date' ? (
                                                <DateEl
                                                    label='Join Date'
                                                    name={i}
                                                    value={data[i] || ''}
                                                    handler={(d) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            [i]: d.value,
                                                        }))
                                                    }
                                                />
                                            ) : i === 'base_salary' ? (
                                                <>
                                                    <Input
                                                        type="number"
                                                        name={i}
                                                        value={data[i] || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData((prev) => ({
                                                                ...prev,
                                                                [i]: value,
                                                            }));
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
                                            ) : (
                                                <Input
                                                    name={i}
                                                    required={
                                                        i !== 'base_salary' &&
                                                        i !== 'join_date'
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Documents Section */}
                            <div className="mb-4">
                                <div
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: '#2c2f36',
                                        zIndex: 10,
                                        marginTop: '130px',
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
                                    <div key={doc.key} className='mb-3 p-3 border rounded position-relative'>
                                        {documents.length > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-2 me-2"
                                                onClick={() => removeDocumentForm(doc.key)}
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
                                                    value={doc.issueDate}
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
                                <div
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: '#2c2f36',
                                        zIndex: 10,
                                        marginTop: '20px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #444'
                                    }}
                                    className="mb-3"
                                >
                                    <h5 className="mb-0">User Informations</h5>
                                    <button type="button" className="btn btn-sm btn-success" onClick={addNewUserInfoForm}>
                                        <span className="material-symbols-outlined fill me-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>add_circle</span>
                                        Add User Info
                                    </button>
                                </div>

                                {userInfos.map((info, index) => (
                                    <div key={info.key} className='mb-3 p-3 border rounded position-relative'>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 mt-2 me-2"
                                            onClick={() => removeUserInfoForm(info.key)}
                                            style={{ lineHeight: '1', padding: '0.25rem 0.5rem' }}
                                            title="Remove this user info entry"
                                        >
                                            <span className="material-symbols-outlined fill" style={{ fontSize: '16px', verticalAlign: 'middle' }}>delete</span>
                                        </button>
                                        <div className="form_auto_fit">
                                            <div className="form-group form-vertical">
                                                <Input
                                                    label="Title"
                                                    name={`user_infos[${index}].title`}
                                                    value={info.title}
                                                    onChange={(e) => handleUserInfoFieldChange(index, 'title', e.target.value)}
                                                    placeholder="Enter title"
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>Type</label>
                                                <select
                                                    name={`user_infos[${index}].type`}
                                                    value={info.type}
                                                    onChange={(e) => handleUserInfoFieldChange(index, 'type', e.target.value as 'text' | 'file')}
                                                    className="form-control"
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="file">File</option>
                                                </select>
                                            </div>
                                            <div className="form-group form-vertical">
                                                {info.type === 'text' ? (
                                                    <>
                                                    <label>Description</label>
                                                    <textarea
                                                        name={`user_infos[${index}].description`}
                                                        value={info.description as string}
                                                        onChange={(e) => handleUserInfoFieldChange(index, 'description', e.target.value)}
                                                        className="form-control"
                                                        placeholder="Enter description"
                                                    />
                                                    </>
                                                ) : (
                                                    <InputFile
                                                        label="Description File"
                                                        name={`user_infos[${index}].description`}
                                                        onChange={(file) => handleUserInfoFieldChange(index, 'description', file)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {userInfos.length === 0 && (
                                    <p className="text-muted">No user infos added. Click "Add User Info" to get started.</p>
                                )}
                            </div>

                            <div className="form-group form-vertical">
                                <label></label>
                                <div className="form_elements">
                                    <button className="btn btn_1 btn-outline-info">
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
