import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import profileReducer from './slices/profileSlice';
import academic_year from '../views/pages/academic_year/config/store';
import academic_batch_id_rules from '../views/pages/academic_batch_id_rules/config/store';
import academic_calendar_event_types from '../views/pages/academic_calendar_event_types/config/store';
import academic_rules_types from '../views/pages/academic_rules_types/config/store';
import academic_calendar from '../views/pages/academic_calendar/config/store';
import academic_rules from '../views/pages/academic_rules/config/store';

import branch_class_buildings from '../views/pages/branch_class_buildings/config/store';
import branch_class_rooms from '../views/pages/branch_class_rooms/config/store';
import branch_classes from '../views/pages/branch_classes/config/store';

import all_users from '../views/pages/users/config/store';
import users from '../views/pages/users/config/store';
import user_roles from '../views/pages/user_roles/config/store';
import user_login_histories from '../views/pages/user-login-histories/config/store';
import contact_management from '../views/pages/contact_management/config/store';

const store = configureStore({
    reducer: {
        common_store: commonStore.reducer,
        profile: profileReducer, 
        academic_year: academic_year.reducer,
        academic_batch_id_rules: academic_batch_id_rules.reducer,
        academic_calendar_event_types: academic_calendar_event_types.reducer,
        academic_rules_types: academic_rules_types.reducer,
        academic_calendar: academic_calendar.reducer,
        academic_rules: academic_rules.reducer,
        branch_class_buildings: branch_class_buildings.reducer,
        branch_class_rooms: branch_class_rooms.reducer,
        branch_classes: branch_classes.reducer,
        all_users: all_users.reducer,
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
