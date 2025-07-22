import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import Select from './components/management_data_page/Select';
import InputImage from './components/management_data_page/InputImage';
import InputFile from './components/management_data_page/InputFile';
import { anyObject } from '../../../common_types/object';
import UsersDropDown from '../users/components/dropdown/DropDown';
import AcademicYearsDropDown from '../academic_year/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import { getValue } from '../utils/getValue';
import DateEl from '../../components/DateEl';
import TextEditor from './components/management_data_page/TextEditor';
import BloodGroupSelector from './components/management_data_page/BloodGroupSelector';

export interface Props { }


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
            setData({});
        }
    }

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
                                <h5 className="mb-4">Basic Informations</h5>
                                <div className="form_auto_fit">
                                    {[
                                        'branch_user_id',
                                        'academic_year_id',
                                        'title',
                                        'description',
                                        'value',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {
                                                i === 'branch_user_id' ? (
                                                    <>
                                                    <label>Branch User</label>
                                                    <UsersDropDown
                                                        name={i}
                                                        multiple={false}
                                                        get_selected_data={(result) =>
                                                            console.log(result)
                                                        }
                                                    />
                                                    </>
                                                ) : i === 'academic_year_id' ? (
                                                    <>
                                                    <label>Academic Year</label>
                                                    <AcademicYearsDropDown
                                                        name={i}
                                                        multiple={false}
                                                        get_selected_data={(result) =>
                                                            console.log(result)
                                                        }
                                                    />
                                                    </>
                                                ) : (

                                                    <Input name={i} />
                                                )


                                            }

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
