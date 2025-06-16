import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.EventModel.hasMany(models.EventFeedbackFormFieldValuesModel, {
        foreignKey: "event_id",
        as: "event_feedback_form_field_values",
    })

     // Feedback Form Fields to Field Values relationship
     models.EventFeedbackFormFieldsModel.hasMany(models.EventFeedbackFormFieldValuesModel, {
        foreignKey: "event_form_field_id",
        as: "field_values",
    });

}
