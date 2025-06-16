import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.BlogCommentModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.UserModel.hasMany(models.BlogCommentModel, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "comments",
    });


    models.BlogCommentModel.hasMany(models.BlogCommentRepliesModel, {
        foreignKey: "parent_comment_id",
        as: "replies",
    });
    

}
