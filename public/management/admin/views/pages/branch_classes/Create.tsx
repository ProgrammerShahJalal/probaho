import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import { anyObject } from '../../../common_types/object';
import UsersDropDown from '../users/components/dropdown/DropDown';
import AcademicYearsDropDown from '../academic_year/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import BranchClassBuildingsDropDown from '../branch_class_buildings/components/dropdown/DropDown';

import { useSelector } from 'react-redux';


export interface Props { }


const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [data, setData] = useState<anyObject>({});
    const [focusedDropdown, setFocusedDropdown] = useState<anyObject>({});
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);

        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            setData({});
        }
    }

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-12 col-xl-10 col-xxl-8">
                                    <form
                                        onSubmit={(e) => handle_submit(e)}
                                        className="px-3 px-md-4 pt-3"
                                    >
                                        <div className="row g-3">

                                            {/* Row 1: Branch User and Academic Year */}
                                            <div className="col-12">
                                                <div className="row g-3">
                                                    <div className="col-12 col-md-6">
                                                        <div className="form-group form-vertical">
                                                            <label className="form-label">Branch User</label>
                                                            <UsersDropDown
                                                                name="branch_user_id"
                                                                multiple={true}
                                                                get_selected_data={(result) =>
                                                                    console.log(result)
                                                                }
                                                                isFocused={focusedDropdown["branch_user_id"]}
                                                                onFocus={() => setFocusedDropdown({ branch_user_id: true })}
                                                                onBlur={() => setFocusedDropdown({ branch_user_id: false })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="form-group form-vertical">
                                                            <label className="form-label">Academic Year</label>
                                                            <AcademicYearsDropDown
                                                                name="academic_year_id"
                                                                multiple={false}
                                                                get_selected_data={(result) =>
                                                                    console.log(result)
                                                                }
                                                                isFocused={focusedDropdown["academic_year_id"]}
                                                                onFocus={() => setFocusedDropdown({ academic_year_id: true })}
                                                                onBlur={() => setFocusedDropdown({ academic_year_id: false })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="form-group form-vertical">
                                                            <Input name="title" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="form-group form-vertical">
                                                            <Input name="code" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-12">
                                                <div className="form-group form-vertical">
                                                    <div className="d-flex justify-content-center">
                                                        <button
                                                            className="btn btn_1 btn-outline-info px-4 py-2"
                                                            type="submit"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
