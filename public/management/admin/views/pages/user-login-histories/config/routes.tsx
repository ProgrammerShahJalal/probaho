import React from 'react';
import setup from './setup.js';
import Layout from '../Layout.js';
import All from '../All.js';
import Create from '../Create.js';
import Details from '../Details.js';
import Edit from '../Edit.js';
import History from '../History.js';

// export { default as DashboardCounterAll} from "./All.jsx";

export default {
    path: setup.route_prefix,
    element: <Layout />,
    children: [
        {
            path: '',
            element: <All />,
        },
        {
            path: 'history',
            element: <History />,
        },
        {
            path: 'create',
            element: <Create />,
        },
        {
            path: 'edit/:id',
            element: <Edit />,
        },
        {
            path: 'details/:id',
            element: <Details />,
        },
    ],
};
