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
exports.AdminBlogController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../admin/admin.guard");
const auth_guard_1 = require("../auth/auth.guard");
const blog_service_1 = require("./blog.service");
let AdminBlogController = class AdminBlogController {
    blog;
    constructor(blog) {
        this.blog = blog;
    }
    list(req, cursor, limit, status) {
        return this.blog.listAdmin(req.user.id, { cursor, limit: limit ? Number(limit) : undefined, status });
    }
    create(req, body) {
        return this.blog.createPost(req.user.id, body);
    }
    get(req, id) {
        return this.blog.getAdminPost(req.user.id, id);
    }
    update(req, id, body) {
        return this.blog.updatePost(req.user.id, id, body);
    }
    publish(req, id) {
        return this.blog.publishPost(req.user.id, id);
    }
    schedule(req, id, body) {
        return this.blog.schedulePost(req.user.id, id, body.scheduledAt);
    }
    unpublish(req, id) {
        return this.blog.unpublishPost(req.user.id, id);
    }
    archive(req, id) {
        return this.blog.archivePost(req.user.id, id);
    }
};
exports.AdminBlogController = AdminBlogController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_guard_1.AdminPermission)('blog.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('cursor')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, admin_guard_1.AdminPermission)('blog.write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, admin_guard_1.AdminPermission)('blog.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, admin_guard_1.AdminPermission)('blog.write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, admin_guard_1.AdminPermission)('blog.publish'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/schedule'),
    (0, admin_guard_1.AdminPermission)('blog.publish'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "schedule", null);
__decorate([
    (0, common_1.Post)(':id/unpublish'),
    (0, admin_guard_1.AdminPermission)('blog.publish'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, admin_guard_1.AdminPermission)('blog.write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminBlogController.prototype, "archive", null);
exports.AdminBlogController = AdminBlogController = __decorate([
    (0, common_1.Controller)('admin/blogs'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], AdminBlogController);
//# sourceMappingURL=admin-blog.controller.js.map