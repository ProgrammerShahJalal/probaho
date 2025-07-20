import React from 'react';
import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';

import academic_year from '../views/pages/academic_year/config/routes';

import users from '../views/pages/users/config/routes';
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
            academic_year,
            users,
            user_roles,
            user_login_histories,
            contact_messages,
            profile_routes,
        ],
    },
];

export default router;
