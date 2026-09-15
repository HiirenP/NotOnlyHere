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
exports.MediaController = exports.BlocksController = exports.ConnectionsController = exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const activity_service_1 = require("../activity/activity.service");
const media_service_1 = require("../media/media.service");
const profiles_service_1 = require("./profiles.service");
const block_service_1 = require("../social/block.service");
const connection_service_1 = require("../social/connection.service");
const posts_service_1 = require("../feed/posts.service");
let ProfilesController = class ProfilesController {
    profiles;
    activity;
    posts;
    constructor(profiles, activity, posts) {
        this.profiles = profiles;
        this.activity = activity;
        this.posts = posts;
    }
    getMe(req) {
        return this.profiles.getMyProfile(req.user.id);
    }
    updateMe(req, body) {
        return this.profiles.updateMyProfile(req.user.id, body);
    }
    listPosts(req, username) {
        return this.posts.listByUsername(username, req.user.id);
    }
    getByUsername(req, username) {
        return this.profiles.getProfileByUsername(username, req.user.id);
    }
    async getActivity(req, username) {
        const profile = await this.profiles.getProfileByUsername(username, req.user.id);
        if (!profile.viewer.isSelf) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Activity is only visible to the profile owner.' });
        }
        return this.activity.listForUser(profile.userId, req.user.id);
    }
};
exports.ProfilesController = ProfilesController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)(':username/posts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "listPosts", null);
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProfilesController.prototype, "getByUsername", null);
__decorate([
    (0, common_1.Get)(':username/activity'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getActivity", null);
exports.ProfilesController = ProfilesController = __decorate([
    (0, common_1.Controller)('profiles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService,
        activity_service_1.ActivityService,
        posts_service_1.PostsService])
], ProfilesController);
let ConnectionsController = class ConnectionsController {
    connections;
    constructor(connections) {
        this.connections = connections;
    }
    list(req) {
        return this.connections.listConnections(req.user.id);
    }
    createRequest(req, body) {
        if (!body.username?.trim()) {
            throw new common_1.BadRequestException({ code: 'USERNAME_REQUIRED', message: 'Username is required.' });
        }
        return this.connections.sendRequest(req.user.id, body.username);
    }
    accept(req, id) {
        return this.connections.acceptConnection(id, req.user.id);
    }
    remove(req, id) {
        return this.connections.removeConnection(id, req.user.id);
    }
};
exports.ConnectionsController = ConnectionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "accept", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "remove", null);
exports.ConnectionsController = ConnectionsController = __decorate([
    (0, common_1.Controller)('connections'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], ConnectionsController);
let BlocksController = class BlocksController {
    blocks;
    constructor(blocks) {
        this.blocks = blocks;
    }
    async list(req) {
        const rows = await this.blocks.listBlocks(req.user.id);
        return rows.map((row) => ({
            userId: row.blockedId,
            username: row.blocked.profile?.username ?? 'member',
            displayName: row.blocked.profile?.displayName ?? 'Member',
            blockedAt: row.createdAt.toISOString(),
        }));
    }
    async create(req, body) {
        const target = await this.blocks.resolveTargetUser(body);
        await this.blocks.blockUser(req.user.id, target.id);
        return { ok: true };
    }
    async remove(req, userId) {
        await this.blocks.unblockUser(req.user.id, userId);
        return { ok: true };
    }
};
exports.BlocksController = BlocksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "remove", null);
exports.BlocksController = BlocksController = __decorate([
    (0, common_1.Controller)('blocks'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [block_service_1.BlockService])
], BlocksController);
let MediaController = class MediaController {
    media;
    constructor(media) {
        this.media = media;
    }
    createUpload(req, body) {
        return this.media.createUploadIntent(req.user.id, body.purpose, body.declaredMime, body.byteSize);
    }
    completeUpload(req, id, body) {
        return this.media.completeUpload(id, req.user.id, body.uploadToken, body);
    }
    async serveFile(req, id, res) {
        await this.media.getReadableAsset(id, req.user.id);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e8eaed"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#676a79" font-family="monospace" font-size="18">Media ${id.slice(0, 8)}</text></svg>`;
        res.setHeader('content-type', 'image/svg+xml');
        res.send(svg);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('uploads'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "createUpload", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "completeUpload", null);
__decorate([
    (0, common_1.Get)(':id/file'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "serveFile", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=profiles.controller.js.map