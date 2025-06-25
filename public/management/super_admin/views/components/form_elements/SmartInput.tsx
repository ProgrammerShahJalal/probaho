import React from 'react';
import DateEl from '../DateEl';
import DateTime from '../DateTime';
import GenericInputImage from './GenericInputImage'; // Import the new component

export interface FormFieldConfig {
    name: string;
    label?: string;
    type: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'date' | 'datetime' | 'select' | 'image' | 'radio' | 'checkbox';
    required?: boolean;
    placeholder?: string;
    defaultValue?: any;
    options?: Array<{ value: any; label: string }>; // For select, radio
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    value?: any; // For controlled components if needed
    rows?: number; // For textarea
    // Add other common props like disabled, readOnly, etc.
}

export interface SmartInputProps {
    fieldConfig: FormFieldConfig;
    value?: any; // Optional: for controlled components outside of a larger form state
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: File | null } }) => void; // Optional, updated for image
    // Prop to pass down to GenericInputImage for clearing its preview
    clearImagePreview?: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({ fieldConfig, value, onChange, clearImagePreview }) => {
    const {
        name,
        label,
        type,
        required = false,
        placeholder,
        defaultValue,
        options,
        rows,
    } = fieldConfig;

    const displayLabel = label || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const inputId = `smart-input-${name}`;

    // Prioritize the onChange from props if available (for FormRenderer's direct control)
    const handleChange = onChange || fieldConfig.onChange;

    switch (type) {
        case 'textarea':
            return (
                <div className="form-group form-vertical">
                    <label htmlFor={inputId}>{displayLabel}{required && <span style={{ color: 'red' }}>*</span>}</label>
                    <textarea
                        id={inputId}
                        name={name}
                        className="form-control"
                        rows={rows || 3}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        // @ts-ignore
                        onChange={handleChange}
                        value={value}
                        required={required}
                    />
                </div>
            );
        case 'date':
            return (
                <div className="form-group form-vertical">
                     <label htmlFor={inputId}>{displayLabel}{required && <span style={{ color: 'red' }}>*</span>}</label>
                    <DateEl
                        name={name}
                        value={value || defaultValue || ''}
                        handler={(selectedDate) => {
                            if (handleChange) {
                                const event = {
                                    target: { name, value: selectedDate }
                                } as React.ChangeEvent<HTMLInputElement>; // Type assertion
                                // @ts-ignore
                                handleChange(event);
                            }
                        }}
                    />
                </div>
            );
        case 'datetime':
             return (
                <div className="form-group form-vertical">
                    <label htmlFor={inputId}>{displayLabel}{required && <span style={{ color: 'red' }}>*</span>}</label>
                    <DateTime
                        name={name}
                        value={value || defaultValue || ''}
                        handler={(selectedDateTime) => {
                             if (handleChange) {
                                const event = {
                                    target: { name, value: selectedDateTime }
                                } as React.ChangeEvent<HTMLInputElement>; // Type assertion
                                 // @ts-ignore
                                handleChange(event);
                            }
                        }}
                    />
                </div>
            );
        case 'image':
            return (
                <GenericInputImage
                    name={name}
                    label={displayLabel}
                    required={required}
                    default_preview={defaultValue} // Or value if controlled for preview URL
                    onChangeCallback={(file, previewUrl) => {
                        if (handleChange) {
                            // Create a synthetic event-like object for FormRenderer's handleChange
                             const syntheticEvent = { target: { name: name, value: file, type: 'file-object', previewUrl: previewUrl } };
                            // @ts-ignore
                            handleChange(syntheticEvent);
                        }
                    }}
                    clearPreview={clearImagePreview}
                />
            );
        case 'select':
            return (
                <div className="form-group form-vertical">
                    <label htmlFor={inputId}>{displayLabel}{required && <span style={{ color: 'red' }}>*</span>}</label>
                    <select
                        id={inputId}
                        name={name}
                        className="form-control"
                        defaultValue={defaultValue}
                        onChange={handleChange}
                        value={value}
                        required={required}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            );
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        default:
            return (
                <div className="form-group form-vertical">
                    <label htmlFor={inputId}>{displayLabel}{required && <span style={{ color: 'red' }}>*</span>}</label>
                    <input
                        id={inputId}
                        name={name}
                        type={type}
                        className="form-control"
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        onChange={handleChange}
                        value={value}
                        required={required}
                    />
                </div>
            );
    }
};

export default SmartInput;
