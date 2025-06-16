import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.BlogCommentRepliesModel.belongsTo(models.BlogCommentModel, {
        foreignKey: "parent_comment_id",
        targetKey: "id",
        as: "parent_comment",
    });

    models.BlogCommentRepliesModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.BlogCommentRepliesModel.belongsTo(models.BlogModel, {
        foreignKey: "blog_id",
        targetKey: "id",
        as: "blog",
    });
}