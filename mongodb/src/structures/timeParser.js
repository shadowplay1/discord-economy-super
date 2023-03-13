/**
 * Parses the millisecond number and returns the time object with days, hours, minutes, seconds and milliseconds.
 * @param {number} ms The milliseconds number.
 * @returns {TimeData} Time object.
 */
const parse = ms => ({
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000 % 24),
    minutes: Math.floor(ms / 60000 % 60),
    seconds: Math.floor(ms / 1000 % 60),
    milliseconds: Math.floor(ms % 1000)
})

module.exports = parse


/**
 * @typedef {object} TimeData
 * @property {number} days Amount of days until the cooldown ends.
 * @property {number} hours Amount of hours until the cooldown ends.
 * @property {number} minutes Amount of minutes until the cooldown ends.
 * @property {number} seconds Amount of seconds until the cooldown ends.
 * @property {number} milliseconds Amount of milliseconds until the cooldown ends.
 */
