import { FormFieldConfig } from "../../../components/form_elements/SmartInput";

export const blogFormFields: FormFieldConfig[] = [
    {
        name: "title",
        label: "Blog Title",
        type: "text",
        required: true,
        placeholder: "Enter blog title",
    },
    {
        name: "short_description",
        label: "Short Description",
        type: "textarea",
        required: true,
        rows: 3,
    },
    // CKEditor for full_description will still need special handling,
    // but we can mark its place or provide basic textarea as fallback.
    {
        name: "full_description",
        label: "Full Description",
        type: "textarea", // Or a custom "richtext" type if SmartInput is extended
        required: true,
        rows: 10,
    },
    {
        name: "cover_image",
        label: "Cover Image",
        type: "image", // SmartInput will need a case for this, using a generic InputImage
        required: true,
    },
    {
        name: "is_published",
        label: "Status",
        type: "select",
        required: true,
        options: [
            { value: "publish", label: "Publish" },
            { value: "draft", label: "Draft" },
        ],
        defaultValue: "draft",
    },
    {
        name: "publish_date",
        label: "Publish Date",
        type: "date",
        required: true,
    },
    {
        name: "seo_title",
        label: "SEO Title",
        type: "text",
    },
    {
        name: "seo_keyword",
        label: "SEO Keywords",
        type: "textarea",
        rows: 2,
        placeholder: "Comma-separated keywords",
    },
    {
        name: "seo_description",
        label: "SEO Description",
        type: "textarea",
        rows: 3,
    },
    // For relationships like categories and tags, we'd eventually
    // want a 'relation_select' or similar type that could use the
    // GenericRelationDropDown I plan to build.
    // For now, these would be handled separately or with a simpler select.
];

export const blogModuleConfig = {
    moduleName: "blogs",
    formFields: blogFormFields,
    // other module specific configs like API endpoints can go here
    apiEndpoints: {
        create: "/blogs/store",
        update: "/blogs/update", //  will need /:id
        details: "/blogs/details", //  will need /:id
        list: "/blogs/all",
        delete: "/blogs/delete",
        checkSlug: "/blogs/slug", // for slug uniqueness
    }
};

export default blogModuleConfig;
