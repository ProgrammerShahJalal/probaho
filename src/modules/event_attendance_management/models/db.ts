import { Sequelize } from 'sequelize';
import DB from '../../../bootstrap/db.sql';
import * as module_model from './model';

interface models {
    [module_model.modelName]: typeof module_model.DataModel;
    sequelize: Sequelize;
}

async function initializeDB(): Promise<models> {
    const sequelize: Sequelize = await DB.connect();

    const db: models = {
        [module_model.modelName]: module_model.init(sequelize),
        sequelize,
    };

    return db;
}

export default initializeDB;
