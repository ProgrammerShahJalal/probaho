'use strict';
import { InferCreationAttributes } from 'sequelize';
import db from '../db';
import { modelName, tableName } from '../error_trace.model';

/**
DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=1234 DB_DATABASE=iread npx ts-node server/src/modules/contact_management/models/seeders/data_seeder.ts
*/

(async () => {
    let model = await db();

    console.log(`\nreseting ${tableName} table`);
    await model[modelName].destroy({ truncate: true });

    let model_data = new model[modelName]();
    let inputs: InferCreationAttributes<typeof model_data>[] = [
        {
            full_name: 'data 1',
            email: 'data 1',
        },
        {
            full_name: 'data 2',
            email: 'data 2',
        }
    ];

    console.log('\nmigrating data');
    await model[modelName].bulkCreate(inputs);

    console.log('\nmigration complete');
    await model.sequelize.close();

})();

