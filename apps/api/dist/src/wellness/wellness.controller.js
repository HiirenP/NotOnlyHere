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
exports.WellnessController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const wellness_service_1 = require("./wellness.service");
let WellnessController = class WellnessController {
    wellness;
    constructor(wellness) {
        this.wellness = wellness;
    }
    list(req, cursor, limit) {
        return this.wellness.listCheckins(req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
    }
    upsert(req, body) {
        return this.wellness.upsertCheckin(req.user.id, body);
    }
    get(req, id) {
        return this.wellness.getCheckin(id, req.user.id);
    }
    update(req, id, body) {
        return this.wellness.updateCheckinById(id, req.user.id, body);
    }
    remove(req, id) {
        return this.wellness.deleteCheckin(id, req.user.id);
    }
    trends(req, window = '7d', timeZone = 'UTC') {
        return this.wellness.trends(req.user.id, window === '30d' ? '30d' : '7d', timeZone);
    }
};
exports.WellnessController = WellnessController;
__decorate([
    (0, common_1.Get)('checkins'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('cursor')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('checkins'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "upsert", null);
__decorate([
    (0, common_1.Get)('checkins/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)('checkins/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('checkins/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('trends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('window')),
    __param(2, (0, common_1.Query)('timeZone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], WellnessController.prototype, "trends", null);
exports.WellnessController = WellnessController = __decorate([
    (0, common_1.Controller)('wellness'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [wellness_service_1.WellnessService])
], WellnessController);
//# sourceMappingURL=wellness.controller.js.map