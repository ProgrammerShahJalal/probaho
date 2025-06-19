import Models from "../../../database/models";
// import db from "./db";

export async function init() {
    let models = Models.get();
    // let models = await db();
    if (!models.UserModel ) {
        console.error("UserModel is undefined. Check model initialization.");
        return;
    }
    if (!models.UserRolesModel) {
        console.error("UserRolesModel is undefined. Check model initialization.");
        return;
    }

    models.UserModel.belongsTo(models.UserRolesModel, {  
        foreignKey: "role_serial",  // This column exists in UserModel
        targetKey: "serial",  // This is the column in UserRolesModel that it references
        as: "role",  
    });
    
    models.UserRolesModel.hasOne(models.UserModel, {
        foreignKey: "role_serial",  // Should match the belongsTo foreign key
        sourceKey: "serial",  // `serial` is the actual column being referenced
        as: "users",
    });
    console.log('authentication relation models');
}

