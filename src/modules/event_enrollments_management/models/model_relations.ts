import Models from '../../../database/models';

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventEnrollmentsModel, {
        foreignKey: 'event_id',
        as: 'event_enrollments',
    });

    models.EventEnrollmentsModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.EventEnrollmentsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
