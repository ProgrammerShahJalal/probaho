'use strict';
import { Sequelize } from 'sequelize';
import { app_config } from '../configs/app.config';
require('dotenv').config();

class DB {
    private static instance: Sequelize | null = null;

    private constructor() {}

    public static async connect(): Promise<Sequelize> {
        if (!DB.instance) {
            console.log('Creating a new Sequelize instance...');

            DB.instance = new Sequelize(app_config.DB_string, {
                dialect: 'mysql',
                logging: false,
                dialectOptions: {
                    charset: 'utf8mb4',
                },
                define: {
                    charset: 'utf8mb4',
                    collate: 'utf8mb4_unicode_520_ci',
                },
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            });

            try {
                await DB.instance.authenticate();
                console.log(
                    'Database connection has been established successfully.',
                );
            } catch (error) {
                console.error('Unable to connect to the database:', error);
                DB.instance = null; // Reset instance on failure
                throw error;
            }
        } else {
            // console.log("Reusing the existing Sequelize instance.");
        }

        return DB.instance;
    }
}

export default DB;
