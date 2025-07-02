import { Sequelize } from "sequelize";
import FastifyApp from "../bootstrap/app";
import get_recursive_model_files_by_directory from "../helpers/get_recursive_model_files_by_directory";
import path from "path";
import { app_config } from "../configs/app.config";
import { anyObject } from "../common_types/object";
import { model_types, ModelContainer } from "./models.type"; // Import ModelContainer

class Models {
    public static model_items: anyObject[] = [];
    private static sequelizeInstance: Sequelize | null = null; // Add static property to store Sequelize instance

    public async register_models(sequelize_instance: Sequelize, server: FastifyApp) {
        Models.sequelizeInstance = sequelize_instance; // Store the instance
        let model_files = await get_recursive_model_files_by_directory('modules', 'model.ts');

        console.log('\nDB booting\n');
        for (const file of model_files) {
            const absolutePath = path.resolve(app_config.project_path, file);
            try {
                const module = await import(absolutePath);

                if (module.init && typeof module.init === 'function') {

                    let temp = {
                        model_name: module.modelName,
                        table_name: module.tableName,
                        instance: module.init(sequelize_instance),
                    }

                    Models.model_items[module.modelName] = temp;

                    console.log(`${file}`);
                    await sequelize_instance.sync({});

                } else {
                    console.warn(`No init function found in ${absolutePath}`);
                }

            } catch (error) {
                console.error(`Error importing ${absolutePath}:`, error);
            }
        }
    }
    
    public async register_model_relations() {
        let model_files = await get_recursive_model_files_by_directory('modules', 'relations.ts');

        console.log('\nDB relation booting\n');
        for (const file of model_files) {
            const absolutePath = path.resolve(app_config.project_path, file);
            try {
                const module = await import(absolutePath);

                if (module.init && typeof module.init === 'function') {
                    module.init();
                } else {
                    console.warn(`No init function found in ${absolutePath}`);
                }

            } catch (error) {
                console.error(`Error importing ${absolutePath}:`, error);
            }
        }
    }

    public static get() : ModelContainer { // Change return type to ModelContainer
        const modelInstances: Partial<model_types> = {};

        for (const key in Models.model_items) {
            if (Object.prototype.hasOwnProperty.call(Models.model_items, key)) {
                const element = Models.model_items[key];
                (modelInstances as any)[key] = element.instance;
            }
        }
    
        return {
            ...(modelInstances as model_types), // Spread the model instances
            sequelize: Models.sequelizeInstance, // Add the sequelize instance
        } as ModelContainer; // Cast to ModelContainer
    }

}

export default Models;
