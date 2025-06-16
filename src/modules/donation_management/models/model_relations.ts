import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    // models.BlogModel.hasMany(models.BlogCommentModel, {
    //     foreignKey: "blog_id",
    //     as: "blog_comments",
    // });

    // models.BlogCommentModel.belongsTo(models.BlogModel, {
    //     foreignKey: "blog_id",
    //     as: "blogs",
    // });
}
