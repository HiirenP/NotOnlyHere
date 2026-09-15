"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
const common_1 = require("@nestjs/common");
let StructuredLogger = class StructuredLogger {
    write(level, message, context) {
        const payload = {
            level,
            message: typeof message === 'string' ? message : JSON.stringify(message),
            context,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(payload));
    }
    log(message, context) {
        this.write('info', message, context);
    }
    error(message, trace, context) {
        this.write('error', { message, trace }, context);
    }
    warn(message, context) {
        this.write('warn', message, context);
    }
    debug(message, context) {
        if (process.env.LOG_LEVEL === 'debug') {
            this.write('debug', message, context);
        }
    }
    verbose(message, context) {
        this.write('verbose', message, context);
    }
};
exports.StructuredLogger = StructuredLogger;
exports.StructuredLogger = StructuredLogger = __decorate([
    (0, common_1.Injectable)()
], StructuredLogger);
//# sourceMappingURL=structured-logger.js.map