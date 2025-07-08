import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile } from '../services';

interface ProfileData {
    name: string;
    email: string;
    phone_number: string;
    photo?: string | File;
}

const ProfileForm: React.FC = () => {
    const [formData, setFormData] = useState<ProfileData>({
        name: '',
        email: '',
        phone_number: '',
        photo: undefined,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // For submission spinner
    const [initialLoading, setInitialLoading] = useState(true); // For initial data load

    useEffect(() => {
        const loadUserProfile = async () => {
            setInitialLoading(true); // Ensure it's true when loading starts
            try {
                const data = await fetchUserProfile();
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number,
                    photo: data.photo, // Store original photo URL or undefined
                });
                if (data.photo && typeof data.photo === 'string') {
                    setPreviewImage(data.photo);
                }
            } catch (error) {
                console.error("Failed to load user profile", error);
                // Error should be handled by global interceptor or a specific toast message here
            }
            setInitialLoading(false); // Set to false after loading finishes
        };
        loadUserProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, photo: file })); // Store File object for upload
            setPreviewImage(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await updateUserProfile(formData); // formData contains File or string for photo
            // Assuming window.toaster is globally available
            (window as any).toaster('Profile updated successfully!', 'success');
            if (updatedUser.photo && typeof updatedUser.photo === 'string') { 
                setPreviewImage(updatedUser.photo);
                // Update formData.photo to the new URL to prevent re-uploading a File object on subsequent saves without new file selection
                setFormData(prev => ({ ...prev, photo: updatedUser.photo }));
            }
        } catch (error) {
            console.error('Failed to update profile', error);
            // Error should be handled by the global axios interceptor
        }
        setIsLoading(false);
    };

    if (initialLoading) { 
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="card shadow-sm">
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="form-control"
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        id="photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="form-control"
                        disabled={isLoading}
                    />
                    {previewImage && (
                        <div className="mt-2">
                            <img 
                                src={previewImage} 
                                alt="Photo preview" 
                                className="img-thumbnail" 
                                style={{ maxHeight: '128px', maxWidth: '128px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </div>
                <div className="d-grid">
                    <button
                        type="submit"
                        disabled={isLoading || initialLoading} 
                        className="btn btn-primary"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProfileForm;
