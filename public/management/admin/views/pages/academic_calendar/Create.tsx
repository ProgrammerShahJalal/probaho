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
import AcademicCalendarEventTypeDropDown from '../academic_calendar_event_types/components/dropdown/DropDown';
import DateEl from '../../components/DateEl';

import { useSelector } from 'react-redux';


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
                                
                                {/* Row 1: Branch User and Academic Year */}
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <div className="form-group form-vertical">
                                            <label>Branch User</label>
                                            <UsersDropDown
                                                name="branch_user_id"
                                                multiple={false}
                                                get_selected_data={(result) =>
                                                    console.log(result)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group form-vertical">
                                            <label>Academic Year</label>
                                            <AcademicYearsDropDown
                                                name="academic_year_id"
                                                multiple={false}
                                                get_selected_data={(result) =>
                                                    console.log(result)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group form-vertical">
                                            <label>Academic Calendar Event Type</label>
                                            <AcademicCalendarEventTypeDropDown
                                                name="academic_calendar_event_types_id"
                                                multiple={false}
                                                get_selected_data={(result) =>
                                                    console.log(result)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Title */}
                                <div className="row mb-3">
                                    <div className="col-8">
                                        <div className="form-group form-vertical">
                                            <Input name="event_name" />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group form-vertical">
                                            <DateEl
                                                    label='Date'
                                                    name={'date'}
                                                    value={data['date'] || ''}
                                                    handler={(d) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            ['date']: d.value,
                                                        }))
                                                    }
                                                />

                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Description */}
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <div className="form-group form-vertical">
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                className="form-control"
                                                rows={4}
                                                placeholder="Enter description..."
                                            />
                                        </div>
                                    </div>
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
