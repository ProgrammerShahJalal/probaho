import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import Select from './components/management_data_page/Select';
import InputImage from './components/management_data_page/InputImage';
import { anyObject } from '../../../common_types/object';
import DropDown from './components/dropdown/DropDown';
import DateEl from '../../components/DateEl';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from '../events/components/dropdown/DropDown';
import UserDropDownMatch from '../users/components/dropdownMatch/DropDown';
import axios from 'axios';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
        null,
    );
    const [event, setEvent] = useState<Event | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clearImagePreview, setClearImagePreview] = useState(false);
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        setClearImagePreview(false); // Reset before submission
        let form_data = new FormData(e.target);
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            setClearImagePreview(true); // Trigger clearing the preview
            // init_nominee();
        }
        e.target.reset();
        setClearImagePreview(true); // Trigger clearing the preview
    }

    // Fetch sessions when event is selected
    useEffect(() => {
        if (!selectedEventId) {
            setUsers([]);
            setSelectedSessionId(null);
            return;
        }

        const fetchEventAndSessions = async () => {
            setLoading(true);
            setError(null);
            try {
                const [eventRes, usersRes] = await Promise.all([
                    axios.get(`/api/v1/events/${selectedEventId}`),
                    axios.get(
                        `/api/v1/event-enrollments/by-event/${selectedEventId}`,
                    ),
                ]);

                setEvent(eventRes.data.data);
                setUsers(usersRes.data.data);
            } catch {
                setError('Failed to fetch event data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndSessions();
    }, [selectedEventId]);

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.info[key]) return state.item?.info[key];
        } catch (error) {
            return '';
        }
        return '';
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
                                <h5 className="mb-4">
                                    Event Certified Users Informations
                                </h5>
                                <div className="form_auto_fit">
                                    <div className="form-group form-vertical">
                                        <label>
                                            Events
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <EventDropDown
                                            name="events"
                                            multiple={false}
                                            get_selected_data={(data) => {
                                                setSelectedEventId(
                                                    Number(data.ids),
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>
                                            Users
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <UserDropDownMatch
                                            name="users"
                                            multiple={false}
                                            disabled={!selectedEventId}
                                            options={users?.map((user) => ({
                                                id: user?.id,
                                                first_name: user?.first_name,
                                                last_name: user?.last_name,
                                            }))}
                                            get_selected_data={(data) => {
                                                setSelectedSessionId(
                                                    Number(data.ids),
                                                );
                                            }}
                                        />
                                    </div>

                                    {[
                                        'scores',
                                        'grade',
                                        'date',
                                        'is_submitted',
                                        'image',
                                    ].map((i) => (
                                        <div
                                            key={i}
                                            className="form-group form-vertical"
                                        >
                                            {i === 'date' ? (
                                                <>
                                                    <label>
                                                        Date
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </label>
                                                    <DateEl
                                                        value={get_value(
                                                            'date',
                                                        )}
                                                        name="date"
                                                        handler={() =>
                                                            console.log(
                                                                'Date added',
                                                            )
                                                        }
                                                    />
                                                </>
                                            ) : i === 'is_submitted' ? (
                                                <>
                                                    <label>Is Submitted?</label>
                                                    <div className="flex flex-1">
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="is_submitted"
                                                                value="1"
                                                                defaultChecked={
                                                                    get_value(
                                                                        'is_submitted',
                                                                    ) === '1'
                                                                }
                                                            />{' '}
                                                            Yes
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="is_submitted"
                                                                value="0"
                                                                defaultChecked={
                                                                    get_value(
                                                                        'is_submitted',
                                                                    ) === '0'
                                                                }
                                                            />{' '}
                                                            No
                                                        </label>
                                                    </div>
                                                </>
                                            ) : i === 'image' ? (
                                                <div className="form-group grid_full_width form-vertical">
                                                    <InputImage
                                                        label={
                                                            'Upload certificate image'
                                                        }
                                                        name={'image'}
                                                        clearPreview={
                                                            clearImagePreview
                                                        }
                                                        required={true}
                                                    />
                                                </div>
                                            ) : (
                                                <Input
                                                    required={true}
                                                    name={i}
                                                    value={get_value(i)}
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
