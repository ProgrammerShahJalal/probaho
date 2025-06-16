import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    // models.ContactModel.hasOne(models.ContactModel2, {
    //     as: "contacts2",
    //     foreignKey: "contact_id",
    //     sourceKey: "id",
    // })
}
