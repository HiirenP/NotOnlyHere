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
exports.OutboxController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const outbox_service_1 = require("./outbox.service");
let OutboxController = class OutboxController {
    outbox;
    constructor(outbox) {
        this.outbox = outbox;
    }
    async emitNoop() {
        const event = await this.outbox.emitNoop((0, crypto_1.randomUUID)(), 'phase0-walking-skeleton');
        return { id: event.id, status: event.status };
    }
};
exports.OutboxController = OutboxController;
__decorate([
    (0, common_1.Post)('noop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OutboxController.prototype, "emitNoop", null);
exports.OutboxController = OutboxController = __decorate([
    (0, common_1.Controller)('internal/outbox'),
    __metadata("design:paramtypes", [outbox_service_1.OutboxService])
], OutboxController);
//# sourceMappingURL=outbox.controller.js.map