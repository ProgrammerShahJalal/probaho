import { Sequelize } from "sequelize";
import FastifyApp from "../bootstrap/app";
import get_recursive_model_files_by_directory from "../helpers/get_recursive_model_files_by_directory";
import path from "path";
import { app_config } from "../configs/app.config";
import { anyObject } from "../common_types/object";
import { model_types } from "./models.type";

class Models {
    public static model_items: anyObject[] = [];

    public async register_models(sequelize_instance: Sequelize, server: FastifyApp) {
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

    public static get() : model_types {
        const items: Partial<model_types> = {};

        for (const key in Models.model_items) {
            if (Object.prototype.hasOwnProperty.call(Models.model_items, key)) {
                const element = Models.model_items[key];
                (items as any)[key] = element.instance;
            }
        }
    
        return items as model_types;
    }

}

export default Models;