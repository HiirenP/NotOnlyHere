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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("../auth/session.service");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    analytics;
    sessions;
    constructor(analytics, sessions) {
        this.analytics = analytics;
        this.sessions = sessions;
    }
    async ingest(req, body) {
        const user = await this.sessions.resolveUserFromRequest(req);
        return this.analytics.ingestEvent({
            dedupId: body.dedupId,
            eventKey: body.eventKey,
            eventVersion: body.eventVersion,
            occurredAt: body.occurredAt,
            properties: body.properties,
            source: body.source,
            userId: user?.id ?? null,
            anonymousId: user ? null : body.anonymousId ?? null,
            sessionId: body.sessionId ?? null,
            requestId: req.headers['x-request-id']?.toString() ?? null,
        });
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "ingest", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        session_service_1.SessionService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map