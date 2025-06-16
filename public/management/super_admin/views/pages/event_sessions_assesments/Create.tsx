import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import InputImage from './components/management_data_page/InputImage';
import { anyObject } from '../../../common_types/object';
import DateEl from '../../components/DateEl';
import storeSlice from './config/store';
import { useParams } from 'react-router-dom';
import { details } from './config/store/async_actions/details';
import Select from 'react-select';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from '../events/components/dropdown/DropDown';
import SessionDropDown from '../event_sessions/components/dropdownMatch/DropDown';
import axios from 'axios';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [data, setData] = useState<anyObject>({});
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
        null,
    );
    const [event, setEvent] = useState<Event | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        // Check if description is empty
        const description = data.getData();
        if (!description || description.trim() === '') {
            (window as anyObject).toaster('Description is required', 'warning'); // Add 'warning' as second parameter
            return; // Stop form submission
        }
        form_data.append('description', data.getData());

        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
        }
    }

    const dispatch = useAppDispatch();
    const params = useParams();

    // useEffect(() => {
    //     dispatch(storeSlice.actions.set_item({}));
    //     dispatch(details({ id: params.id }) as any);
    // }, []);

    // Fetch sessions when event is selected
    useEffect(() => {
        if (!selectedEventId) {
            setSessions([]);
            setSelectedSessionId(null);
            return;
        }

        const fetchEventAndSessions = async () => {
            setLoading(true);
            setError(null);
            try {
                const [eventRes, sessionsRes] = await Promise.all([
                    axios.get(`/api/v1/events/${selectedEventId}`),
                    axios.get(
                        `/api/v1/event-sessions/event/${selectedEventId}`,
                    ),
                ]);

                setEvent(eventRes.data.data);
                setSessions(sessionsRes.data.data);
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

    /* CKEDITOR RICH TEXT*/
    useEffect(() => {
        let editor = CKEDITOR.replace('description');
        setData(editor);
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
                                <h5 className="mb-4">
                                    Events Sessions Assesments Informations
                                </h5>
                                <div className="row">
                                    <div className="col-8">
                                        <label className="mb-4">
                                            Description
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <div
                                            id="description"
                                            className="pb-6"
                                        ></div>

                                        {['title', 'mark', 'pass_mark'].map(
                                            (i) => (
                                                <div className="form-group form-vertical">
                                                    {i === 'mark' || i === 'pass_mark' ? (
                                                        <Input
                                                            type="number"
                                                            name={i}
                                                            required={true}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            name={i}
                                                            required={true}
                                                        />
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="col-4">
                                        <div className="form_auto_fit">
                                            <div className="form-group form-vertical">
                                                <label>
                                                    Events
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <EventDropDown
                                                    name="events"
                                                    multiple={false}
                                                    get_selected_data={(
                                                        data,
                                                    ) => {
                                                        setSelectedEventId(
                                                            Number(data.ids),
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group form-vertical">
                                                <label>
                                                    Sessions
                                                    <span
                                                        style={{ color: 'red' }}
                                                    >
                                                        *
                                                    </span>
                                                </label>
                                                <SessionDropDown
                                                    name="sessions"
                                                    multiple={false}
                                                    disabled={!selectedEventId}
                                                    options={sessions.map(
                                                        (session) => ({
                                                            id: session.id,
                                                            title: session.title,
                                                        }),
                                                    )}
                                                    get_selected_data={(
                                                        data,
                                                    ) => {
                                                        setSelectedSessionId(
                                                            Number(data.ids),
                                                        );
                                                    }}
                                                />
                                            </div>

                                            {['start', 'end'].map((i) => (
                                                <div className="form-group form-vertical">
                                                    <Input
                                                        type="time"
                                                        name={i}
                                                        required={true}
                                                    />
                                                </div>
                                            ))}
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
