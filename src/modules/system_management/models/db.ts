import {
    Sequelize,
} from 'sequelize';
import DB from '../../../bootstrap/db.sql';
import * as module_model from './error_trace.model';
// import * as user_model from '../../user_module/models/user_model';

interface models {
    [module_model.modelName]: typeof module_model.DataModel;
    // [module_model.modelName]: typeof user_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const sequelize: Sequelize = await DB.connect();

    let models: models = {
        [module_model.modelName]: module_model.init(sequelize),
        // Project: project_model.init(sequelize),
        sequelize,
    };

    await sequelize.sync({});

    /*__ define relation start __*/

    // models[module_model.modelName].hasMany(User, {
    //     sourceKey: 'id',
    //     foreignKey: 'user_id',
    //     as: 'users',
    // });

    /*__ define relation end __*/

    return models;
};
export default db;

/**
    models.User.hasMany(Project, {
        sourceKey: 'id',
        foreignKey: 'user_id',
        as: 'projects',
    });

    models.User.hasOne(Project, {
        sourceKey: 'id',
        foreignKey: 'user_id',
        as: 'project',
    });

    models.Project.belongsToMany(User, {
        through: 'project_user',
    });
    
    models.User.belongsToMany(Project, {
        through: 'project_user',
    });
 */