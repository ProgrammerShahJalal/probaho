import React, { useState, useRef, useEffect } from 'react';
import setup from '../../config/setup'; // For API prefix
import { CsvBuilder } from 'filefy';

interface ImportUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ImportModal: React.FC<ImportUsersModalProps> = ({ isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<string[]>([]);
    const [responseData, setResponseData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const routePrefix = setup.api_prefix;

    useEffect(() => {
        // Reset state when modal is closed or opened
        if (isOpen) {
            setSelectedFile(null);
            setUploadProgress(0);
            setStatusMessage('');
            setIsUploading(false);
            setErrorList([]);
            setResponseData(null);
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
            'branch_user_id',
            'branch_id', // optional
            'academic_year_id',
            'title',
            'code',
            'capacity',
            'image', // optional
            'status',
        ];
        
        // Create a sample row with dummy data
        const sampleRow = [
            '23', // branch_user_id (example user ID)
            '1', // branch_id (optional - example branch ID)
            '4', // academic_year_id (example year)
            'Humanities & Arts Building', // title 
            'HAB', // code
            '200', // capacity
            'uploads/branch_class_buildings/20250729121849HAB_Class.jpg', // image (optional - example image URL)
            'active', // status (active/deactive)
        ];

        new CsvBuilder('demo_branch_class_buildings_import_template.csv')
            .setColumns(columns)
            .addRows([sampleRow]) // Add the sample row with dummy data
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
                    setStatusMessage(response.message || 'Upload successful!');
                    setErrorList(response.data?.errors || []);
                    setResponseData(response.data || null);
                } catch (e) {
                    setStatusMessage(`Upload successful, but couldn't parse server response. Status: ${xhr.status}`);
                    setErrorList([]);
                    setResponseData(null);
                }
                setSelectedFile(null); // Clear selection
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    setStatusMessage(response.message || `Upload failed. Status: ${xhr.status} - ${xhr.statusText}`);
                    setErrorList(response.data?.errors || []);
                    setResponseData(response.data || null);
                } catch (e) {
                    setStatusMessage(`Upload failed. Status: ${xhr.status} - ${xhr.statusText}`);
                    setErrorList([]);
                    setResponseData(null);
                }
            }
        };

        xhr.onerror = () => {
            setIsUploading(false);
            setUploadProgress(0);
            setStatusMessage('Upload failed due to a network error or server issue.');
        };

        xhr.open('POST', `/api/v1/${routePrefix}/import`, true);
        // Potentially add headers if needed, e.g., for authorization
        // xhr.setRequestHeader('Authorization', 'Bearer YOUR_TOKEN_HERE');
        xhr.send(formData);
    };

    return (
        <div className={`modal fade show`} tabIndex={-1} role="dialog" style={{ display: 'block', background: 'rgba(30, 34, 45, 0.85)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
                <div className="modal-content" style={{ background: '#23272f', color: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" style={{ fontSize: '1.1rem' }}>Import Branch Class Buildings</h5>
                        <button type="button" className="btn-close" aria-label="Close" style={{ filter: 'invert(32%) sepia(98%) saturate(7492%) hue-rotate(353deg) brightness(97%) contrast(104%)' }} onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-2" style={{ fontSize: '0.95em' }}>Please check the sample CSV file below to ensure compatibility with the data import.</p>
                        <button className="btn btn-secondary btn-sm mb-3" onClick={handleDownloadDemo}>Download Demo CSV</button>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="form-control mb-2"
                            disabled={isUploading}
                        />
                        {selectedFile && !isUploading && <div className="mb-2 small">Selected file: {selectedFile.name}</div>}
                        {errorList.length > 0 && (
                            <div className="alert alert-danger small" style={{ maxHeight: 200, overflowY: 'auto' }}>
                                <strong>Import Errors:</strong>
                                <ul className="mb-0 ps-3">
                                    {errorList.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {statusMessage && (
                            <div
                                className={`small mt-2 ${
                                    (typeof responseData?.failed_imports === 'number' && responseData.failed_imports === 0)
                                        ? 'text-success'
                                        : (typeof responseData?.failed_imports === 'number' && responseData.failed_imports > 0)
                                            ? 'text-danger'
                                            : ''
                                }`}
                            >
                                {statusMessage}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {errorList.length === 0 && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                            >
                                {isUploading ? `Uploading ${uploadProgress}%...` : 'Upload File'}
                            </button>
                        )}
                        <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
