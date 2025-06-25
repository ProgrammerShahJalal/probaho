import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import user_roles from '../views/pages/user_roles/config/store';
import user_login_histories from '../views/pages/user-login-histories/config/store';

import blogs from '../views/pages/blogs/config/store';
import blog_category from '../views/pages/blog_category/config/store';
import blog_tags from '../views/pages/blog_tags/config/store';
import blog_comments from '../views/pages/blog_comments/config/store';
import blog_comment_replies from '../views/pages/blog_comment_replies/config/store';

import app_settings from '../views/pages/app_settings/config/store';
import app_setting_values from '../views/pages/app_setting_values/config/store';

const store = configureStore({
    reducer: {
        common_store: commonStore.reducer,
        users: users.reducer,
        user_roles: user_roles.reducer,
        user_login_histories: user_login_histories.reducer,
        blog_category: blog_category.reducer,
        blog_tags: blog_tags.reducer,
        blogs: blogs.reducer,
        blog_comments: blog_comments.reducer,
        blog_comment_replies: blog_comment_replies.reducer,
        app_settings: app_settings.reducer,
        app_setting_values: app_setting_values.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
