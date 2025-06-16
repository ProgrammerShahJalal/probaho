import React from 'react';
import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';

import users from '../views/pages/users/config/routes';
import user_roles from '../views/pages/user_roles/config/routes';
import user_login_histories from '../views/pages/user-login-histories/config/routes';
import contact_messages from '../views/pages/contact_management/config/routes';

import app_settings from '../views/pages/app_settings/config/routes';
import app_setting_values from '../views/pages/app_setting_values/config/routes';

import blog_category from '../views/pages/blog_category/config/routes';
import blog_comments from '../views/pages/blog_comments/config/routes';
import blog_comment_replies from '../views/pages/blog_comment_replies/config/routes';
import blog_tags from '../views/pages/blog_tags/config/routes';
import blogs from '../views/pages/blogs/config/routes';

import event_category from '../views/pages/event_category/config/routes';
import event_tags from '../views/pages/event_tags/config/routes';
import events from '../views/pages/events/config/routes';
import event_certified_users from '../views/pages/event_certified_users/config/routes';
import event_resources from '../views/pages/event_resources/config/routes';
import event_faqs from '../views/pages/event_faqs/config/routes';
import event_sessions from '../views/pages/event_sessions/config/routes';
import event_sessions_assesments from '../views/pages/event_sessions_assesments/config/routes';
import event_session_assesment_submissions from '../views/pages/event_session_assesment_submissions/config/routes';
import event_attendance from '../views/pages/event_attendance/config/routes';
import event_enrollments from '../views/pages/event_enrollments/config/routes';
import event_payments from '../views/pages/event_payments/config/routes';
import event_payment_refunds from '../views/pages/event_payment_refunds/config/routes';
import event_feedback_form_fields from '../views/pages/event_feedback_form_fields/config/routes';


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
            contact_messages,
            blog_category,
            blog_tags,
            blog_comments,
            blog_comment_replies,
            blogs,
            event_category,
            event_tags,
            events,
            event_certified_users,
            event_resources,
            event_faqs,
            event_sessions,
            event_sessions_assesments,
            event_session_assesment_submissions,
            event_attendance,
            event_enrollments,
            event_payments,
            event_payment_refunds,
            event_feedback_form_fields,
            app_settings,
            app_setting_values,
        ],
    },
];

export default router;
