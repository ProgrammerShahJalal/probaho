import React from 'react';
import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';

import users from '../views/pages/users/config/routes';
import user_roles from '../views/pages/user_roles/config/routes';
import user_login_histories from '../views/pages/user-login-histories/config/routes';

import app_settings from '../views/pages/app_settings/config/routes';
import app_setting_values from '../views/pages/app_setting_values/config/routes';

import blog_category from '../views/pages/blog_category/config/routes';
import blog_comments from '../views/pages/blog_comments/config/routes';
import blog_comment_replies from '../views/pages/blog_comment_replies/config/routes';
import blog_tags from '../views/pages/blog_tags/config/routes';
import blogs from '../views/pages/blogs/config/routes';



interface RouteTypes extends NonIndexRouteObject { }
const router: RouteTypes[] = [
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            {
                path: '',
                element: <T1 />,
            },
            users,
            user_roles,
            user_login_histories,
            blog_category,
            blog_tags,
            blog_comments,
            blog_comment_replies,
            blogs,
            app_settings,
            app_setting_values,
        ],
    },
];

export default router;
