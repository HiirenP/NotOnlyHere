"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANONYMOUS_DAILY_LIMIT = void 0;
exports.generateAnonymousDisplayLabel = generateAnonymousDisplayLabel;
exports.utcUsageDate = utcUsageDate;
exports.nextUtcMidnight = nextUtcMidnight;
const crypto_1 = require("crypto");
exports.ANONYMOUS_DAILY_LIMIT = 10;
const ADJECTIVES = [
    'Quiet',
    'Gentle',
    'Brave',
    'Calm',
    'Kind',
    'Warm',
    'Soft',
    'Bright',
    'Steady',
    'Hopeful',
];
const NOUNS = [
    'Fox',
    'Wave',
    'Leaf',
    'Star',
    'River',
    'Cloud',
    'Pine',
    'Dawn',
    'Meadow',
    'Harbor',
];
function generateAnonymousDisplayLabel() {
    const adjective = ADJECTIVES[(0, crypto_1.randomInt)(ADJECTIVES.length)];
    const noun = NOUNS[(0, crypto_1.randomInt)(NOUNS.length)];
    const suffix = (0, crypto_1.randomInt)(900) + 100;
    return `${adjective}${noun}${suffix}`;
}
function utcUsageDate(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function nextUtcMidnight(from = new Date()) {
    return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 1));
}
//# sourceMappingURL=anonymous.constants.js.map