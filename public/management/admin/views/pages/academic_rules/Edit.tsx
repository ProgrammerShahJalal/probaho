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
import UsersDropDown from '../users/components/dropdown/DropDown';
import AcademicYearsDropDown from '../academic_year/components/dropdown/DropDown';
import AcademicCalendarEventTypesDropDown from '../academic_calendar_event_types/components/dropdown/DropDown';
import { getValueForEdit } from '../utils/getValue';
import DateEl from '../../components/DateEl';
import { anyObject } from '../../../common_types/object';


export interface Props { }
interface Document {
    key?: string; // Optional: for React rendering
    id?: string; // Optional: for existing documents
    title: string;
    file: File | string; // File object for new/updated files, string (URL/path) for existing
    fileName?: string; // To display the name of an existing file
    issueDate: string;
    expireDate: string;
}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const [focusedDropdown, setFocusedDropdown] = useState<anyObject>({});

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, [dispatch, params.id]);


    async function handle_submit(e) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        let form_data = new FormData(form);
        const response = await dispatch(update(form_data) as any);
    }

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <div className="container-fluid">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-xl-10 col-xxl-8">
                                        <form
                                            onSubmit={(e) => handle_submit(e)}
                                            className="px-3 pt-3"
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                defaultValue={getValueForEdit(state, `id`)}
                                            />

                                            <div className="row g-3">
                                                {state.item.is_locked && (
                                                    <div className="col-12">
                                                        <div className="alert alert-warning mb-3">
                                                            This academic year is locked and cannot be edited.
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Row 1: Branch User and Academic Year */}
                                                <div className="col-12">
                                                    <div className="row g-3">
                                                        <div className="col-12 col-md-6 col-lg-6">
                                                            <div className="form-group form-vertical">
                                                                <label className="form-label">Branch User</label>
                                                                <UsersDropDown
                                                                    name="branch_user_id"
                                                                    multiple={false}
                                                                    default_value={
                                                                        getValueForEdit(state, 'branch_user_id')
                                                                            ? [
                                                                                {
                                                                                    id: getValueForEdit(state, 'branch_user_id'),
                                                                                },
                                                                            ]
                                                                            : []
                                                                    }
                                                                    get_selected_data={(data) =>
                                                                        console.log(data)
                                                                    }
                                                                    isFocused={focusedDropdown["branch_user_id"]}
                                                                    onFocus={() => setFocusedDropdown({ branch_user_id: true })}
                                                                    onBlur={() => setFocusedDropdown({ branch_user_id: false })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-6 col-lg-6">
                                                            <div className="form-group form-vertical">
                                                                <label className="form-label">Academic Year</label>
                                                                <AcademicYearsDropDown
                                                                    name="academic_year_id"
                                                                    multiple={false}
                                                                    default_value={
                                                                        getValueForEdit(state, 'academic_year_id')
                                                                            ? [
                                                                                {
                                                                                    id: getValueForEdit(state, 'academic_year_id'),
                                                                                },
                                                                            ]
                                                                            : []
                                                                    }
                                                                    get_selected_data={(data) =>
                                                                        console.log(data)
                                                                    }
                                                                    isFocused={focusedDropdown["academic_year_id"]}
                                                                    onFocus={() => setFocusedDropdown({ academic_year_id: true })}
                                                                    onBlur={() => setFocusedDropdown({ academic_year_id: false })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="row g-3">
                                                        {/* Row 2: Academic Calendar Event Type and Date */}
                                                        <div className="col-12 col-md-6 col-lg-6">
                                                            <div className="form-group form-vertical">
                                                                <label className="form-label">Academic Calendar Event Type</label>
                                                                <AcademicCalendarEventTypesDropDown
                                                                    name="academic_calendar_event_types_id"
                                                                    multiple={false}
                                                                    default_value={
                                                                        getValueForEdit(state, 'academic_calendar_event_types_id')
                                                                            ? [
                                                                                {
                                                                                    id: getValueForEdit(state, 'academic_calendar_event_types_id'),
                                                                                },
                                                                            ]
                                                                            : []
                                                                    }
                                                                    get_selected_data={(data) =>
                                                                        console.log(data)
                                                                    }
                                                                    isFocused={
                                                                        focusedDropdown["academic_calendar_event_types_id"]
                                                                    }
                                                                    onFocus={() => setFocusedDropdown({ academic_calendar_event_types_id: true })}
                                                                    onBlur={() => setFocusedDropdown({ academic_calendar_event_types_id: false })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-6 col-lg-6">
                                                            <div className="form-group form-vertical">
                                                                <DateEl
                                                                    label='Date'
                                                                    name={'date'}
                                                                    value={getValueForEdit(state, 'date')}
                                                                    handler={(data) => dispatch(storeSlice.actions.set_item({ ...state.item, ['date']: data.value }))}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Row 3: Event Name */}
                                                <div className="col-12">
                                                    <div className="form-group form-vertical">
                                                        <Input name="event_name" value={getValueForEdit(state, 'event_name')} />
                                                    </div>
                                                </div>

                                                {/* Row 4: Description */}
                                                <div className="col-12">
                                                    <div className="form-group form-vertical">
                                                        <label className="form-label">Description</label>
                                                        <textarea
                                                            name="description"
                                                            className="form-control"
                                                            rows={4}
                                                            defaultValue={getValueForEdit(state, 'description')}
                                                            placeholder="Enter description..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="form-group form-vertical">
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="btn btn-outline-info px-4 py-2"
                                                                disabled={state.item.is_locked}
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
