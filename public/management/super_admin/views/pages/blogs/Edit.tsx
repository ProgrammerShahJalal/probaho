import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { update } from './config/store/async_actions/update';
import storeSlice from './config/store';
import BlogCategoryDropDown from '../blog_category/components/dropdown/DropDown';
import BlogTagDropDown from '../blog_tags/components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import setup from './config/setup';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import FormRenderer from '../../../components/form_elements/FormRenderer';
import { blogFormFields, blogModuleConfig } from './config/form.config';

// Declare CKEDITOR global if not already
declare global {
    interface Window {
        CKEDITOR?: any;
    }
}

const Edit: React.FC = () => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();
    const params = useParams();
    const [initialData, setInitialData] = useState<Record<string, any> | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);


    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        if (params.id) {
            dispatch(details({ id: params.id }) as any);
        }
    }, [dispatch, params.id]);

    useEffect(() => {
        if (state.item && Object.keys(state.item).length) {
            // Prepare initial data for FormRenderer, including flattening if necessary
            const flatInitialData = { ...state.item, ...state.item.info };
            // Handle array data for categories/tags if they are part of item
            // This depends on how your `details` action structures the item
            // For example, if state.item.blog_categories is an array of objects:
            // flatInitialData.blog_categories = state.item.blog_categories?.map(cat => cat.id);
            setInitialData(flatInitialData);

            // Set initial values for dropdowns if applicable
            // This part is tricky if the dropdowns are fully separate;
            // ideally, their default values would also be set via initialData passed to FormRenderer
            // or through their own props if they remain custom fields.
        }
    }, [state.item]);


    const generateSlug = (title: string): string =>
        title
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');

    const checkSlugUniqueness = async (slug: string, currentId?: string): Promise<boolean> => {
        let url = `/api/v1${blogModuleConfig.apiEndpoints.checkSlug}?slug=${slug}`;
        if (currentId) {
            url += `&id=${currentId}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data.isUnique;
    };

    const handleSubmit = async (formData: FormData) => {
        const title = formData.get('title') as string;
        const currentId = formData.get('id') as string;

        if (title) {
            let slug = generateSlug(title);
            const isUnique = await checkSlugUniqueness(slug, currentId);
            if (!isUnique) {
                slug = `${slug}-${Date.now()}`;
            }
            formData.set('slug', slug);
        }

        // Append selected categories and tags (if managed outside FormRenderer)
        // formData.append('blog_categories', JSON.stringify(selectedCategories));
        // formData.append('blog_tags', JSON.stringify(selectedTags));

        // ID is already part of formData if included in formConfig or as hidden input
        await dispatch(update(formData) as any);
    };

    // Custom fields (dropdowns) - similar to Create.tsx
    // Their default values would ideally be set based on `initialData`
     const customFormFields = initialData ? (
        <>
            <div className="form-group form-vertical">
                <label>Blog Categories</label>
                <BlogCategoryDropDown
                    name="blog_categories"
                    multiple={true}
                    // default_value={initialData.blog_categories || []} // Adjust based on data structure
                    get_selected_data={(data) => { /* console.log(data) */ }}
                />
            </div>
            <div className="form-group form-vertical">
                <label>Blog Tags</label>
                <BlogTagDropDown
                    name="blog_tags"
                    multiple={true}
                    // default_value={initialData.blog_tags || []} // Adjust based on data structure
                    get_selected_data={(data) => { /* console.log(data) */ }}
                />
            </div>
        </>
    ) : null;


    if (!initialData) {
        return <div>Loading...</div>; // Or some other loading indicator
    }

    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header page_title={setup.edit_page_title} />
                <div className="content_body custom_scroll">
                    <FormRenderer
                        formConfig={blogFormFields.map(field => ({
                            ...field,
                            // Ensure 'id' is present for submission, could be hidden
                            ...(field.name === 'id' && { type: 'hidden' as any, defaultValue: initialData.id })
                        }))}
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        submitButtonText="Update"
                    />
                     <div className="mx-auto pt-3">
                        <div className="row">
                             <div className="col-md-4"> {/* Adjust column size as needed */}
                                {customFormFields}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer>
                    {initialData.id && (
                        <li>
                            <Link
                                to={`/${setup.route_prefix}/details/${initialData.id}`}
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
    );
};

export default Edit;
