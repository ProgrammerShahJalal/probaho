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
import moment from 'moment/moment';
import { getValue } from '../utils/getValue';

export interface Props { }

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

    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (fieldName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const renderArrayField = (fieldName: string, items: any[], sourceArray: any[], nameField: string, fallbackName: string) => {
        if (!items || items.length === 0) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No items</span>;

        const isExpanded = expandedSections[fieldName];
        const showToggle = items.length > 3;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {items.slice(0, isExpanded ? items.length : 3).map((id: number, index: number) => {
                        const item = sourceArray?.find((item: any) => item.id === id);
                        return (
                            <div key={id} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                background: '#2d3748',
                                border: '1px solid #4a5568',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                maxWidth: '100%'
                            }}>
                                <span style={{
                                    background: '#3182ce',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    marginRight: '6px',
                                    fontWeight: 600,
                                    fontSize: '10px'
                                }}>
                                    #{id}
                                </span>
                                <span style={{
                                    color: 'white',
                                    fontWeight: 500,
                                    wordBreak: 'break-word',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item?.[nameField] || fallbackName}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {showToggle && (
                    <button
                        style={{
                            background: 'none',
                            border: '1px solid #3182ce',
                            color: '#3182ce',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            alignSelf: 'flex-start',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => toggleSection(fieldName)}
                        type="button"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#3182ce';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#3182ce';
                        }}
                    >
                        {isExpanded ? 'Show Less' : `Show ${items.length - 3} More`}
                    </button>
                )}
            </div>
        );
    };

    const renderLongTextField = (fieldName: string, value: string) => {
        if (!value) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>;

        const isExpanded = expandedSections[fieldName];
        const isLong = value.length > 150;
        const displayValue = isLong && !isExpanded ? value.substring(0, 150) + '...' : value;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                    lineHeight: 1.5,
                    color: 'white',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    maxWidth: '100%'
                }}>
                    {displayValue}
                </div>
                {isLong && (
                    <button
                        style={{
                            background: 'none',
                            border: '1px solid #3182ce',
                            color: '#3182ce',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            alignSelf: 'flex-start',
                            transition: 'all 0.2s',
                            marginTop: '4px'
                        }}
                        onClick={() => toggleSection(fieldName)}
                        type="button"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#3182ce';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#3182ce';
                        }}
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>
        );
    };

    const renderFieldValue = (fieldName: string) => {
        switch (fieldName) {
            case 'branch_user_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.users,
                    'name',
                    'Unknown User'
                );
            case 'academic_year_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.academic_years,
                    'title',
                    'Unknown Year'
                );
            case 'academic_calendar_event_types_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.academic_calendar_event_types,
                    'title',
                    'Unknown Type'
                );
            case 'branch_id':
                return renderArrayField(
                    fieldName,
                    state.item[fieldName],
                    state.item.branches,
                    'name',
                    'Unknown Branch'
                );
            case 'event_name':
            case 'description':
                return renderLongTextField(fieldName, state.item[fieldName]);
            case 'date':
                return state.item[fieldName] ? (
                    <span style={{ color: 'white' }}>
                        {moment(state.item[fieldName]).format('DD MMMM YYYY')}
                    </span>
                ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>
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
                                            'academic_calendar_event_types_id',
                                            'event_name',
                                            'description',
                                            'date',
                                            'status',
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

