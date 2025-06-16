import React, { useEffect } from 'react';
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


export interface Props { }

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    let statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'deactive', label: 'Deactive' },
    ];

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(update(form_data) as any);
    }

    function get_value(key) {
        try {
            // Handle nested user object
            if (key === 'user_id' && state.item.user) {
                return `${state.item.user.first_name} ${state.item.user.last_name}`;
            }

            // Handle nested blog object
            if (key === 'blog_id' && state.item.blog) {
                return state.item.blog.title;
            }
            // Handle nested parent comment object
            if (key === 'parent_comment_id' && state.item.parent_comment) {
                return state.item.parent_comment.comment;
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
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <form
                                onSubmit={(e) => handle_submit(e)}
                                className="mx-auto pt-3"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    defaultValue={get_value(`id`)}
                                />

                                <div>
                                    <div className="form-group form-vertical">
                                        <h6>
                                            {state.item.user?.first_name} {state.item.user?.last_name} {" "}
                                            commented on the blog post{" "}
                                            <em style={{ fontStyle: 'italic' }}>
                                                "{state.item.blog?.title}"
                                            </em>{" "}
                                            saying, "{state?.item?.parent_comment
                                                ?.comment}"
                                        </h6>
                                    </div>
                                    <div className="form_auto_fit">
                                        {['comment'].map((i) => (
                                            <div
                                                key={i}
                                                className="form-group form-vertical"
                                            >
                                                <Input
                                                    name={i}
                                                    label='Edit Replay'
                                                    value={get_value(i)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group form-vertical">
                                    <label></label>
                                    <div className="form_elements">
                                        <button className="btn btn-outline-info">
                                            submit
                                        </button>
                                    </div>
                                </div>
                            </form>
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
