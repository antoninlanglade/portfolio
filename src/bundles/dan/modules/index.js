// Modules
import modules from './modules';

/**
 * Get a module by name
 * @param {string} name
 * @return {Promise}
 */
export var ensure = function(name) {
    if(modules[name] === void(0)) {
        throw new Error(`Module "${name}" not found in ./src/modules.json`);
    }
    return modules[name]();
};