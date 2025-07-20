import * as ErrorTraceModel from "../modules/system_management/models/error_trace.model";
import * as ContactModel from "../modules/contact_management/models/model";
import * as BranchInfosModel from "../modules/branch_infos/models/model";
import * as UserModel from "../modules/users/models/user_model";
import * as UserRolesModel from "../modules/user_roles/models/model";
import * as UserLoginHistoriesModel from "../modules/user_login_histories/models/model";

import * as AcademicYearModel from "../modules/academic_year_management/models/model";
import { Sequelize } from "sequelize";


export type model_types = { 
    ErrorTraceModel: typeof ErrorTraceModel.DataModel;
    
    BranchInfosModel: typeof BranchInfosModel.DataModel;
    ContactModel: typeof ContactModel.DataModel;
    UserModel: typeof UserModel.DataModel;
    UserRolesModel: typeof UserRolesModel.DataModel;
    UserLoginHistoriesModel: typeof UserLoginHistoriesModel.DataModel;

    AcademicYearModel: typeof AcademicYearModel.DataModel;

}

// This type will be used by Models.get() and includes the Sequelize instance
export type ModelContainer = model_types & {
  sequelize: Sequelize | null;
};
