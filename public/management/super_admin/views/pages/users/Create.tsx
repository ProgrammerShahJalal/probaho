import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import Select from './components/management_data_page/Select';
import InputImage from './components/management_data_page/InputImage';
import { anyObject } from '../../../common_types/object';
import UserRolesDropDown from '../user_roles/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [data, setData] = useState<anyObject>({});
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
        }
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

    useEffect(() => {
        if (get_value('role')) {
            setData((prevData) => ({
                ...prevData,
                role: get_value('role'),
            }));
        }
    }, [state.item]);

    const handleRoleSelection = useCallback((selectedRole) => {
        setData((prevData) => ({
            ...prevData,
            role: selectedRole.id,
        }));
    }, []);

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="mx-auto pt-3"
                        >
                            <div>
                                <h5 className="mb-4">User Informations</h5>
                                <div className="form_auto_fit">
                                    {[
                                        'first_name',
                                        'last_name',
                                        'email',
                                        'phone_number',
                                        'password',
                                        'role',
                                        'photo',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {i === 'role' ? (
                                                <>
                                                    <label>
                                                        User Roles
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </label>
                                                    <UserRolesDropDown
                                                        name="role"
                                                        multiple={false}
                                                        get_selected_data={
                                                            handleRoleSelection
                                                        }
                                                    />
                                                </>
                                            ) : i === 'photo' ? (
                                                <div className="form-group grid_full_width form-vertical">
                                                    <InputImage
                                                        required={true}
                                                        label="Photo"
                                                        name="photo"
                                                        defalut_preview={get_value(
                                                            'photo',
                                                        )}
                                                    />
                                                </div>
                                            ) : (
                                                <Input
                                                    name={i}
                                                    required={true}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group form-vertical">
                                <label></label>
                                <div className="form_elements">
                                    <button className="btn btn_1 btn-outline-info">
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
