import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventResourcesModel, {
        foreignKey: "event_id",
        as: "event_resources",
    })

    models.EventResourcesModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
