import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventSessionsModel.hasMany(models.EventSessionAssesmentSubmissionsModel, {
        foreignKey: "event_session_id",
        as: "event_session_assesment_submissions",
    })

    models.EventSessionAssesmentSubmissionsModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });
    models.EventSessionAssesmentSubmissionsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
    models.EventSessionAssesmentSubmissionsModel.belongsTo(models.EventSessionsModel, {
        foreignKey: "event_session_id",
        targetKey: "id",
        as: "session",
    });
    models.EventSessionAssesmentSubmissionsModel.belongsTo(models.EventSessionsAssesmentsModel, {
        foreignKey: "event_session_id",
        targetKey: "id",
        as: "assesment",
    });
}
