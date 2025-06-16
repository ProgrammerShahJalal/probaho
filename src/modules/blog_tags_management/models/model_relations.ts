import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    // Define the association with BlogModel
    models.BlogTagsModel.belongsToMany(models.BlogModel, {
        as: "tag_blogs",
        through: "blog_tag_blog",
        otherKey: "blog_tag_id",
        foreignKey: "blog_id",
    });
}
