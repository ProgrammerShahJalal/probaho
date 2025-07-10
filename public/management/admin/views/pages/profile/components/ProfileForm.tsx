import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../services';
import { useAppDispatch } from '../../../../store'; // Adjusted path
import { RootState } from '../../../../store'; // Adjusted path
import { setProfileImageUrl, fetchUserProfileThunk, setUserName } from '../../../../store/slices/profileSlice'; 

interface ProfileData {
    name: string;
    email: string;
    phone_number: string;
    photo?: string | File; 
}

const ProfileForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { profileImageUrl: currentGlobalProfileImage, isLoadingProfile: isGlobalLoading } = useSelector((state: RootState) => state.profile);

    const [formData, setFormData] = useState<ProfileData>({
        name: '',
        email: '',
        phone_number: '',
        photo: undefined,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null); // For local file preview or fetched image
    const [isSubmitting, setIsSubmitting] = useState(false); // For submission spinner
    const [isInitialLoading, setIsInitialLoading] = useState(true); // For initial data load for the form

    useEffect(() => {
        // Load initial profile data for the form
        const loadFormProfileData = async () => {
            setIsInitialLoading(true);
            try {
                const data = await fetchUserProfile(); 
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number,
                    photo: data.photo, // Store original photo URL
                });
                if (data.photo && typeof data.photo === 'string') {
                    setPreviewImage(data.photo); // Set form's preview from fetched data
                } else {
                    setPreviewImage(null);
                }
            } catch (error) {
                console.error("Failed to load user profile for form", error);
            }
            setIsInitialLoading(false);
        };
        
        if (!currentGlobalProfileImage && !isGlobalLoading) {
            dispatch(fetchUserProfileThunk());
        }
        
        loadFormProfileData();

        // Sync local preview with global state if it changes (e.g. fetched by DashboardLayout)
        // and no local file is staged for upload
        if (currentGlobalProfileImage && !(formData.photo instanceof File)) {
             setPreviewImage(currentGlobalProfileImage);
        }

    }, [dispatch, currentGlobalProfileImage, isGlobalLoading]); // formData.photo dependency removed to avoid loop with setFormData

    // Effect to update form's photo state if global image changes and it's not a File object
    useEffect(() => {
        if (currentGlobalProfileImage && !(formData.photo instanceof File) && formData.photo !== currentGlobalProfileImage) {
            setFormData(prev => ({ ...prev, photo: currentGlobalProfileImage }));
            setPreviewImage(currentGlobalProfileImage);
        }
    }, [currentGlobalProfileImage]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, photo: file })); // Store File object for upload
            setPreviewImage(URL.createObjectURL(file)); // Show local preview of the selected file
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload: ProfileData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
            };
            if (formData.photo instanceof File) {
                payload.photo = formData.photo;
            } else if (typeof formData.photo === 'string') {
                // If you want to allow removing photo, you'd need a mechanism for that.
                // Otherwise, if photo is a string, it means it's the existing URL.
                // The backend service `updateUserProfile` should handle if `photo` field is absent.
                // For this example, we assume `updateUserProfile` can handle `photo` being a string (URL)
                // or a File object. If it's a URL, it implies no change to the photo unless explicitly handled.
                // To be safe, only send photo if it's a File.
                // payload.photo = formData.photo; // Or omit if it's a URL and no new file
            }


            const updatedUser = await updateUserProfile(payload); 
            (window as any).toaster('Profile updated successfully!', 'success');

            // Dispatch setUserName to update the name in the Redux store
            if (updatedUser.name) {
                dispatch(setUserName(updatedUser.name));
            }

            if (updatedUser.photo && typeof updatedUser.photo === 'string') {
                dispatch(setProfileImageUrl(updatedUser.photo)); // Update global Redux state
                setPreviewImage(updatedUser.photo); // Update local preview
                // Update formData.photo to the new URL to prevent re-uploading a File object
                // on subsequent saves if no new file is selected.
                setFormData(prev => ({ ...prev, photo: updatedUser.photo }));
            } else if (!updatedUser.photo) {
                // If the photo was removed, update global and local state
                dispatch(setProfileImageUrl(null));
                setPreviewImage(null);
                setFormData(prev => ({ ...prev, photo: undefined }));
            }
        } catch (error) {
            console.error('Failed to update profile', error);
            // Error should be handled by the global axios interceptor or a specific toast message here
        }
        setIsSubmitting(false);
    };

    if (isInitialLoading && !previewImage) { // Show loading only if no image is available yet
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading profile data...</p>
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
                        disabled={isSubmitting || isInitialLoading}
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
                        disabled={isSubmitting || isInitialLoading}
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
                        disabled={isSubmitting || isInitialLoading}
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
                        disabled={isSubmitting || isInitialLoading}
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
                        disabled={isSubmitting || isInitialLoading} 
                        className="btn btn-primary"
                    >
                        {isSubmitting ? (
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
