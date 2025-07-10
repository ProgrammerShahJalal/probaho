import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const commnStoreInitialState = {
    cached: 0,
};

const commonStore = createSlice({
    name: 'common_store',
    initialState: commnStoreInitialState,
    reducers: {
        set_cached: (state, action: PayloadAction<number>) => {
            state.cached = action.payload;
        },
    },
});

export default commonStore;
