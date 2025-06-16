import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import user_roles from '../views/pages/user_roles/config/store';
import user_login_histories from '../views/pages/user-login-histories/config/store';
import contact_management from '../views/pages/contact_management/config/store';

import blogs from '../views/pages/blogs/config/store';
import blog_category from '../views/pages/blog_category/config/store';
import blog_tags from '../views/pages/blog_tags/config/store';
import blog_comments from '../views/pages/blog_comments/config/store';
import blog_comment_replies from '../views/pages/blog_comment_replies/config/store';

import event_category from '../views/pages/event_category/config/store';
import event_tags from '../views/pages/event_tags/config/store';
import events from '../views/pages/events/config/store';
import event_certified_users from '../views/pages/event_certified_users/config/store';
import event_resources from '../views/pages/event_resources/config/store';
import event_faqs from '../views/pages/event_faqs/config/store';
import event_sessions from '../views/pages/event_sessions/config/store';
import event_sessions_assesments from '../views/pages/event_sessions_assesments/config/store';
import event_session_assesment_submissions from '../views/pages/event_session_assesment_submissions/config/store';
import event_attendance from '../views/pages/event_attendance/config/store';
import event_enrollments from '../views/pages/event_enrollments/config/store';
import event_payments from '../views/pages/event_payments/config/store';
import event_payment_refunds from '../views/pages/event_payment_refunds/config/store';
import event_feedback_form_fields from '../views/pages/event_feedback_form_fields/config/store';
import app_settings from '../views/pages/app_settings/config/store';
import app_setting_values from '../views/pages/app_setting_values/config/store';

const store = configureStore({
    reducer: {
        common_store: commonStore.reducer,
        users: users.reducer,
        user_roles: user_roles.reducer,
        user_login_histories: user_login_histories.reducer,
        contact_messages: contact_management.reducer,
        blog_category: blog_category.reducer,
        blog_tags: blog_tags.reducer,
        blogs: blogs.reducer,
        blog_comments: blog_comments.reducer,
        blog_comment_replies: blog_comment_replies.reducer,
        event_category: event_category.reducer,
        event_tags: event_tags.reducer,
        events: events.reducer,
        event_certified_users: event_certified_users.reducer,
        event_resources: event_resources.reducer,
        event_faqs: event_faqs.reducer,
        event_sessions: event_sessions.reducer,
        event_sessions_assesments: event_sessions_assesments.reducer,
        event_session_assesment_submissions:
            event_session_assesment_submissions.reducer,
        event_attendance: event_attendance.reducer,
        event_enrollments: event_enrollments.reducer,
        event_payments: event_payments.reducer,
        event_payment_refunds: event_payment_refunds.reducer,
        event_feedback_form_fields: event_feedback_form_fields.reducer,
        app_settings: app_settings.reducer,
        app_setting_values: app_setting_values.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
