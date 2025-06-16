'use strict';
import { InferCreationAttributes, Sequelize } from 'sequelize';
import DB from '../../../../bootstrap/db.sql';
import * as dataModel from '../model';

/**
DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=123456 DB_DATABASE=iread npx ts-node ./src/modules/blog_categories_management/models/seeders/data_seeder.ts
*/

(async () => {
    await DB.connect().then(async(sequlize_instance: Sequelize)=> {
        let model = dataModel.init(sequlize_instance);
        console.log(`\nreseting ${dataModel.tableName} table`);

        await model.destroy({ truncate: true });
    
        let model_data = new model();
        let inputs: InferCreationAttributes<typeof model_data>[] = [
            {
                title: 'data 1',
                image: "test.png",
            },
            {
                title: 'data 2',
                image: "test.png",
            }
        ];
    
        console.log('\nmigrating data');
        await model.bulkCreate(inputs);
    
        console.log('\nmigration complete');
        await sequlize_instance.close();
    });

})();

