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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnonymousController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const audit_service_1 = require("../audit/audit.service");
const admin_guard_1 = require("./admin.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminAnonymousController = class AdminAnonymousController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async reveal(req, type, id, body) {
        const reason = body.reason?.trim();
        if (!reason || reason.length < 8) {
            throw new common_1.BadRequestException({
                code: 'REASON_REQUIRED',
                message: 'A reason of at least 8 characters is required.',
            });
        }
        if (type === 'post') {
            const mapping = await this.prisma.postAnonymousAuthor.findUnique({
                where: { postId: id },
                include: { user: { include: { profile: true } } },
            });
            if (!mapping?.userId || !mapping.user) {
                throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Anonymous post mapping not found.' });
            }
            await this.audit.record({
                actorUserId: req.user.id,
                action: 'anonymous_identity.reveal',
                targetType: 'post',
                targetId: id,
                result: 'SUCCESS',
                requestId: req.requestId,
                metadata: { reason },
            });
            return {
                type: 'post',
                targetId: id,
                userId: mapping.userId,
                email: mapping.user.email,
                username: mapping.user.profile?.username ?? null,
                displayName: mapping.user.profile?.displayName ?? null,
            };
        }
        if (type === 'comment') {
            const mapping = await this.prisma.commentAnonymousAuthor.findUnique({
                where: { commentId: id },
                include: { user: { include: { profile: true } } },
            });
            if (!mapping?.userId || !mapping.user) {
                throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Anonymous comment mapping not found.' });
            }
            await this.audit.record({
                actorUserId: req.user.id,
                action: 'anonymous_identity.reveal',
                targetType: 'comment',
                targetId: id,
                result: 'SUCCESS',
                requestId: req.requestId,
                metadata: { reason },
            });
            return {
                type: 'comment',
                targetId: id,
                userId: mapping.userId,
                email: mapping.user.email,
                username: mapping.user.profile?.username ?? null,
                displayName: mapping.user.profile?.displayName ?? null,
            };
        }
        throw new common_1.BadRequestException({ code: 'INVALID_TYPE', message: 'Type must be post or comment.' });
    }
};
exports.AdminAnonymousController = AdminAnonymousController;
__decorate([
    (0, common_1.Post)(':type/:id/reveal'),
    (0, admin_guard_1.AdminPermission)('anonymous_identity.reveal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminAnonymousController.prototype, "reveal", null);
exports.AdminAnonymousController = AdminAnonymousController = __decorate([
    (0, common_1.Controller)('admin/anonymous-authors'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AdminAnonymousController);
//# sourceMappingURL=admin-anonymous.controller.js.map