import React, { useEffect, useRef, useState } from 'react';

export interface Props {
    name: string;
    label: string;
    default_file_name?: string | null; // To show existing file name
    clearFile?: boolean;
    required?: boolean;
    onChange?: (file: File | null) => void; // Callback for when file changes
}

const InputFile: React.FC<Props> = ({
    name,
    label,
    default_file_name,
    clearFile,
    required,
    onChange,
    ...props
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(default_file_name || null);

    useEffect(() => {
        if (clearFile) {
            setSelectedFileName(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
            if (onChange) {
                onChange(null);
            }
        }
    }, [clearFile, onChange]);

    useEffect(() => {
        setSelectedFileName(default_file_name || null);
    }, [default_file_name]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            setSelectedFileName(file.name);
            if (onChange) {
                onChange(file);
            }
        } else {
            setSelectedFileName(null);
            if (onChange) {
                onChange(null);
            }
        }
    };

    return (
        <>
            <label htmlFor={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <input
                type="file"
                name={name}
                id={name} // Added id for the label to correctly associate
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="*/*" // Accept all file types
                style={{
                    width: '100%',
                    padding: '10px',
                    height: '40px',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    backgroundColor: '#2c2f36',
                    color: '#fff',
                    display: 'block', // Make it block to take full width and show selected file name below
                    marginBottom: '5px',
                }}
            />
            {selectedFileName && (
                <div style={{ marginTop: '5px', color: '#aaa', fontSize: '0.9em' }}>
                    Selected file: {selectedFileName}
                </div>
            )}
        </>
    );
};

export default InputFile;
