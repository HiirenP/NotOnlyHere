"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const request_id_middleware_1 = require("./request-id.middleware");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof common_1.HttpException ? exception.getResponse() : undefined;
        const body = {
            type: 'about:blank',
            title: common_1.HttpStatus[status] ?? 'Error',
            status,
            code: 'INTERNAL_ERROR',
            requestId: request.headers[request_id_middleware_1.REQUEST_ID_HEADER],
        };
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const payload = exceptionResponse;
            if (typeof payload.message === 'string')
                body.detail = payload.message;
            if (typeof payload.code === 'string')
                body.code = payload.code;
            if (payload.errors && typeof payload.errors === 'object') {
                body.errors = payload.errors;
            }
        }
        else if (exception instanceof Error && status === 500) {
            body.detail = 'An unexpected error occurred.';
        }
        response.status(status).json(body);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map