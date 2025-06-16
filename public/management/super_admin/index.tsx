import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import dashboard_routes from './routes/index.js';
import axios from 'axios';
import { anyObject } from '../../../src/common_types/object.js';
import './helpers/enToBn.js';

function Component() {
    const router = createHashRouter(dashboard_routes);
    return <RouterProvider router={router}></RouterProvider>;
}

const container: HTMLElement | null = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <Provider store={store}>
            <Component />
        </Provider>,
    );
}

(window as any).loader = (type = 'in') => {
    if (type == 'in') (window as any).jQuery('.loader-wrapper').fadeIn('slow');
    if (type == 'out')
        (window as any).jQuery('.loader-wrapper').fadeOut('slow');
};

axios.interceptors.request.use(
    function (config) {
        let form_errors = document.querySelectorAll('.form_error');
        [...form_errors].forEach((e) => e.remove());
        let has_errors = document.querySelectorAll('.has_error');
        [...has_errors].forEach((e) => e.classList.remove('has_error'));

        // if(event && event.type == 'submit'){
        //     (window as any).loader('in')
        // }
        // eslint-disable-next-line no-undef
        (window as any).loader('in');

        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    function (response) {
        (window as any).loader('out');
        return response;
    },
    function (error) {
        (window as any).loader('out');
        if (error.response.data.status === 422 || 500 || 409) {
            // Show the error message in toaster
            (window as anyObject).toaster(
                error.response.data.message || `${error.response.status} - ${error.response.statusText}`,
                'warning',
            );

            // If there are form errors (in data.data array), display them
            if (error.response.data.data && Array.isArray(error.response.data.data)) {
                let errors = error.response.data.data;
                errors.forEach((error) => {
                    let el = document.querySelector(`[name="${error.path}"], [id="${error.path}"]`);
                    if (el) {
                        // Add 'has_error' class to the parent
                        (el.parentNode as HTMLElement).classList.add('has_error');

                        // Find the closest common parent container (e.g., form-group-container)
                        let container = el.closest('.form-group-container');
                        if (container) {
                            // Insert the error message after the container
                            container.insertAdjacentHTML(
                                'beforeend',
                                `
                                <div class="form_error">
                                    ${error.msg}
                                </div>
                                `,
                            );
                        } else {
                            // Fallback: insert after the parent node if no container is found
                            (el.parentNode as HTMLElement)?.insertAdjacentHTML(
                                'beforeend',
                                `
                                <div class="form_error">
                                    ${error.msg}
                                </div>
                                `,
                            );
                        }
                    }
                });

                let error_el = document.querySelector('.has_error');
                if (error_el) {
                    setTimeout(() => {
                        error_el.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }, 300);
                }
            }
        }
        return Promise.reject(error);
    },
);
