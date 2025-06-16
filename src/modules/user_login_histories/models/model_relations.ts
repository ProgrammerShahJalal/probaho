import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.UserLoginHistoriesModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });
    
}
