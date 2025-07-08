import axios from 'axios';

const API_BASE_URL = '/api/v1'; // Adjust if your API base URL is different

interface ProfileData {
    name: string;
    email: string;
    phone_number: string;
    photo?: File | string; // File for upload, string for existing URL
    // Add other fields as necessary
}

interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

// Actual User Type from backend (adjust as per actual API response from your services)
interface UserProfileResponse {
    id: number | string;
    name: string;
    email: string;
    phone_number: string;
    photo: string; // URL of the photo
    slug?: string; // slug is also returned by get_user_profile and update_own_profile
    // other user fields
}

// This is the type for the data returned by the actual backend service
interface BackendResponse<T> {
    status: number;
    message: string;
    data: T; // The actual user data or relevant payload
}


export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    const response = await axios.get<BackendResponse<UserProfileResponse>>(`${API_BASE_URL}/users/profile`);
    return response.data.data; // Assuming backend wraps data in a 'data' property
};

export const updateUserProfile = async (profileData: ProfileData): Promise<UserProfileResponse> => {
    const formData = new FormData();
    
    // Only append fields if they are provided, matching backend optionality
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.phone_number) formData.append('phone_number', profileData.phone_number);

    if (profileData.photo && typeof profileData.photo !== 'string') { // if photo is a File object
        formData.append('photo', profileData.photo);
    }
    // If photo is a string (URL), it means it hasn't changed or is being cleared.
    // The backend service `update_own_profile` only updates photo if a new file is sent.

    const response = await axios.post<BackendResponse<UserProfileResponse>>(`${API_BASE_URL}/users/profile-update`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data; // Assuming backend wraps data in a 'data' property
};

export const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
    // The backend for changePassword returns a message, not the user object
    await axios.post<BackendResponse<null>>(`${API_BASE_URL}/users/change-password`, passwordData);
    // No explicit return needed if the primary goal is the side effect (password change)
    // and success/error is handled by axios interceptors or try/catch in component.
};
