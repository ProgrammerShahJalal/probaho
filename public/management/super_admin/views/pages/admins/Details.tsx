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

    // Function to convert base_salary to words
    function convertSalaryToWords(value) {
        try {
            if (value && (window as any).convertAmount) {
                return `${(window as any).convertAmount(value).bn} টাকা মাত্র`;
            }
            return 'N/A';
        } catch (error) {
            console.error('Error converting salary to words:', error);
            return 'N/A';
        }
    }

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.details_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <div className="details_page_profile_image">
                                <img
                                    src={
                                        state.item.photo
                                            ? (state.item.photo.startsWith('http')
                                                ? state.item.photo
                                                : `/${state.item.photo}`)
                                            : '/assets/dashboard/images/avatar.png'
                                    }
                                />
                            </div>
                            <table className="table quick_modal_table table-hover">
                                <tbody>
                                    {[
                                        'uid',
                                        'role_serial',
                                        'name',
                                        'email',
                                        'phone_number',
                                        'is_verified',
                                        'is_approved',
                                        'is_blocked',
                                        'join_date',
                                        'base_salary',
                                    ].map((i) => (
                                        <tr key={i}>
                                            <td>{i.replaceAll('_', ' ')}</td>
                                            <td>:</td>
                                            <td>
                                                {['is_verified', 'is_approved', 'is_blocked'].includes(i)
                                                    ? getValue(state, i) === '1'
                                                        ? 'Yes'
                                                        : 'No'
                                                    : i === 'join_date' && getValue(state, i)
                                                    ? moment.utc(getValue(state, i)).local().format('DD MMMM YYYY')
                                                    : getValue(state, i)
                                                    ? getValue(state, i)
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Add row for base_salary in words */}
                                    <tr>
                                        <td>Base Salary in Words</td>
                                        <td>:</td>
                                        <td>{convertSalaryToWords(getValue(state, 'base_salary'))}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* User Informations Section */}
                            <div className="details_section mt-4">
                                <h5 className="details_section_title mb-3">User Informations</h5>
                                {(() => {
                                    const userInfosJson = getValue(state, 'user_infos');
                                    if (!userInfosJson) {
                                        return <p className="text-muted">No information provided.</p>;
                                    }
                                    try {
                                        const userInfosArray = JSON.parse(userInfosJson);
                                        if (!Array.isArray(userInfosArray) || userInfosArray.length === 0) {
                                            return <p className="text-muted">No information found.</p>;
                                        }

                                        return (
                                            <ul className="list-group">
                                                {userInfosArray.map((info, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item mb-3 border rounded p-3"
                                                    >
                                                        <h6 className="mb-1">{info.title}</h6>
                                                        {info.type === 'file' ? (
                                                            <div className="mt-2" style={{ maxWidth: '60%', margin: 'auto' }}>
                                                                {/\.(jpe?g|png|gif|webp)$/i.test(info.description) ? (
                                                                    <img
                                                                        src={`/${info.description}`}
                                                                        alt={info.title}
                                                                        style={{ width: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}
                                                                    />
                                                                ) : (
                                                                    <iframe
                                                                        src={`/${info.description}`}
                                                                        title={info.title}
                                                                        style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                                    />
                                                                )}
                                                                <a
                                                                    href={`/${info.description}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-primary mt-2"
                                                                >
                                                                    View/Download
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <p className="mb-1">{info.description}</p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    } catch (error) {
                                        console.error('Error parsing user_infos JSON:', error);
                                        return (
                                            <p className="text-danger">
                                                Could not load user information due to a formatting error.
                                            </p>
                                        );
                                    }
                                })()}
                            </div>
                            {/* End User Informations Section */}

                            {/* User Documents Section */}
                            <div className="details_section mt-4">
                                <h5 className="details_section_title mb-3">User Documents</h5>
                                {(() => {
                                    const documentsJson = getValue(state, 'user_documents');
                                    if (!documentsJson) {
                                        return <p className="text-muted">No documents provided.</p>;
                                    }
                                    try {
                                        const documentsArray = JSON.parse(documentsJson);
                                        if (!Array.isArray(documentsArray) || documentsArray.length === 0) {
                                            return <p className="text-muted">No documents found.</p>;
                                        }

                                        const validDocuments = documentsArray.filter(
                                            (doc) => doc.title && doc.file,
                                        );

                                        if (validDocuments.length === 0) {
                                            return <p className="text-muted">No valid document entries found.</p>;
                                        }

                                        return (
                                            <ul className="list-group">
                                                {validDocuments.map((doc, index) => {
                                                    const filePath = doc.file.startsWith('http')
                                                        ? doc.file
                                                        : `/${doc.file}`;
                                                    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(
                                                        doc.fileName || doc.file,
                                                    );

                                                    return (
                                                        <li
                                                            key={index}
                                                            className="list-group-item mb-3 border rounded p-3"
                                                        >
                                                            <div className="d-flex w-100 justify-content-between">
                                                                <h6 className="mb-1">{doc.title}</h6>
                                                                <small>
                                                                    {doc.issueDate &&
                                                                        `Issued: ${moment(doc.issueDate).format(
                                                                            'DD MMM YYYY',
                                                                        )}`}
                                                                    {doc.issueDate && doc.expireDate && ' | '}
                                                                    {doc.expireDate &&
                                                                        `Expires: ${moment(doc.expireDate).format(
                                                                            'DD MMM YYYY',
                                                                        )}`}
                                                                </small>
                                                            </div>
                                                            <div className="mt-2" style={{ maxWidth: '60%', margin: 'auto' }}>
                                                                {isImage ? (
                                                                    <img
                                                                        src={filePath}
                                                                        alt={doc.title}
                                                                        style={{ width: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}
                                                                    />
                                                                ) : (
                                                                    <iframe
                                                                        src={filePath}
                                                                        title={doc.title}
                                                                        style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '4px' }}
                                                                    />
                                                                )}
                                                                <a
                                                                    href={filePath}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-primary mt-2"
                                                                >
                                                                    View/Download
                                                                </a>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        );
                                    } catch (error) {
                                        console.error('Error parsing user_documents JSON:', error);
                                        return (
                                            <p className="text-danger">
                                                Could not load documents due to a formatting error.
                                            </p>
                                        );
                                    }
                                })()}
                            </div>
                            {/* End User Documents Section */}
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
