'use strict';
import { InferCreationAttributes } from 'sequelize';
import db from '../db';
import { modelName, tableName } from '../model';

/**
DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=123456 DB_DATABASE=iread npx ts-node src/modules/app_setting_management/models/seeders/data_seeder.ts
*/

(async () => {
    let model = await db();

    console.log(`\nreseting ${tableName} table`);
    await model[modelName].destroy({ truncate: true });

    let model_data = new model[modelName]();
    let inputs: InferCreationAttributes<typeof model_data>[] = [
       
        {
            id: 1,
            title: "Site Name",
            type: "text",
        },
        {
            id: 2,
            title: "Logo",
            type: "file",
        },
        {
            id: 3,
            title: "Invoice",
            type: "text" 
        },
        {
            id: 4,
            title: "SEO",
            type: "text", 
        },
        {
            id: 5,
            title: "Header CSS",
            type: "text",
        },
        {
            id: 6,
            title: "Header JS",
            type: "text",
        },
        {
            id: 7,
            title: "Footer CSS",
            type: "text",
        },
        {
            id: 8,
            title: "Footer JS",
            type: "text",
        },
        {
            id: 9,
            title: "Social Links",
            type: "text", 
        },
        {
            id: 10,
            title: "Contact Info",
            type: "text", 
        },
        {
            id: 11,
            title: "Email (smtp)",
            type: "text", 
        },
        {
            id: 12,
            title: "SMS (twilo)",
            type: "text", 
        },
        {
            id: 13,
            title: "Stripe",
            type: "text", 
        },
    ];

    console.log('\nmigrating data');
    await model[modelName].bulkCreate(inputs);

    console.log('\nmigration complete');
    await model.sequelize.close();

})();

