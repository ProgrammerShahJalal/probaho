import DB from './bootstrap/db.sql';
import { app_config } from './configs/app.config';
import FastifyApp from './bootstrap/app';
import path from 'path';
import Models from './database/models';

DB.connect()
    .then(async (sequelize_instance: any = {}) => {
        app_config.project_path = path.resolve(__dirname);

        const server = new FastifyApp();
        await server.register(sequelize_instance);

        const models = new Models();
        await models.register_models(sequelize_instance, server);
        await models.register_model_relations();

        server.start(app_config.port);
    });
