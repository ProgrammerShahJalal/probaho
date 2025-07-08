import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import user_roles from '../views/pages/user_roles/config/store';
import user_login_histories from '../views/pages/user-login-histories/config/store';
import contact_management from '../views/pages/contact_management/config/store';

const store = configureStore({
    reducer: {
        common_store: commonStore.reducer,
        users: users.reducer,
        user_roles: user_roles.reducer,
        user_login_histories: user_login_histories.reducer,
        contact_messages: contact_management.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
