import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventSessionsModel.hasMany(models.EventSessionsAssesmentsModel, {
        foreignKey: "event_session_id",
        as: "event_sessions_assesments",
    })

    models.EventSessionsAssesmentsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
    models.EventSessionsAssesmentsModel.belongsTo(models.EventSessionsModel, {
        foreignKey: "event_session_id",
        targetKey: "id",
        as: "session",
    });
}
