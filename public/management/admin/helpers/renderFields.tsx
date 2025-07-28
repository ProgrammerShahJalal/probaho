import React, { useState } from 'react';

export const useExpandedSections = () => {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (fieldName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    return { expandedSections, toggleSection };
};

export const renderArrayField = (
    fieldName: string,
    items: any[],
    sourceArray: any[],
    nameField: string,
    fallbackName: string,
    expandedSections: { [key: string]: boolean },
    toggleSection: (fieldName: string) => void
) => {
    if (!items || items.length === 0) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No items</span>;

    const isExpanded = expandedSections[fieldName];
    const showToggle = items.length > 3;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {items.slice(0, isExpanded ? items.length : 3).map((id: number) => {
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

export const renderLongTextField = (
    fieldName: string,
    value: string,
    expandedSections: { [key: string]: boolean },
    toggleSection: (fieldName: string) => void
) => {
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
                        marginTop: '4px',
                        outline: 'none'
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
