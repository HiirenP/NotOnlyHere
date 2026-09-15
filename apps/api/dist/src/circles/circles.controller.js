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
exports.CircleInvitesController = exports.CirclesController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const circle_admin_service_1 = require("./circle-admin.service");
const circle_invites_service_1 = require("./circle-invites.service");
const circle_membership_service_1 = require("./circle-membership.service");
const circles_service_1 = require("./circles.service");
const feed_service_1 = require("../feed/feed.service");
let CirclesController = class CirclesController {
    circles;
    membership;
    admin;
    invites;
    feed;
    constructor(circles, membership, admin, invites, feed) {
        this.circles = circles;
        this.membership = membership;
        this.admin = admin;
        this.invites = invites;
        this.feed = feed;
    }
    create(req, body) {
        return this.admin.createCircle(req.user.id, body);
    }
    list(req, q, cursor, limit) {
        return this.circles.listCircles(req.user.id, {
            q,
            cursor,
            limit: limit ? Number(limit) : undefined,
        });
    }
    get(req, id) {
        return this.circles.getCircle(id, req.user.id);
    }
    update(req, id, body) {
        return this.admin.updateCircle(id, req.user.id, body);
    }
    archive(req, id) {
        return this.admin.archiveCircle(id, req.user.id);
    }
    circleFeed(req, id, cursor, limit) {
        return this.feed.listCircleFeed(id, req.user.id, {
            cursor,
            limit: limit ? Number(limit) : undefined,
        });
    }
    listMembers(req, id, cursor, limit) {
        return this.circles.listMembers(id, req.user.id, {
            cursor,
            limit: limit ? Number(limit) : undefined,
        });
    }
    listRequests(req, id) {
        return this.admin.listPendingRequests(id, req.user.id);
    }
    approve(req, id, userId) {
        return this.admin.approveRequest(id, req.user.id, userId);
    }
    declineRequest(req, id, userId) {
        return this.admin.declineRequest(id, req.user.id, userId);
    }
    removeMember(req, id, userId) {
        return this.admin.removeMember(id, req.user.id, userId);
    }
    join(req, id) {
        return this.membership.join(id, req.user.id);
    }
    leave(req, id) {
        return this.membership.leave(id, req.user.id);
    }
    createInvite(req, id, body) {
        return this.invites.createInvite(id, req.user.id, body.inviteeUserId);
    }
    listInvites(req, id) {
        return this.invites.listInvites(id, req.user.id);
    }
    revokeInvite(req, id, inviteId) {
        return this.invites.revokeInvite(id, req.user.id, inviteId);
    }
    mute(req, id, userId, body) {
        return this.admin.muteMember(id, req.user.id, userId, body.reason);
    }
    unmute(req, id, userId) {
        return this.admin.unmuteMember(id, req.user.id, userId);
    }
    removePost(req, id, postId, body) {
        return this.admin.removeCirclePost(id, req.user.id, postId, body.reason);
    }
};
exports.CirclesController = CirclesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "archive", null);
__decorate([
    (0, common_1.Get)(':id/feed'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "circleFeed", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "listMembers", null);
__decorate([
    (0, common_1.Get)(':id/membership-requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Post)(':id/membership-requests/:userId/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/membership-requests/:userId/decline'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "declineRequest", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)(':id/membership'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "join", null);
__decorate([
    (0, common_1.Delete)(':id/membership'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "leave", null);
__decorate([
    (0, common_1.Post)(':id/invites'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Get)(':id/invites'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "listInvites", null);
__decorate([
    (0, common_1.Delete)(':id/invites/:inviteId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('inviteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "revokeInvite", null);
__decorate([
    (0, common_1.Put)(':id/mutes/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "mute", null);
__decorate([
    (0, common_1.Delete)(':id/mutes/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "unmute", null);
__decorate([
    (0, common_1.Post)(':id/posts/:postId/remove'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('postId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", void 0)
], CirclesController.prototype, "removePost", null);
exports.CirclesController = CirclesController = __decorate([
    (0, common_1.Controller)('circles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [circles_service_1.CirclesService,
        circle_membership_service_1.CircleMembershipService,
        circle_admin_service_1.CircleAdminService,
        circle_invites_service_1.CircleInvitesService,
        feed_service_1.FeedService])
], CirclesController);
let CircleInvitesController = class CircleInvitesController {
    invites;
    constructor(invites) {
        this.invites = invites;
    }
    accept(req, token) {
        return this.invites.accept(token, req.user.id);
    }
    decline(req, token) {
        return this.invites.decline(token, req.user.id);
    }
    revoke(req, id) {
        return this.invites.revokeInviteById(id, req.user.id);
    }
};
exports.CircleInvitesController = CircleInvitesController;
__decorate([
    (0, common_1.Post)(':token/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CircleInvitesController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':token/decline'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CircleInvitesController.prototype, "decline", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CircleInvitesController.prototype, "revoke", null);
exports.CircleInvitesController = CircleInvitesController = __decorate([
    (0, common_1.Controller)('circle-invites'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [circle_invites_service_1.CircleInvitesService])
], CircleInvitesController);
//# sourceMappingURL=circles.controller.js.map