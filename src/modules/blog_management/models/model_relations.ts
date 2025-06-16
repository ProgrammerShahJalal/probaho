import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.BlogModel.hasMany(models.BlogCategoryBlogModel, {
        foreignKey: "blog_id",
        sourceKey: "id",
        as: "blog_categories",
    });
    models.BlogModel.hasMany(models.BlogTagBlogModel, {
        foreignKey: "blog_id",
        sourceKey: "id",
        as: "blog_tags",
    });
    models.BlogModel.hasMany(models.BlogCommentModel, {
        foreignKey: "blog_id",
        sourceKey: "id",
        as: "blog_comments",
    });
    models.BlogCommentModel.belongsTo(models.BlogModel, {
        foreignKey: "blog_id",
        targetKey: "id",
        as: "blog",
    });
    
}
