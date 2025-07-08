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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            setIsLoading(true);
            try {
                const data = await fetchUserProfile();
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number,
                    photo: data.photo, 
                });
                if (data.photo) {
                    setPreviewImage(data.photo);
                }
            } catch (error) {
                console.error("Failed to load user profile", error);
                // TODO: Handle error display using a toast or an error message state
                // For now, we'll just log it. The existing axios interceptor might catch and display some errors.
            }
            setIsLoading(false);
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
            setFormData(prev => ({ ...prev, photo: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await updateUserProfile(formData);
            console.log('Profile updated successfully', updatedUser);
            // Assuming window.toaster is globally available as per index.tsx
            (window as any).toaster('Profile updated successfully!', 'success');
            if (updatedUser.photo) { // Assuming photo is the URL of the new/existing image
                setPreviewImage(updatedUser.photo);
                // Update formData.photo to the new URL if it's returned, to prevent re-uploading a File object
                setFormData(prev => ({ ...prev, photo: updatedUser.photo }));
            }
        } catch (error) {
            console.error('Failed to update profile', error);
            // Error should be handled by the global axios interceptor,
            // but a specific message can be shown here if needed.
            // (window as any).toaster('Failed to update profile.', 'error');
        }
        setIsLoading(false);
    };

    if (isLoading && !formData.name && !previewImage) { // More robust initial loading check
        return <p>Loading profile...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
                {previewImage && (
                    <div className="mt-2">
                        <img src={previewImage} alt="Photo preview" className="h-32 w-32 object-cover rounded-md" />
                    </div>
                )}
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;
