import Models from "../../../database/models";

export async function init() {
    const models = Models.get();

    models.EventAttendanceModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.EventAttendanceModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
    models.EventAttendanceModel.belongsTo(models.EventSessionsModel, {
        foreignKey: "event_session_id",
        targetKey: "id",
        as: "session",
    });

    console.log('Event Attendance relation models initialized successfully');
}
