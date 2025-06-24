import React, { useEffect, useRef, useState } from 'react';

export interface Props {
    name: string;
    label: string;
    default_file_name?: string | null;
    default_preview_url?: string | null; // New prop for default preview URL
    clearFile?: boolean;
    required?: boolean;
    onChange?: (file: File | null) => void;
}

const getFileTypeFromUrl = (url: string): string | null => {
    if (!url) return null;
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
        return 'image';
    }
    if (extension === 'pdf') {
        return 'pdf';
    }
    return null;
};

const getFileTypeFromFile = (file: File): string | null => {
    if (!file) return null;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
        return 'image';
    }
    if (file.type === 'application/pdf' || extension === 'pdf') {
        return 'pdf';
    }
    return null;
}

const InputFile: React.FC<Props> = ({
    name,
    label,
    default_file_name,
    default_preview_url,
    clearFile,
    required,
    onChange,
    ...props
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(default_file_name || null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(default_preview_url || null);
    const [fileType, setFileType] = useState<string | null>(getFileTypeFromUrl(default_preview_url || ''));
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null); // For object URLs

    // Effect to handle default_preview_url changes
    useEffect(() => {
        if (!localPreviewUrl) { // Only update if no local file is selected
            setPreviewUrl(default_preview_url || null);
            setFileType(getFileTypeFromUrl(default_preview_url || ''));
        }
    }, [default_preview_url, localPreviewUrl]);

    // Effect to handle default_file_name changes
    useEffect(() => {
        if (!localPreviewUrl) { // Only update if no local file is selected
             setSelectedFileName(default_file_name || null);
        }
    }, [default_file_name, localPreviewUrl]);

    // Effect for clearing file
    useEffect(() => {
        if (clearFile) {
            setSelectedFileName(null);
            setPreviewUrl(default_preview_url || null); // Revert to default preview
            setFileType(getFileTypeFromUrl(default_preview_url || ''));
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl); // Clean up object URL
                setLocalPreviewUrl(null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (onChange) {
                onChange(null);
            }
        }
    }, [clearFile, onChange, default_preview_url, localPreviewUrl]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            setSelectedFileName(file.name);
            const currentFileType = getFileTypeFromFile(file);
            setFileType(currentFileType);

            if (localPreviewUrl) { // Revoke previous local object URL
                URL.revokeObjectURL(localPreviewUrl);
            }

            const newLocalPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newLocalPreviewUrl);
            setLocalPreviewUrl(newLocalPreviewUrl); // Store it for cleanup

            if (onChange) {
                onChange(file);
            }
        } else {
            // No file selected or selection cancelled
            setSelectedFileName(default_file_name || null); // Revert to default name if exists
            setPreviewUrl(default_preview_url || null); // Revert to default preview
            setFileType(getFileTypeFromUrl(default_preview_url || ''));
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
                setLocalPreviewUrl(null);
            }
            if (onChange) {
                onChange(null);
            }
        }
    };

    // Cleanup object URL on component unmount
    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        };
    }, [localPreviewUrl]);

    return (
        <>
            <label htmlFor={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <input
                type="file"
                name={name}
                id={name}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf" // More specific accept
                style={{
                    width: '100%',
                    padding: '10px',
                    height: '40px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    backgroundColor: '#2c2f36',
                    color: '#fff',
                    display: 'block',
                    marginBottom: '5px',
                }}
            />
            {selectedFileName && (
                <div style={{ marginTop: '5px', color: '#aaa', fontSize: '0.9em' }}>
                    Selected file: {selectedFileName}
                </div>
            )}

            {previewUrl && fileType && (
                <div style={{ marginTop: '10px', border: '1px solid #555', padding: '10px', borderRadius: '5px' }}>
                    {fileType === 'image' && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', borderRadius: '4px' }}
                        />
                    )}
                    {fileType === 'pdf' && (
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            style={{ width: '100%', height: '500px', border: 'none', borderRadius: '4px' }}
                        />
                    )}
                    {!['image', 'pdf'].includes(fileType) && (
                         <p style={{color: '#aaa'}}>Preview not available for this file type.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default InputFile;
