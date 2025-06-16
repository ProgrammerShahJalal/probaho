import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.AppSettinsgModel.hasMany(models.AppSettingValuesModel, {
        foreignKey: "app_setting_key_id",
        as: "app_settings",
    });

}
