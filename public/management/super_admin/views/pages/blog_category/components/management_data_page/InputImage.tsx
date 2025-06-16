import React, { useEffect, useRef, useState } from 'react';
import { anyObject } from '../../../../../../../../src/common_types/object';

export interface Props {
    name: string;
    label: string;
    defalut_preview?: string | null;
    clearPreview?: boolean;
}

const InputImage: React.FC<Props> = ({ name, label, defalut_preview, clearPreview, ...props }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(defalut_preview || null);


    useEffect(() => {
        if (clearPreview) {
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
        }
    }, [clearPreview]);

    useEffect(() => {
        // Clean up preview URL to prevent memory leaks
        return () => {
            if (preview && preview.startsWith('data:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            // Validate file type
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                (window as anyObject).toaster('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.', 'warning',);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPreview(reader.result);
                }
            };
            reader.onerror = () => {
                console.error('Error reading file');
                setPreview(null);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <label>{label}</label>
            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
            />
            {preview && (
                <div>
                    <img
                        src={preview}
                        alt="Image Preview"
                        style={{ marginTop: '10px', maxHeight: '80px' }}
                    />
                </div>
            )}
        </>
    );
};

export default InputImage;
