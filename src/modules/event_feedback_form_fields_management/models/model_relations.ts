import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventFeedbackFormFieldsModel, {
        foreignKey: "event_id",
        as: "event_feedback_form_fields",
    })

     // Feedback Form Fields to Field Values relationship

    models.EventFeedbackFormFieldValuesModel.belongsTo(models.EventFeedbackFormFieldsModel, {
        foreignKey: "event_form_field_id",
        as: "feedback_form_field",
    });

    models.EventFeedbackFormFieldsModel.belongsTo(models.EventModel, {
        foreignKey: "event_id",
        targetKey: "id",
        as: "event",
    });
}
