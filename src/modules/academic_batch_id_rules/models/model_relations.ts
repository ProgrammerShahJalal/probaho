// model_relations.ts
import Models from "../../../database/models";

export function init() {
    const models = Models.get();

        // Direct relationships with foreign keys

    // AcademicBatchIdRule -> User relationship (using JSON array field)
    models.AcademicBatchIdRuleModel.belongsTo(models.UserModel, {
        foreignKey: 'branch_user_id',
        as: 'user',
        constraints: false // Since it's a JSON field, not a regular foreign key
    });
    
    models.UserModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'branch_user_id',
        as: 'batch_rules',
        constraints: false
    });

    // AcademicBatchIdRule -> BranchInfos relationship (using JSON array field)
    models.AcademicBatchIdRuleModel.belongsTo(models.BranchInfosModel, {
        foreignKey: 'branch_id',
        as: 'branch',
        constraints: false
    });
    
    models.BranchInfosModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'branch_id',
        as: 'batch_rules',
        constraints: false
    });

    // AcademicBatchIdRule -> AcademicYear relationship (using JSON array field)
    models.AcademicBatchIdRuleModel.belongsTo(models.AcademicYearModel, {
        foreignKey: 'academic_year_id',
        as: 'academic_year',
        constraints: false
    });
    
    models.AcademicYearModel.hasMany(models.AcademicBatchIdRuleModel, {
        foreignKey: 'academic_year_id',
        as: 'batch_rules',
        constraints: false
    });
}