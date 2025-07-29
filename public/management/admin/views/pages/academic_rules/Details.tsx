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
import { renderArrayField, renderLongTextField, useExpandedSections } from '../../../helpers/renderFields';

export interface Props { }

const Details: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    const { expandedSections, toggleSection } = useExpandedSections();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    const renderFieldValue = (fieldName: string) => {
        switch (fieldName) {
            case 'branch_user_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.users,
                    'name',
                    'Unknown User',
                    expandedSections,
                    toggleSection
                );
            case 'academic_year_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.academic_years,
                    'title',
                    'Unknown Year',
                    expandedSections,
                    toggleSection
                );
            case 'academic_rules_types_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.academic_calendar_event_types,
                    'title',
                    'Unknown Type',
                    expandedSections,
                    toggleSection
                );
            case 'branch_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.branches,
                    'name',
                    'Unknown Branch',
                    expandedSections,
                    toggleSection
                );
            case 'title':
            case 'description':
                return renderLongTextField(fieldName, state.item[fieldName], expandedSections, toggleSection);
            case 'date':
                return state.item[fieldName] ? (
                    <span style={{ color: 'white' }}>
                        {moment(state.item[fieldName]).format('DD MMMM YYYY')}
                    </span>
                ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>
                );
            case 'file':
                return state.item[fieldName] ? (
                    <span style={{ color: 'white' }}>File available (see below)</span>
                ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No file provided</span>
                );
            default:
                return state.item[fieldName] || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>;
        }
    };

    const customStyles: React.CSSProperties = {
        '--details-container-max-width': '100%',
        '--details-container-overflow': 'hidden',
    } as React.CSSProperties;

    return (
        <>
            <div className="page_content" style={customStyles}>
                <div className="explore_window fixed_size">
                    <Header page_title={setup.details_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                                <table className="table quick_modal_table table-hover" style={{ width: '100%', tableLayout: 'fixed' }}>
                                    <tbody>
                                        {[
                                            'branch_user_id',
                                            'academic_year_id',
                                            'branch_id',
                                            'academic_rules_types_id',
                                            'title',
                                            'description',
                                            'date',
                                            'file',
                                        ].map((fieldName) => (
                                            <tr key={fieldName} style={{ borderBottom: '1px solid #f1f3f4' }}>
                                                <td style={{

                                                }}>
                                                    {fieldName.replaceAll('_', ' ')}
                                                </td>
                                                <td style={{

                                                }}>
                                                    :
                                                </td>
                                                <td style={{
                                                    verticalAlign: 'top',
                                                    padding: '12px 8px',
                                                    wordWrap: 'break-word',
                                                    overflowWrap: 'break-word'
                                                }}>
                                                    {renderFieldValue(fieldName)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Academic Rule File Section */}
                            {state.item.file && (
                                <div className="details_section mt-4">
                                    <h5 className="details_section_title mb-3">Academic Rule File</h5>
                                    <div className="mt-2" style={{ maxWidth: '70%', margin: 'auto' }}>
                                        {/\.(jpe?g|png|gif|webp)$/i.test(state.item.file) ? (
                                            <img
                                                src={state.item.file.startsWith('http') 
                                                    ? state.item.file 
                                                    : `/${state.item.file}`}
                                                alt="Academic Rule File"
                                                style={{ 
                                                    width: '100%', 
                                                    height: 'auto', 
                                                    border: '1px solid #ddd', 
                                                    borderRadius: '4px', 
                                                    padding: '5px' 
                                                }}
                                            />
                                        ) : (
                                            <iframe
                                                src={state.item.file.startsWith('http') 
                                                    ? state.item.file 
                                                    : `/${state.item.file}`}
                                                title="Academic Rule File"
                                                style={{ 
                                                    width: '100%', 
                                                    height: '500px', 
                                                    border: '1px solid #ddd', 
                                                    borderRadius: '4px' 
                                                }}
                                            />
                                        )}
                                        <a
                                            href={state.item.file.startsWith('http') 
                                                ? state.item.file 
                                                : `/${state.item.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary mt-2"
                                            style={{ display: 'block', textAlign: 'center' }}
                                        >
                                            View/Download
                                        </a>
                                    </div>
                                </div>
                            )}
                            {/* End Academic Rule File Section */}
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

