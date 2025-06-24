import React, { useState, useEffect, ChangeEvent } from 'react';

interface Props {
    name: string;
    label?: string;
    default_preview?: string | null;
    required?: boolean;
    onChangeCallback?: (file: File | null, previewUrl: string | null) => void;
    clearPreview?: boolean; // Prop to externally trigger clearing of preview
}

const GenericInputImage: React.FC<Props> = ({
    name,
    label,
    default_preview,
    required = false,
    onChangeCallback,
    clearPreview,
}) => {
    const [preview, setPreview] = useState<string | null>(default_preview || null);
    const [fileName, setFileName] = useState<string>('');
    const inputId = `generic-image-input-${name}`;

    useEffect(() => {
        if (default_preview) {
            setPreview(default_preview);
        }
    }, [default_preview]);

    useEffect(() => {
        if (clearPreview) {
            setPreview(null);
            setFileName('');
            // If you have a ref to the input element, you might want to clear it too:
            // e.g., if (inputRef.current) inputRef.current.value = '';
        }
    }, [clearPreview]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                if (onChangeCallback) {
                    onChangeCallback(file, result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setFileName('');
            setPreview(null);
            if (onChangeCallback) {
                onChangeCallback(null, null);
            }
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setFileName('');
        // Also clear the file input if possible, or notify parent to clear the file state
        const inputElement = document.getElementById(inputId) as HTMLInputElement;
        if (inputElement) {
            inputElement.value = ''; // This might not always work as expected for security reasons
        }
        if (onChangeCallback) {
            onChangeCallback(null, null);
        }
    };

    const displayLabel = label || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="form-group form-vertical">
            <label htmlFor={inputId}>
                {displayLabel}
                {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <input
                type="file"
                className="form-control"
                id={inputId}
                name={name}
                onChange={handleImageChange}
                accept="image/*"
                required={required && !preview} // Required only if there's no existing image/preview
            />
            {fileName && <small className="form-text text-muted mt-1">{fileName}</small>}
            {preview && (
                <div className="mt-2 position-relative" style={{ maxWidth: '200px' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: '5px', right: '5px' }}
                        aria-label="Remove image"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default GenericInputImage;
