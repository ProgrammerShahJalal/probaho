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
import DateEl from '../../components/DateEl';

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
            setData({}); // Reset data state after successful submission
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

    // Prevent 'e' and other non-numeric characters in number input
    const handleNumberKeyDown = (e) => {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
    };

    // Update base_salary_in_text when base_salary changes
    useEffect(() => {
        const value = data['base_salary'] || '';
        let el = document.querySelector('input[name="base_salary_in_text"]');
        if (el) {
            (el as HTMLInputElement).value = value ? (window as any).convertAmount(value).bn + ' টাকা মাত্র' : '';
        }
    }, [data['base_salary']]);

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
                                        'name',
                                        'email',
                                        'phone_number',
                                        'password',
                                        'role',
                                        'photo',
                                        'join_date',
                                        'base_salary',
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
                                            ) : i === 'join_date' ? (
                                                <DateEl
                                                    label='Join Date'
                                                    name={i}
                                                    value={data[i] || ''}
                                                    handler={(d) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            [i]: d.value,
                                                        }))
                                                    }
                                                />
                                            ) : i === 'base_salary' ? (
                                                <>
                                                    <Input
                                                        type="number"
                                                        name={i}
                                                        value={data[i] || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData((prev) => ({
                                                                ...prev,
                                                                [i]: value,
                                                            }));
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
                                            ) : (
                                                <Input
                                                    name={i}
                                                    required={
                                                        i !== 'base_salary' &&
                                                        i !== 'join_date'
                                                    }
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
