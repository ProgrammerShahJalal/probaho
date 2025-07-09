import React from 'react';
import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';

import users from '../views/pages/users/config/routes';
import all_users from '../views/pages/all_users/config/routes';
import user_roles from '../views/pages/user_roles/config/routes';
import user_login_histories from '../views/pages/user-login-histories/config/routes';
import contact_messages from '../views/pages/contact_management/config/routes';

import profile_routes from '../views/pages/profile/config/routes';


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
            all_users,
            user_roles,
            user_login_histories,
            contact_messages,
            profile_routes,
        ],
    },
];

export default router;
