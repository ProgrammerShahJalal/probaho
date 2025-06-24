import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { store } from './config/store/async_actions/store';
import { anyObject } from '../../../common_types/object';
import storeSlice from './config/store';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import FormRenderer from '../../../components/form_elements/FormRenderer';
import { blogFormFields, blogModuleConfig } from './config/form.config';
import BlogCategoryDropDown from '../blog_category/components/dropdown/DropDown';
import BlogTagDropDown from '../blog_tags/components/dropdown/DropDown';

// Declare CKEDITOR global if not already
declare global {
    interface Window {
        CKEDITOR?: any;
    }
}

export interface Props { }

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');
    };

    const checkSlugUniqueness = async (slug: string): Promise<boolean> => {
        // Ensure this API endpoint is correct and working
        const response = await fetch(`/api/v1${blogModuleConfig.apiEndpoints.checkSlug}?slug=${slug}`);
        const data = await response.json();
        return data.isUnique;
    };

    const handleSubmit = async (formData: FormData) => {
        const title = formData.get('title') as string;
        if (title) {
            let slug = generateSlug(title);
            const isUnique = await checkSlugUniqueness(slug);
            if (!isUnique) {
                slug = `${slug}-${Date.now()}`;
            }
            formData.set('slug', slug);
        }

        // Append selected categories and tags
        // Assuming the DropDown components provide IDs in a string format like "1,2,3"
        // Or, if they provide an array of objects, adjust accordingly.
        // For now, let's assume they are managed and directly appended if needed or handled by FormRenderer state.
        // formData.append('blog_categories', JSON.stringify(selectedCategories));
        // formData.append('blog_tags', JSON.stringify(selectedTags));


        // Full description is handled by FormRenderer's CKEditor integration
        const response = await dispatch(store(formData) as any);
        // Resetting form is handled by FormRenderer's resetFormOnSubmit prop
    };


    // Custom fields that are not directly part of FormRenderer's simple config
    // (e.g. complex dropdowns for relations)
    const customFormFields = (
        <>
            <div className="form-group form-vertical">
                <label>Blog Categories</label>
                <BlogCategoryDropDown
                    name="blog_categories" // This name should match a field SmartInput might ignore or be special-cased
                    multiple={true}
                    get_selected_data={(data) => {
                        // data.ids will be a comma separated string if that's what your component provides
                        // Or data.selectedList could be an array of objects
                        // Adapt based on actual output of your DropDown
                        console.log("Selected Categories:", data);
                        // setSelectedCategories(data.ids ? data.ids.split(',') : []);
                        // Or if it's an array of objects with id:
                        // setSelectedCategories(data.selectedList.map(item => item.id));
                    }}
                />
            </div>
            <div className="form-group form-vertical">
                <label>Blog Tags</label>
                <BlogTagDropDown
                    name="blog_tags"
                    multiple={true}
                    get_selected_data={(data) => {
                        console.log("Selected Tags:", data);
                        // setSelectedTags(data.ids ? data.ids.split(',') : []);
                    }}
                />
            </div>
        </>
    );


    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <FormRenderer
                            formConfig={blogFormFields}
                            onSubmit={handleSubmit}
                            resetFormOnSubmit={true}
                        />
                        {/* Render custom fields like category/tag dropdowns here if they are not part of the main formConfig flow */}
                         <div className="mx-auto pt-3">
                            <div className="row">
                                <div className="col-md-4"> {/* Adjust column size as needed */}
                                     {customFormFields}
                                </div>
                            </div>
                         </div>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;