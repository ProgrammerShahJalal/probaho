import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventSessionsModel, {
        foreignKey: "event_id",
        as: "event_sessions",
    })
    models.EventSessionsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        as: "events_details",
    })

    models.EventSessionsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
