"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDeletionService = exports.AccountExportService = exports.DELETION_GRACE_DAYS = exports.EXPORT_TTL_DAYS = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const session_service_1 = require("../auth/session.service");
const outbox_service_1 = require("../outbox/outbox.service");
const prisma_service_1 = require("../prisma/prisma.service");
exports.EXPORT_TTL_DAYS = 7;
exports.DELETION_GRACE_DAYS = 7;
let AccountExportService = class AccountExportService {
    prisma;
    outbox;
    constructor(prisma, outbox) {
        this.prisma = prisma;
        this.outbox = outbox;
    }
    async requestExport(userId, password, idempotencyKey) {
        await this.verifyPassword(userId, password);
        const existing = idempotencyKey
            ? await this.prisma.accountExport.findFirst({
                where: { userId, idempotencyKey },
            })
            : null;
        if (existing) {
            return this.serialize(existing);
        }
        const active = await this.prisma.accountExport.findFirst({
            where: {
                userId,
                status: { in: ['QUEUED', 'PROCESSING', 'READY'] },
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            orderBy: { requestedAt: 'desc' },
        });
        if (active) {
            return this.serialize(active);
        }
        const created = await this.prisma.accountExport.create({
            data: {
                userId,
                status: 'QUEUED',
                idempotencyKey: idempotencyKey ?? null,
            },
        });
        await this.outbox.emitAccountExport(userId, created.id);
        return this.serialize(created);
    }
    async getLatestExport(userId) {
        const latest = await this.prisma.accountExport.findFirst({
            where: { userId },
            orderBy: { requestedAt: 'desc' },
        });
        if (!latest) {
            throw new common_1.NotFoundException({ code: 'EXPORT_NOT_FOUND', message: 'No export request found.' });
        }
        return this.serialize(latest);
    }
    async getExportForDownload(userId, exportId) {
        const exportRow = await this.prisma.accountExport.findFirst({
            where: { id: exportId, userId },
        });
        if (!exportRow || exportRow.status !== 'READY' || !exportRow.objectKey) {
            throw new common_1.NotFoundException({ code: 'EXPORT_NOT_READY', message: 'Export is not ready.' });
        }
        if (exportRow.expiresAt && exportRow.expiresAt < new Date()) {
            throw new common_1.NotFoundException({ code: 'EXPORT_EXPIRED', message: 'Export has expired.' });
        }
        return exportRow;
    }
    serialize(exportRow) {
        const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
        return {
            id: exportRow.id,
            status: exportRow.status,
            requestedAt: exportRow.requestedAt.toISOString(),
            completedAt: exportRow.completedAt?.toISOString() ?? null,
            expiresAt: exportRow.expiresAt?.toISOString() ?? null,
            downloadUrl: exportRow.status === 'READY' && exportRow.objectKey
                ? `${apiUrl}/api/v1/account/export/${exportRow.id}/download`
                : null,
        };
    }
    async verifyPassword(userId, password) {
        const credential = await this.prisma.credential.findUnique({ where: { userId } });
        if (!credential) {
            throw new common_1.UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
        }
        const valid = await argon2.verify(credential.passwordHash, password);
        if (!valid) {
            throw new common_1.UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
        }
    }
};
exports.AccountExportService = AccountExportService;
exports.AccountExportService = AccountExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_service_1.OutboxService])
], AccountExportService);
let AccountDeletionService = class AccountDeletionService {
    prisma;
    sessions;
    outbox;
    constructor(prisma, sessions, outbox) {
        this.prisma = prisma;
        this.sessions = sessions;
        this.outbox = outbox;
    }
    async requestDeletion(userId, password) {
        const credential = await this.prisma.credential.findUnique({ where: { userId } });
        if (!credential) {
            throw new common_1.UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
        }
        const valid = await argon2.verify(credential.passwordHash, password);
        if (!valid) {
            throw new common_1.UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Account not found.' });
        }
        if (user.status === 'DELETION_PENDING') {
            return {
                status: 'DELETION_PENDING',
                requestedAt: user.deletionRequestedAt.toISOString(),
                dueAt: user.deletionDueAt.toISOString(),
                message: 'Account deletion is already scheduled.',
            };
        }
        const now = new Date();
        const dueAt = new Date(now.getTime() + exports.DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: 'DELETION_PENDING',
                deletionRequestedAt: now,
                deletionDueAt: dueAt,
            },
        });
        await this.sessions.revokeAllSessions(userId, 'deletion_requested');
        await this.outbox.emitAccountDeletion(userId, dueAt.toISOString());
        return {
            status: 'DELETION_PENDING',
            requestedAt: now.toISOString(),
            dueAt: dueAt.toISOString(),
            message: 'Your account is scheduled for deletion after the grace period.',
        };
    }
};
exports.AccountDeletionService = AccountDeletionService;
exports.AccountDeletionService = AccountDeletionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        session_service_1.SessionService,
        outbox_service_1.OutboxService])
], AccountDeletionService);
//# sourceMappingURL=account-lifecycle.service.js.map