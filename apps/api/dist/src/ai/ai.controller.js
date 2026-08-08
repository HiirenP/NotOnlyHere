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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const ai_service_1 = require("./ai.service");
let AiController = class AiController {
    ai;
    constructor(ai) {
        this.ai = ai;
    }
    getConsent(req) {
        return this.ai.getConsentStatus(req.user.id);
    }
    updateConsent(req, body) {
        return this.ai.updateConsent(req.user.id, body);
    }
    getPreferences(req) {
        return this.ai.getPreferences(req.user.id);
    }
    updatePreferences(req, body) {
        return this.ai.updatePreferences(req.user.id, body.preferences ?? {});
    }
    listConversations(req) {
        return this.ai.listConversations(req.user.id);
    }
    createConversation(req) {
        return this.ai.createConversation(req.user.id);
    }
    getConversation(req, id) {
        return this.ai.getConversation(id, req.user.id);
    }
    deleteConversation(req, id) {
        return this.ai.deleteConversation(id, req.user.id);
    }
    listMessages(req, id, cursor, limit) {
        return this.ai.listMessages(id, req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
    }
    sendMessage(req, id, body) {
        return this.ai.sendMessage(id, req.user.id, body.content);
    }
    quota(req) {
        return this.ai.getQuota(req.user.id);
    }
    starters() {
        return this.ai.getStarters();
    }
    recommendations(req) {
        return this.ai.getCircleRecommendations(req.user.id);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('consent'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getConsent", null);
__decorate([
    (0, common_1.Put)('consent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "updateConsent", null);
__decorate([
    (0, common_1.Get)('preferences'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Put)('preferences'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "listConversations", null);
__decorate([
    (0, common_1.Post)('conversations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('quota'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "quota", null);
__decorate([
    (0, common_1.Get)('conversation-starters'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "starters", null);
__decorate([
    (0, common_1.Get)('circle-recommendations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "recommendations", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map