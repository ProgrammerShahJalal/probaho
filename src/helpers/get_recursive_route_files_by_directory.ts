import path from "path";
import fsp from 'fs/promises';
import { app_config } from "../configs/app.config";

async function get_recursive_route_files_by_directory(currentPath: string, target_file: string, results: string[] = []): Promise<string[]> {
    // let results: string[] = [];
    let module_path = path.join(app_config.project_path, currentPath);

    const entries = await fsp.readdir(module_path, {
        withFileTypes: true,
    });

    for (let entry of entries) {

        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
            let check_is_not_inner_directory = !['api_test', 'models', 'services', 'test'].includes(entry.name);
            if (check_is_not_inner_directory) {
                await get_recursive_route_files_by_directory(fullPath, target_file, results);
            }
        } else if (entry.name == target_file) {
            results.push(fullPath);
        }
    }

    return results;
}

export default get_recursive_route_files_by_directory;
