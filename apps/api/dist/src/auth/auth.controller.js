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
exports.AccountSessionsController = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
const session_service_1 = require("./session.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthController = class AuthController {
    auth;
    sessions;
    prisma;
    constructor(auth, sessions, prisma) {
        this.auth = auth;
        this.sessions = sessions;
        this.prisma = prisma;
    }
    register(body) {
        return this.auth.register(body);
    }
    login(body, req, res) {
        return this.auth.login(body.email, body.password, res, req, body.returnTo);
    }
    logout(req, res) {
        return this.auth.logout(req, res);
    }
    logoutAll(req, res) {
        return this.auth.logoutAll(req, res);
    }
    verifyEmail(body) {
        return this.auth.verifyEmail(body.token);
    }
    resendVerification(body) {
        return this.auth.resendVerification(body.email);
    }
    forgotPassword(body) {
        return this.auth.forgotPassword(body.email);
    }
    resetPassword(body) {
        return this.auth.resetPassword(body.token, body.password);
    }
    async devSession(body, res) {
        const email = body.email ?? 'demo@notonlyhere.local';
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { ok: false, message: 'Seed user not found. Run npm run db:seed.' };
        }
        const sessionId = await this.sessions.createDevSession(user.id, res);
        return { ok: true, sessionId };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Post)('email/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('email/resend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('password/forgot'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('password/reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('dev-session'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "devSession", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        session_service_1.SessionService,
        prisma_service_1.PrismaService])
], AuthController);
let AccountSessionsController = class AccountSessionsController {
    sessions;
    constructor(sessions) {
        this.sessions = sessions;
    }
    list(req) {
        const currentId = this.sessions.getCurrentSessionId(req);
        return this.sessions.listSessions(req.user.id, currentId);
    }
    async revoke(req, id) {
        const owned = await this.sessions.listSessions(req.user.id);
        if (!owned.some((session) => session.id === id)) {
            return { ok: false };
        }
        await this.sessions.revokeSession(id, 'revoked_by_user');
        return { ok: true };
    }
};
exports.AccountSessionsController = AccountSessionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountSessionsController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountSessionsController.prototype, "revoke", null);
exports.AccountSessionsController = AccountSessionsController = __decorate([
    (0, common_1.Controller)('account/sessions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], AccountSessionsController);
//# sourceMappingURL=auth.controller.js.map