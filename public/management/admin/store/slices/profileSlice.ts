import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../../views/pages/profile/services'; // Adjust path if necessary

interface ProfileState {
    profileImageUrl: string | null;
    userName: string | null; // Added userName
    isLoadingProfile: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profileImageUrl: null,
    userName: null, // Initialized userName
    isLoadingProfile: false,
    error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfileThunk = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchUserProfile();
            // Return both profileImageUrl and userName
            return {
                profileImageUrl: data.photo && typeof data.photo === 'string' ? data.photo : null,
                userName: data.name || null
            };
        } catch (error: any) {
            console.error("Failed to load user profile for store", error);
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    }
);

// Define the expected payload type for the fulfilled action
interface UserProfilePayload {
    profileImageUrl: string | null;
    userName: string | null;
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileImageUrl: (state, action: PayloadAction<string | null>) => {
            state.profileImageUrl = action.payload;
            state.isLoadingProfile = false; // Assuming if we set it directly, loading is done
            state.error = null;
        },
        clearProfileImage: (state) => {
            state.profileImageUrl = null;
        },
        // Optional: if you want to manually set loading state from components
        setProfileLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoadingProfile = action.payload;
        },
        setUserName: (state, action: PayloadAction<string | null>) => { // Added setUserName reducer
            state.userName = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfileThunk.pending, (state) => {
                state.isLoadingProfile = true;
                state.error = null;
            })
            .addCase(fetchUserProfileThunk.fulfilled, (state, action: PayloadAction<UserProfilePayload>) => {
                state.profileImageUrl = action.payload.profileImageUrl;
                state.userName = action.payload.userName; // Update userName
                state.isLoadingProfile = false;
            })
            .addCase(fetchUserProfileThunk.rejected, (state, action) => {
                state.isLoadingProfile = false;
                state.error = action.payload as string;
            });
    },
});

export const { setProfileImageUrl, clearProfileImage, setProfileLoading, setUserName } = profileSlice.actions; // Exported setUserName
export default profileSlice.reducer;
