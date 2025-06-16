import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../store';
import { all } from './config/store/async_actions/all';
import setup from './config/setup';
import { initialState } from './config/store/inital_state';
import Header from './components/all_data_page/Header';
import TableFooter from './components/all_data_page/TableFooter';
import Paginate from '../../components/Paginate';
import Filter from './components/canvas/Filter';
import QuickView from './components/canvas/QuickView';
import storeSlice from './config/store';
import { anyObject } from '../../../common_types/object';
import TableRowAction from './components/all_data_page/TableRowAction';
import SelectItem from './components/all_data_page/SelectItem';
import SelectAll from './components/all_data_page/SelectIAll';
import TableHeading from './components/all_data_page/TableHeading';
import { useSearchParams } from 'react-router-dom';

export interface Props {}

const All: React.FC<Props> = () => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [pageTitle, setPageTitle] = useState('');
    const [userRolesMap, setUserRolesMap] = useState<{ [key: number]: string }>(
        {},
    );

    const dispatch = useAppDispatch();
    let [searchParams] = useSearchParams();


    useEffect(() => {
        let role = searchParams.get('role');
        if (role) {
            setPageTitle(role);
            dispatch(storeSlice.actions.set_role(role));
        } else {
            dispatch(storeSlice.actions.set_role('all'));
        }

        dispatch(
            storeSlice.actions.set_select_fields(
                'id,uid,role_serial,first_name,last_name,email,phone_number,photo,is_verified,is_blocked,status',
            ),
        );
        dispatch(all({}));

        // Fetch user roles and store them in a map
        fetch(
            `/api/v1/user-roles?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10&select_fields=`,
        )
            .then((res) => res.json())
            .then((data) => {
                const roleMap: { [key: number]: string } = {};
                data?.data?.data?.forEach(
                    (role: { serial: number; title: string }) => {
                        roleMap[role.serial] = role.title;
                    },
                );
                setUserRolesMap(roleMap);
            })
            .catch((err) => console.error('Error fetching user roles:', err));
    }, [searchParams]);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header title={pageTitle + ' Users'} />

                <div className="content_body">
                    <div className="data_list">
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>
                                            <SelectAll />
                                        </th>
                                        <TableHeading
                                            label="ID"
                                            col_name="id"
                                            sort
                                        />
                                        <TableHeading
                                            label="User ID"
                                            col_name="uid"
                                            sort
                                        />
                                        <TableHeading
                                            label="Role Serial"
                                            col_name="role_serial"
                                            sort
                                        />
                                        <TableHeading
                                            label="Role"
                                            col_name="role_serial"
                                            sort
                                        />
                                        <TableHeading
                                            label="Photo"
                                            col_name="photo"
                                            sort
                                        />
                                        <TableHeading
                                            label="First Name"
                                            col_name="first_name"
                                            sort
                                        />
                                        <TableHeading
                                            label="Last Name"
                                            col_name="last_name"
                                            sort
                                        />
                                        <TableHeading
                                            label="Email"
                                            col_name="email"
                                            sort
                                        />
                                        <TableHeading
                                            label="Is Verified"
                                            col_name="is_verified"
                                            sort
                                        />
                                        <TableHeading
                                            label="Is Blocked"
                                            col_name="is_blocked"
                                            sort
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {(state.all as any)?.data?.map(
                                        (i: { [key: string]: any }) => (
                                            <tr
                                                key={i.id}
                                                className={`table_rows table_row_${i.id}`}
                                            >
                                                <td>
                                                    <TableRowAction item={i} />
                                                </td>
                                                <td>
                                                    <SelectItem item={i} />
                                                </td>
                                                <td>{i.id}</td>
                                                <td>{i.uid || ''}</td>
                                                <td>{i.role_serial}</td>
                                                <td>
                                                    {userRolesMap[
                                                        i.role_serial
                                                    ] || 'Unknown'}
                                                </td>
                                                <td>
                                                    <img
                                                        src={
                                                            i.photo
                                                                ? `/${i.photo}`
                                                                : '/assets/dashboard/images/avatar.png'
                                                        }
                                                        alt=""
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <span
                                                        className="quick_view_trigger"
                                                        onClick={() =>
                                                            quick_view(i)
                                                        }
                                                    >
                                                        {i.first_name}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className="quick_view_trigger"
                                                        onClick={() =>
                                                            quick_view(i)
                                                        }
                                                    >
                                                        {i.last_name}
                                                    </span>
                                                </td>
                                                <td>{i.email}</td>
                                                <td>
                                                    {i.is_verified === '1'
                                                        ? 'Yes'
                                                        : 'No'}
                                                </td>
                                                <td>
                                                    {i.is_blocked === '1'
                                                        ? 'Yes'
                                                        : 'No'}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Paginate
                            set_url={storeSlice.actions.set_url}
                            set_paginate={storeSlice.actions.set_paginate}
                            set_page={storeSlice.actions.set_page}
                            all={all}
                            data={state.all as any}
                            selected_paginate={state.paginate}
                        />
                    </div>
                </div>
                <TableFooter />
            </div>

            <Filter />
            <QuickView />
        </div>
    );
};

export default All;
