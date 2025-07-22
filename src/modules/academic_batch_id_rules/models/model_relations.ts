// model_relations.ts
import Models from "../../../database/models";

export function init() {
    const models = Models.get();

        // Direct relationships with foreign keys

    // AcademicBatchIdRule -> User relationship
    models.AcademicBatchIdRuleModel.belongsTo(models.UserModel, {
        foreignKey: 'branch_user_id',
        as: 'users'
    });
    
    models.UserModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'branch_user_id',
        as: 'batch_rules'
    });

    // AcademicBatchIdRule -> BranchInfos relationship
    models.AcademicBatchIdRuleModel.belongsTo(models.BranchInfosModel, {
        foreignKey: 'branch_id',
        as: 'branches'
    });
    
    models.BranchInfosModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'branch_id',
        as: 'batch_rules'
    });

    // AcademicBatchIdRule -> AcademicYear relationship
    models.AcademicBatchIdRuleModel.belongsTo(models.AcademicYearModel, {
        foreignKey: 'academic_year_id',
        as: 'academic_years'
    });
    
    models.AcademicYearModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'academic_year_id',
        as: 'batch_rules'
    });
}