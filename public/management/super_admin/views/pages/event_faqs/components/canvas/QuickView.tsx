import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import moment from 'moment/moment';
import axios from 'axios';
import { FAQ } from '../../Details';
export interface Props {}

const modalRoot = document.getElementById('filter-root');

const QuickView: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    const [faqs, setFaqs] = React.useState([]);

    function close_canvas(action: boolean = true) {
        dispatch(storeSlice.actions.set_show_quick_view_canvas(action));
    }

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const eventId = state.item?.event_id || state.item?.event?._id;
                if (!eventId) return;

                const response = await axios.get(
                    `/api/v1/event-faqs/by-event/${eventId}`,
                );
                console.log('response', response.data);
                setFaqs(response.data.data);
            } catch (error) {
                console.error('Failed to load FAQs', error);
            }
        };

        if (state.item?.event_id || state.item?.event?._id) {
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

    if (modalRoot && state.show_quick_view_canvas) {
        return createPortal(
            <div className="off_canvas quick_view">
                <div className="off_canvas_body">
                    <div className="header">
                        <h3 className="heading_text">Quick View</h3>
                        <button
                            className="close_button"
                            onClick={() => close_canvas(false)}
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="data_content">
                        {Object.keys(state.item).length > 0 && (
                            <div
                                className="content_body custom_scroll"
                                style={{
                                    width: '100%',
                                    maxWidth: '38rem',
                                    margin: '0 auto',
                                    padding: '0 1rem',
                                }}
                            >
                                <div className="max-w-4xl mx-auto w-full px-4">
                                    <h4 className="text-base font-semibold mb-6 border-b pb-3 break-words">
                                        {get_value('event_id')}
                                    </h4>

                                    {faqs.length > 0 && (
                                        <div className="mb-6 flex-wrap">
                                            <h5 className="text-base font-semibold mb-4 border-b pb-2 text-gray-800 text-wrap">
                                                Frequently Asked Questions
                                            </h5>
                                            <div className="space-y-4 text-wrap">
                                                {faqs.map((faq: FAQ, index) => (
                                                    <details
                                                        key={faq.id || index}
                                                        className="flex-wrap text-wrap rounded-md shadow-sm p-4 border cursor-pointer"
                                                    >
                                                        <summary className="text-wrap font-medium text-gray-900 break-words">
                                                            {faq.title}
                                                        </summary>
                                                        <p className="text-wrap text-gray-700 mt-2 whitespace-pre-wrap break-words">
                                                            {faq.description}
                                                        </p>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="off_canvas_overlay"></div>
            </div>,
            modalRoot,
        );
    } else {
        return <></>;
    }
};

export default QuickView;
