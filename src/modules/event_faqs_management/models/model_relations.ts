import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventFaqsModel, {
        foreignKey: "event_id",
        as: "event_faqs",
    })

    models.EventFaqsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
