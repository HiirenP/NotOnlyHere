"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/global-exception.filter");
const structured_logger_1 = require("./common/structured-logger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new structured_logger_1.StructuredLogger(),
    });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    app.enableCors({
        origin: [webUrl],
        credentials: true,
    });
    const port = Number(process.env.API_PORT ?? 3001);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map