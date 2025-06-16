import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.AppSettingValuesModel.belongsTo(models.AppSettinsgModel, {
        foreignKey: "app_setting_key_id",
        as: "app_settings",
    });
}
