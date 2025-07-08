import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../../views/pages/profile/services'; // Adjust path if necessary

interface ProfileState {
    profileImageUrl: string | null;
    isLoadingProfile: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profileImageUrl: null,
    isLoadingProfile: false,
    error: null,
};

// Async thunk to fetch user profile
export const fetchUserProfileThunk = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchUserProfile();
            // Assuming data.photo is the URL string or null/undefined
            return data.photo && typeof data.photo === 'string' ? data.photo : null;
        } catch (error: any) {
            console.error("Failed to load user profile for store", error);
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    }
);

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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfileThunk.pending, (state) => {
                state.isLoadingProfile = true;
                state.error = null;
            })
            .addCase(fetchUserProfileThunk.fulfilled, (state, action: PayloadAction<string | null>) => {
                state.profileImageUrl = action.payload;
                state.isLoadingProfile = false;
            })
            .addCase(fetchUserProfileThunk.rejected, (state, action) => {
                state.isLoadingProfile = false;
                state.error = action.payload as string;
            });
    },
});

export const { setProfileImageUrl, clearProfileImage, setProfileLoading } = profileSlice.actions;
export default profileSlice.reducer;
