"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirclePolicyService = void 0;
const common_1 = require("@nestjs/common");
let CirclePolicyService = class CirclePolicyService {
    isActiveMember(membership) {
        return membership?.status === 'ACTIVE';
    }
    canDiscoverInDirectory(circle, membership) {
        if (circle.status !== 'ACTIVE')
            return false;
        if (circle.visibility === 'HIDDEN')
            return this.isActiveMember(membership);
        return true;
    }
    canViewDetail(circle, membership) {
        if (circle.status !== 'ACTIVE')
            return this.isActiveMember(membership);
        if (circle.visibility === 'HIDDEN')
            return this.isActiveMember(membership);
        return true;
    }
    canViewMemberList(membership) {
        return this.isActiveMember(membership);
    }
    canJoin(circle, membership) {
        if (circle.status !== 'ACTIVE')
            return false;
        if (membership?.status === 'ACTIVE' || membership?.status === 'PENDING')
            return false;
        if (circle.joinPolicy === 'PRIVATE')
            return false;
        return true;
    }
    canLeave(membership) {
        return membership?.status === 'ACTIVE';
    }
};
exports.CirclePolicyService = CirclePolicyService;
exports.CirclePolicyService = CirclePolicyService = __decorate([
    (0, common_1.Injectable)()
], CirclePolicyService);
//# sourceMappingURL=circle-policy.service.js.map