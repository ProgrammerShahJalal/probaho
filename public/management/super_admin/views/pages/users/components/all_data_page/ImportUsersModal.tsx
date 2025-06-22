import React, { useState, useRef, useEffect } from 'react';
import setup from '../../config/setup'; // For API prefix
import { CsvBuilder } from 'filefy';

interface ImportUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImportUsersModal: React.FC<ImportUsersModalProps> = ({ isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const routePrefix = setup.api_prefix; // Should be 'auth'

    useEffect(() => {
        // Reset state when modal is closed or opened
        if (isOpen) {
            setSelectedFile(null);
            setUploadProgress(0);
            setStatusMessage('');
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'text/csv') {
                setSelectedFile(file);
                setStatusMessage('');
            } else {
                setSelectedFile(null);
                setStatusMessage('Invalid file type. Please select a .csv file.');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
    } else {
        setSelectedFile(null);
    }
};

    const handleDownloadDemo = () => {
        const columns = [
            'role_serial',
            'name',
            'email',
            'phone_number',
            'photo',
            'is_verified',
            'is_approved',
            'is_blocked',
            'status',
        ];
        // Create one empty row to show the structure
        const emptyRow = columns.map(() => ''); 

        new CsvBuilder('demo_users_import_template.csv')
            .setColumns(columns)
            .addRows([emptyRow]) // Add the single empty row
            .exportFile();
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setStatusMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setStatusMessage('');

        const formData = new FormData();
        formData.append('file', selectedFile); // Assuming backend expects the file under the key 'file'

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            setIsUploading(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                // Try to parse JSON response
                try {
                    const response = JSON.parse(xhr.responseText);
                    setStatusMessage(response.message || 'Upload successful!'); // Adjust based on actual API response
                } catch (e) {
                    setStatusMessage(`Upload successful, but couldn't parse server response. Status: ${xhr.status}`);
                }
                setSelectedFile(null); // Clear selection
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    setStatusMessage(response.message || `Upload failed. Status: ${xhr.status} - ${xhr.statusText}`);
                } catch (e) {
                    setStatusMessage(`Upload failed. Status: ${xhr.status} - ${xhr.statusText}`);
                }
            }
        };

        xhr.onerror = () => {
            setIsUploading(false);
            setUploadProgress(0);
            setStatusMessage('Upload failed due to a network error or server issue.');
        };

        xhr.open('POST', `/${routePrefix}/import`, true);
        // Potentially add headers if needed, e.g., for authorization
        // xhr.setRequestHeader('Authorization', 'Bearer YOUR_TOKEN_HERE');
        xhr.send(formData);
    };

    // Basic inline styles for the modal
    const modalStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const modalContentStyle: React.CSSProperties = {
        backgroundColor: '#20232A',
        padding: '20px 40px', // Increased padding
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '500px', // Fixed width
        textAlign: 'center',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 15px',
        margin: '10px 5px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };
    
    const primaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white',
    };

    const secondaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        color: 'white',
    };
    
    const closeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
    };

    const inputStyle: React.CSSProperties = {
        display: 'block',
        width: 'calc(100% - 20px)', // Adjust width to account for padding
        padding: '10px',
        margin: '20px auto', // Centered with auto margins
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const progressBarStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginTop: '10px',
        height: '20px', // Explicit height
        overflow: 'hidden', // Ensure inner bar is contained
    };

    const progressBarInnerStyle: React.CSSProperties = {
        width: `${uploadProgress}%`,
        height: '100%', // Fill height of parent
        backgroundColor: '#4caf50',
        textAlign: 'center',
        lineHeight: '20px', // Vertically center text
        color: 'white',
        transition: 'width 0.3s ease-in-out',
    };


    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose}>&times;</button>
                <h2>Import Users</h2>
                <p>Please check the sample CSV file below to ensure compatibility with the data import.</p>
                <button style={secondaryButtonStyle} onClick={handleDownloadDemo}>Download Demo CSV</button>
                <hr style={{ margin: '20px 0' }} />
                
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange} 
                    ref={fileInputRef}
                    style={inputStyle} 
                    disabled={isUploading}
                />

                {selectedFile && !isUploading && <p>Selected file: {selectedFile.name}</p>}

                <button 
                    style={primaryButtonStyle}
                    onClick={handleUpload} 
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? `Uploading ${uploadProgress}%...` : 'Upload File'}
                </button>

                {isUploading && (
                    <div style={progressBarStyle}>
                        <div style={progressBarInnerStyle}>
                            {uploadProgress > 0 && `${uploadProgress}%`}
                        </div>
                    </div>
                )}

                {statusMessage && <p style={{ marginTop: '15px', color: statusMessage.startsWith('Upload failed') || statusMessage.startsWith('Invalid file') ? 'red' : 'green' }}>{statusMessage}</p>}
            </div>
        </div>
    );
};

export default ImportUsersModal;
