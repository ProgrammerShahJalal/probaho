import React from 'react';
import setup from './setup.ts';
import Layout from '../Layout.tsx';
import All from '../All.tsx';
import Create from '../Create.tsx';
import Details from '../Details.tsx';
import Edit from '../Edit.tsx';

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
