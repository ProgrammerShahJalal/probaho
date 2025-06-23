import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { update } from './config/store/async_actions/update';
import Input from './components/management_data_page/Input';
import InputImage from './components/management_data_page/InputImage';
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';

export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        form_data.append('user_infos', state.item.user_infos || '');
        form_data.append('user_documents', state.item.user_documents || '');
        const response = await dispatch(update(form_data) as any);
    }

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    // Prevent 'e' and other non-numeric characters in number input
    const handleNumberKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <form
                                onSubmit={(e) => handle_submit(e)}
                                className="mx-auto pt-3"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    defaultValue={get_value(`id`)}
                                />

                                <div>
                                    <h5 className="mb-4">Input Data</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'name',
                                            'phone_number',
                                            'role',
                                            'is_verified',
                                            'is_approved',
                                            'is_blocked',
                                            'photo',
                                            'join_date',
                                            'base_salary',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                {i === 'base_salary' ? (
                                                    <>
                                                        <Input
                                                            type='number'
                                                            name={i}
                                                            value={get_value(i)}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                dispatch(storeSlice.actions.set_item({
                                                                    ...state.item,
                                                                    [i]: value,
                                                                }));
                                                                let el = document.querySelector('input[name="base_salary_in_text"]');
                                                                if (el) {
                                                                    (el as HTMLInputElement).value = value ? (window as any).convertAmount(value).bn + ' টাকা মাত্র' : '';
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberKeyDown}
                                                        />
                                                        <div className="form-group form-vertical mt-2">
                                                            <input
                                                                type="text"
                                                                name="base_salary_in_text"
                                                                id="base_salary_in_text"
                                                                readOnly
                                                                className="form-control mt-1"
                                                                placeholder="Base salary in words"
                                                            />
                                                        </div>
                                                    </>
                                                ) : i === 'name' || i === 'phone_number' ? (
                                                    <Input name={i} value={get_value(i)} />
                                                ) : i === 'join_date' ? (
                                                    <DateEl
                                                        label="Join Date"
                                                        name={i}
                                                        value={get_value(i) ? String(get_value(i)).slice(0, 10) : ''}
                                                        handler={(data) => dispatch(storeSlice.actions.set_item({ ...state.item, [i]: data.value }))}
                                                    />
                                                ) : i === 'photo' ? (
                                                    <div className="form-group grid_full_width form-vertical">
                                                        <InputImage
                                                            label="Photo"
                                                            name="photo"
                                                            defalut_preview={get_value('photo')}
                                                        />
                                                    </div>
                                                ) : i === 'role' ? (
                                                    <>
                                                        <label>
                                                            User Roles
                                                        </label>
                                                        <UserRolesDropDown
                                                            name="role"
                                                            multiple={false}
                                                            default_value={
                                                                get_value(
                                                                    'role',
                                                                )
                                                                    ? [
                                                                        {
                                                                            id: get_value(
                                                                                'role',
                                                                            ),
                                                                        },
                                                                    ]
                                                                    : []
                                                            }
                                                            get_selected_data={(
                                                                data,
                                                            ) =>
                                                                console.log(
                                                                    data,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <div>
                                                        <label>{i}</label>
                                                        <div>
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name={i}
                                                                    value="1"
                                                                    checked={
                                                                        get_value(
                                                                            i,
                                                                        ) == '1'
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        dispatch(
                                                                            storeSlice.actions.set_item(
                                                                                {
                                                                                    ...state.item,
                                                                                    [i]: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            ),
                                                                        )
                                                                    }
                                                                />{' '}
                                                                Yes
                                                            </label>
                                                            <label className="">
                                                                <input
                                                                    type="radio"
                                                                    name={i}
                                                                    value="0"
                                                                    checked={
                                                                        get_value(
                                                                            i,
                                                                        ) == '0'
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        dispatch(
                                                                            storeSlice.actions.set_item(
                                                                                {
                                                                                    ...state.item,
                                                                                    [i]: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                            ),
                                                                        )
                                                                    }
                                                                />{' '}
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-4">User Informations</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'user_infos',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                
                                                {/* <label>{i.replaceAll('_', ' ')}</label> */}
                                                <TextEditor
                                                    name={i}
                                                    value={get_value(i)}
                                                    onChange={(value) =>
                                                        dispatch(
                                                            storeSlice.actions.set_item({
                                                                ...state.item,
                                                                [i]: value,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-4">User Documents</h5>
                                    <div className="form_auto_fit">
                                        {[
                                            'user_documents',
                                        ].map((i) => (
                                            <div key={i} className="form-group form-vertical">
                                                
                                                {/* <label>{i.replaceAll('_', ' ')}</label> */}
                                                <TextEditor
                                                    name={i}
                                                    value={get_value(i)}
                                                    onChange={(value) =>
                                                        dispatch(
                                                            storeSlice.actions.set_item({
                                                                ...state.item,
                                                                [i]: value,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group form-vertical">
                                    <label></label>
                                    <div className="form_elements">
                                        <button className="btn btn-outline-info">
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <Footer>
                        {state?.item?.id && (
                            <li>
                                <Link
                                    to={`/${setup.route_prefix}/details/${state.item?.id}`}
                                    className="outline"
                                >
                                    <span className="material-symbols-outlined fill">
                                        visibility
                                    </span>
                                    <div className="text">Details</div>
                                </Link>
                            </li>
                        )}
                    </Footer>
                </div>
            </div>
        </>
    );
};

export default Edit;
