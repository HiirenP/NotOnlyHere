"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyRedirectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LegacyRedirectService = class LegacyRedirectService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizePath(path) {
        const trimmed = path.trim();
        if (!trimmed.startsWith('/'))
            return `/${trimmed}`;
        return trimmed.replace(/\/+$/, '') || '/';
    }
    async resolve(sourcePath) {
        const normalized = this.normalizePath(sourcePath);
        const redirect = await this.prisma.legacyRedirect.findFirst({
            where: { sourcePath: normalized, active: true },
        });
        if (!redirect) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'No redirect configured.' });
        }
        return {
            sourcePath: redirect.sourcePath,
            targetPath: redirect.targetPath,
            statusCode: redirect.statusCode,
        };
    }
    async list() {
        const rows = await this.prisma.legacyRedirect.findMany({
            where: { active: true },
            orderBy: { sourcePath: 'asc' },
        });
        return {
            items: rows.map((row) => ({
                id: row.id,
                sourcePath: row.sourcePath,
                targetPath: row.targetPath,
                statusCode: row.statusCode,
            })),
        };
    }
    async upsert(input) {
        const sourcePath = this.normalizePath(input.sourcePath);
        const targetPath = input.targetPath.trim();
        if (!targetPath.startsWith('/')) {
            throw new Error('INVALID_TARGET');
        }
        const row = await this.prisma.legacyRedirect.upsert({
            where: { sourcePath },
            update: {
                targetPath,
                statusCode: input.statusCode ?? 301,
                active: true,
            },
            create: {
                sourcePath,
                targetPath,
                statusCode: input.statusCode ?? 301,
            },
        });
        return {
            id: row.id,
            sourcePath: row.sourcePath,
            targetPath: row.targetPath,
            statusCode: row.statusCode,
        };
    }
};
exports.LegacyRedirectService = LegacyRedirectService;
exports.LegacyRedirectService = LegacyRedirectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LegacyRedirectService);
//# sourceMappingURL=legacy-redirect.service.js.map