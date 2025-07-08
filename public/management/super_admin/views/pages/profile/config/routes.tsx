import React from 'react';
import type { NonIndexRouteObject } from 'react-router-dom';
import ProfilePage from '../ProfilePage';

interface RouteTypes extends NonIndexRouteObject {}

const routes: RouteTypes = {
    path: 'profile', // This will be nested under '/' in the main router
    element: <ProfilePage />,
    // children: [ // Example if ProfilePage had sub-routes
    //     {
    //         path: 'details',
    //         element: <ProfileDetails />,
    //     },
    // ],
};

export default routes;
