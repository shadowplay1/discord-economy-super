/* eslint-disable use-isnan */

/**
 * Returns the exact type of the specified input. Utilility function.
 * @param {any} input The input to check.
 * @returns {string} Input exact type.
 */
const typeOf = input => {
    if ((typeof input == 'object' || typeof input == 'function') && input?.prototype) {
        return input.name
    }

    if (input == null || input == undefined || (typeof input == 'number' && isNaN(input))) {
        return `${input}`
    }

    return input.constructor.name
}

module.exports = typeOf
