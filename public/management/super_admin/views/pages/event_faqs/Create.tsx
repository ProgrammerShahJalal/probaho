import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import EventDropDown from '../events/components/dropdown/DropDown';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [faqs, setFaqs] = useState<{ title: string; description: string }[]>(
        [],
    );

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (state.item?.faqs) {
            setFaqs(state.item.faqs);
        }
    }, [state.item]);

    const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('faqs', JSON.stringify(faqs)); // Append FAQs as JSON string
        await dispatch(store(formData) as any);
    };

    const handleFaqChange = (index: number, field: string, value: string) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
        setFaqs(updatedFaqs);
    };

    const addFaq = () => setFaqs([...faqs, { title: '', description: '' }]);

    const removeFaq = (index: number) => {
        const updatedFaqs = faqs.filter((_, i) => i !== index);
        setFaqs(updatedFaqs);
    };

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
                                    Event FAQs Informations
                                </h5>
                                <div>
                                    <div className="form-group form-vertical">
                                        <label>
                                            Events
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <EventDropDown
                                            name="event_id"
                                            multiple={false}
                                        />
                                    </div>

                                    <div className="form-group form-vertical">
                                        <Input
                                            name="title"
                                            value={get_value('title')}
                                            required={true}
                                        />
                                    </div>

                                    <div className="form-group form-vertical">
                                        <label>
                                            Description
                                            <span style={{ color: 'red' }}>
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            name="description"
                                            defaultValue={get_value(
                                                'description',
                                            )}
                                            className="form-control"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                {/* FAQ Section */}

                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="faq-item border p-3 mb-3 rounded"
                                    >
                                        <div className="form-group">
                                            <label>Title</label>
                                            <br />
                                            <input
                                                className="form-control"
                                                value={faq.title}
                                                onChange={(e) =>
                                                    handleFaqChange(
                                                        index,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={faq.description}
                                                onChange={(e) =>
                                                    handleFaqChange(
                                                        index,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm mt-2"
                                            onClick={() => removeFaq(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addFaq}
                                >
                                    + Add More FAQ
                                </button>
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
