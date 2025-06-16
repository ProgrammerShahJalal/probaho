import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
import DeleteButtonSub from './components/all_data_page/DeleteButtonSub';
import DestroyButtonSub from './components/all_data_page/DestroyButtonSub';
export interface Props { }

export interface FAQ {
    id: number;
    event_id: number;
    title: string;
    description: string;
    status: string;
}

const Details: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const [faqs, setFaqs] = React.useState<FAQ[]>([]);

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const eventId = state.item?.event_id || state.item?.event?.id;
                if (!eventId) return;

                const response = await axios.get(`/api/v1/event-faqs/by-event/${eventId}`);
                setFaqs(response?.data?.data?.filter((faq: FAQ) => faq.status === 'active'));
            } catch (error) {
                console.error("Failed to load FAQs", error);
            }
        };

        if (state.item?.event_id || state.item?.event?.id) {
            fetchFAQs();
        }
    }, [state.item]);


    function get_value(key) {
        try {
            // Handle nested blog object
            if (key === 'event_id' && state.item.event) {
                return state.item.event.title;
            }

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
                    <Header page_title={setup.details_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">

                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-center">{get_value('event_id')}</h2>

                            {faqs.length > 0 && (
                                <div className="my-6 px-4">
                                    <h4 className="text-lg font-semibold mb-4 border-b pb-2">Frequently Asked Questions</h4>
                                    <div className="space-y-4">
                                        {faqs.map((faq: FAQ, index) => (
                                            <details key={faq.id || index} className="rounded-md shadow-sm p-4 cursor-pointer border">

                                                <summary className="font-medium text-gray-100"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',


                                                    }}
                                                >
                                                    <span>{faq.title}</span>

                                                    {state.item?.id && (
                                                        <ul className="space-x-4 text-sm text-indigo-400"
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'flex-between',
                                                                alignItems: 'center',
                                                                gap: 10

                                                            }}
                                                        >
                                                            <li>
                                                                <Link to={`/${setup.route_prefix}/edit/${faq.id}`} className="hover:underline">
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <DeleteButtonSub item={faq} onDelete={(id) => {
                                                                    setFaqs(prev => prev.filter(f => f.id !== id));
                                                                }} />

                                                            </li>
                                                            <li>
                                                                <DestroyButtonSub item={faq} onDelete={(id)=>{
                                                                    setFaqs(prev => prev.filter(f => f.id !== id));
                                                                }}/>
                                                            </li>
                                                        </ul>
                                                    )}
                                                </summary>


                                                <p className="text-gray-600 mt-2">{faq.description}</p>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    <Footer>
                    </Footer>
                </div>
            </div>
        </>
    );
};

export default Details;
