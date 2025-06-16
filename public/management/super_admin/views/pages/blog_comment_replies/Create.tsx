import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import Input from './components/management_data_page/Input';
import Select from './components/management_data_page/Select';
import InputImage from './components/management_data_page/InputImage';
import { anyObject } from '../../../common_types/object';
import BlogDropDown from "../blogs/components/dropdown/DropDown";
import UserDropDown from "../users/components/dropdown/DropDown";
import CommentDropDown from "../blog_comments/components/dropdown/DropDown";

export interface Props { }


const Create: React.FC<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    async function handle_submit(e) {
        e.preventDefault();
        let form_data = new FormData(e.target);
        const response = await dispatch(store(form_data) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            // init_nominee();
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

                                <h5 className="mb-4">Comments Informations</h5>

                                <div className="form-group form-vertical">
                                    <label>Blogs</label>
                                    <BlogDropDown name="blogs"
                                        multiple={false}
                                        get_selected_data={(data) => {
                                            console.log(data)
                                        }}
                                    />
                                </div>

                                <div className="form-group form-vertical">
                                    <label>Users</label>
                                    <UserDropDown name="users"
                                        multiple={false}
                                        get_selected_data={(data) => {
                                            console.log(data)
                                        }}
                                    />
                                </div>

                                <div className="form-group form-vertical">
                                    <label>Parent Comment</label>
                                    <CommentDropDown name="parent_comment_id"

                                        multiple={false}
                                        get_selected_data={(data) => {
                                            console.log(data)
                                        }}
                                    />
                                </div>

                                <div className="form_auto_fit">

                                    {[
                                        'comment',
                                    ].map((i) => (
                                        <div className="form-group form-vertical">
                                            <Input name={i} />
                                        </div>
                                    ))}

                                    {/* <div className="form-group grid_full_width form-vertical">
                                        <InputImage
                                            label={'image'}
                                            name={'image'}
                                        />
                                    </div> */}

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
