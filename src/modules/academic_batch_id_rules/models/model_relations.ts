import Models from "../../../database/models";

export function init() {
    const models = Models.get();

    models.AcademicBatchIdRuleModel.hasMany(models.UserModel, {
        foreignKey: "id",
        sourceKey: "branch_user_id",
        as: "users",
    });

    models.AcademicBatchIdRuleModel.hasMany(models.BranchInfosModel, {
        foreignKey: "id",
        sourceKey: "branch_id",
        as: "branches",
    });

    models.AcademicBatchIdRuleModel.hasMany(models.AcademicYearModel, {
        foreignKey: "id",
        sourceKey: "academic_year_id",
        as: "academic_years",
    });
}
