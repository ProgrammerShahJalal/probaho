import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventCertifiedUsersModel, {
        foreignKey: "event_id",
        as: "event_certified_users",
    })

    models.EventCertifiedUsersModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.EventCertifiedUsersModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
