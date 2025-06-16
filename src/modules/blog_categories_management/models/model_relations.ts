import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    // Define the association with BlogModel
    models.BlogCategoriesModel.belongsToMany(models.BlogModel, {
        as: "category_blogs",
        through: "blog_category_blog",
        otherKey: "blog_category_id",
        foreignKey: "blog_id",
    });

    // // Define the association with BlogViewModel
    // models.BlogCategoriesModel.hasMany(models.BlogViewModel, {
    //     foreignKey: "blog_category_id",
    //     as: "views",
    // });
}
