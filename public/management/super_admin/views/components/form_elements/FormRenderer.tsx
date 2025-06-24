import React, { useEffect, useState, useCallback } from 'react';
import SmartInput, { FormFieldConfig } from './SmartInput';
import { anyObject } from '../../../common_types/object';

// We'll need a more robust way to handle image inputs and rich text editors.
// For now, InputImage and CKEditor will be handled outside or with placeholders.
// import InputImage from '../../pages/blogs/components/management_data_page/InputImage'; // Path might vary

declare global {
    interface Window {
        CKEDITOR?: any;
    }
}
export interface FormRendererProps {
    formConfig: FormFieldConfig[];
    onSubmit: (formData: FormData) => void;
    initialData?: anyObject; // For pre-filling forms (e.g., in Edit views)
    submitButtonText?: string;
    resetFormOnSubmit?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
    formConfig,
    onSubmit,
    initialData = {},
    submitButtonText = 'Submit',
    resetFormOnSubmit = false,
}) => {
    const [formDataState, setFormDataState] = useState<anyObject>({});
    const [ckEditorInstances, setCkEditorInstances] = useState<anyObject>({});
    const [clearImagePreviews, setClearImagePreviews] = useState<anyObject>({}); // Tracks which image previews to clear

    // Initialize form state with initialData or defaultValues from config
    useEffect(() => {
        const newFormState: anyObject = {};
        formConfig.forEach(field => {
            newFormState[field.name] = initialData[field.name] ?? field.defaultValue ?? '';
            if (field.type === 'image') {
                // Store the URL if initialData provides it, otherwise null
                newFormState[`${field.name}_preview`] = initialData[field.name] || null;
                // The actual file object will be set if the user uploads a new file
                // If initialData[field.name] is a URL, we don't set it as a File object here
                if (typeof initialData[field.name] === 'string') { // Assuming URL is string
                     newFormState[field.name] = null; // No file object initially if only URL
                } else {
                     newFormState[field.name] = initialData[field.name] || null; // Could be File object if form re-renders
                }
            }
        });
        setFormDataState(newFormState);
    }, [formConfig, initialData]);


    // Initialize CKEditors
    useEffect(() => {
        const editors: anyObject = {};
        formConfig.forEach(field => {
            // Using a more specific check for richtext type if available, or fallback to name includes 'description'
            if (field.type === 'richtext' || (field.type === 'textarea' && field.name.includes('description'))) {
                const element = document.getElementById(field.name); // CKEditor usually replaces by ID
                if (element && window.CKEDITOR && !window.CKEDITOR.instances[field.name]) {
                    const editor = window.CKEDITOR.replace(field.name);
                    editor.setData(formDataState[field.name] || ''); // Set initial data
                    editors[field.name] = editor;

                    // Update state on editor change
                    editor.on('change', () => {
                        setFormDataState(prevState => ({
                            ...prevState,
                            [field.name]: editor.getData(),
                        }));
                    });
                } else if (window.CKEDITOR && window.CKEDITOR.instances[field.name]) {
                    // If editor already exists, just update its data if formDataState changed
                    // This might happen if initialData loads after first render
                    const editor = window.CKEDITOR.instances[field.name];
                    if (editor.getData() !== (formDataState[field.name] || '')) {
                         editor.setData(formDataState[field.name] || '');
                    }
                     editors[field.name] = editor; // Ensure it's in our tracking
                }
            }
        });
        setCkEditorInstances(editors);

        return () => {
            Object.values(editors).forEach((editor: any) => {
                if (editor && typeof editor.destroy === 'function') {
                    editor.destroy();
                }
            });
            // Clear instances from state to prevent issues on re-renders
            // setCkEditorInstances({}); // This might cause re-initialization if not careful
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formConfig]); // Only re-run if formConfig itself changes. formDataState dependency removed to prevent loop with editor.on('change')

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: File | null | string; type?: string; previewUrl?: string } }) => {
        const target = e.target as any; // Use any for simplicity with mixed event types
        const { name, value, type } = target;

        if (type === 'file-object') { // Custom type from SmartInput for images
            setFormDataState(prevState => ({
                ...prevState,
                [name]: value, // This is the File object
                [`${name}_preview`]: target.previewUrl,
            }));
            setClearImagePreviews(prev => ({ ...prev, [name]: false }));
        } else if (type === 'checkbox') {
            setFormDataState(prevState => ({
                ...prevState,
                [name]: target.checked,
            }));
        } else {
            setFormDataState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    }, []);

    // handleDateChange removed as SmartInput for date/datetime now uses standard handleChange

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submissionFormData = new FormData();

        formConfig.forEach(field => {
            if (field.type === 'richtext' || (field.type === 'textarea' && field.name.includes('description'))) {
                if (ckEditorInstances[field.name]) {
                    submissionFormData.append(field.name, ckEditorInstances[field.name].getData());
                } else {
                     submissionFormData.append(field.name, formDataState[field.name] || '');
                }
            } else if (field.type === 'image') {
                if (formDataState[field.name] instanceof File) {
                    submissionFormData.append(field.name, formDataState[field.name]);
                } else if (initialData[field.name] && typeof initialData[field.name] === 'string' && !formDataState[field.name]) {
                    // If there was an initial image (URL) and it wasn't changed (no new file),
                    // we might not need to append anything if backend handles empty image field as "no change".
                    // Or, append the URL if backend expects it. For now, we assume backend handles "no change".
                    // If you need to send the original URL back, you'd do:
                    // submissionFormData.append(field.name, initialData[field.name]);
                }
            } else if (formDataState[field.name] !== undefined) {
                submissionFormData.append(field.name, formDataState[field.name]);
            }
        });

        // Append ID if it's in initialData (for updates)
        if (initialData && initialData.id) {
            submissionFormData.append('id', initialData.id);
        }

        onSubmit(submissionFormData);

        if (resetFormOnSubmit) {
            // e.currentTarget.reset(); // This might not clear controlled components or CKEditor
            const newClearImagePreviews = {};
            const newFormDataState = {};
            formConfig.forEach(field => {
                 newFormDataState[field.name] = field.defaultValue ?? '';
                if (field.type === 'image') {
                    newClearImagePreviews[field.name] = true; // Signal to GenericInputImage to clear
                    newFormDataState[`${field.name}_preview`] = null;
                     newFormDataState[field.name] = null; // Clear file object
                }
                if (ckEditorInstances[field.name]) {
                    ckEditorInstances[field.name].setData('');
                }
            });
            setFormDataState(newFormDataState);
            setClearImagePreviews(newClearImagePreviews);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto pt-3">
            {formConfig.map(field => {
                // CKEditor fields are rendered as simple textareas that CKEditor will replace
                if (field.type === 'richtext' || (field.type === 'textarea' && field.name.includes('description'))) {
                    return (
                        <div key={field.name} className="form-group form-vertical">
                            <label htmlFor={field.name}>{field.label || field.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}{field.required && <span style={{ color: 'red' }}>*</span>}</label>
                            <textarea id={field.name} name={field.name} defaultValue={formDataState[field.name]} rows={field.rows || 10} className="form-control"/>
                        </div>
                    );
                }

                return (
                    <SmartInput
                        key={field.name}
                        fieldConfig={{
                            ...field,
                            // Pass the preview URL as defaultValue for GenericInputImage if it's an image field
                            defaultValue: field.type === 'image' ? formDataState[`${field.name}_preview`] : formDataState[field.name],
                        }}
                        // For image, value is File or null. For others, it's string/number/boolean.
                        value={field.type === 'image' ? undefined : formDataState[field.name]} // Let GenericInputImage handle its file state internally based on default_preview
                        onChange={handleChange}
                        clearImagePreview={field.type === 'image' ? clearImagePreviews[field.name] : undefined}
                    />
                );
            })}
            <div className="form-group form-vertical mt-3">
                <div className="form_elements">
                    <button type="submit" className="btn btn_1 btn-outline-info">
                        {submitButtonText}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormRenderer;
