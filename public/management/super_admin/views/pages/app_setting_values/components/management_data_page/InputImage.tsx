import React, { useRef, useState, useEffect } from 'react';
import { anyObject } from '../../../../../../../../src/common_types/object';

export interface Props {
  name: string;
  label: string;
  defalut_preview?: string | string[] | null;
  multiple?: boolean;
  onImageChange?: (data: { files: File[]; previews: string[] }) => void;
}

const cleanUrl = (url: string) => url.split('&')[0]; // Remove query parameters

const InputImage: React.FC<Props> = ({
  name,
  label,
  defalut_preview,
  multiple = false,
  onImageChange,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uiPreviews, setUiPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [serverPreviews, setServerPreviews] = useState<string[]>([]);

  // Initialize and update previews based on defalut_preview
  useEffect(() => {
    const initialPreviews = (() => {
      if (Array.isArray(defalut_preview)) {
        return defalut_preview
          .filter((path) => typeof path === 'string' && !path.startsWith('data:'))
          .map(cleanUrl); // Clean URLs
      }
      if (typeof defalut_preview === 'string' && defalut_preview && !defalut_preview.startsWith('data:')) {
        return [cleanUrl(defalut_preview)];
      }
      return [];
    })();

    // console.log('initialPreviews:', initialPreviews);
    setServerPreviews(initialPreviews);
    setUiPreviews(initialPreviews);
  }, [defalut_preview]);

  // Notify parent of state changes
  useEffect(() => {
    onImageChange?.({ files, previews: serverPreviews });
  }, [files, serverPreviews, onImageChange]);

  const handleFileChange = () => {
    const fileInput = fileInputRef.current;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
      const newFiles = Array.from(fileInput.files).filter(
        (file) => file.size > 0 && allowedTypes.includes(file.type)
      );

      if (newFiles.length === 0) {
        const invalidFiles = Array.from(fileInput.files).some(
          (file) => !allowedTypes.includes(file.type)
        );
        if (invalidFiles) {
          (window as anyObject).toaster(
            'Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.',
            'warning'
          );
        } else {
          console.log('No valid files selected');
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const newPreviews = newFiles.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file as data URL'));
            }
          };
          reader.onerror = () => reject(new Error('Error reading file'));
        });
      });

      Promise.all(newPreviews)
        .then((results) => {
          setUiPreviews((prev) => (multiple ? [...prev, ...results] : [results[0]]));
          setFiles((prev) => (multiple ? [...prev, ...newFiles] : [newFiles[0]]));
        })
        .catch((error) => {
          console.error('Error processing files:', error);
          (window as anyObject).toaster('Error processing selected files.', 'error');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        });
    } else {
      console.log('No files selected in handleFileChange');
    }
  };

  const handleRemoveImage = (index: number) => {
    setUiPreviews((prev) => prev.filter((_, i) => i !== index));
    setServerPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      // console.log('Files after removal:', updatedFiles.map((f) => ({ name: f.name, size: f.size })));
      return updatedFiles;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        multiple={multiple}
        {...props}
      />
      {uiPreviews.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {uiPreviews.map((preview, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{ maxHeight: '80px', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
                aria-label={`Remove image ${index + 1}`}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default InputImage;
