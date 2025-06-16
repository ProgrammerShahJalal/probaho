import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventPaymentRefundsModel, {
        foreignKey: "event_id",
        as: "event_payment_refunds",
    })

    models.EventPaymentRefundsModel.belongsTo(models.UserModel, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    models.EventPaymentRefundsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
