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
exports.LinkPreviewsController = exports.CommentsController = exports.PostsController = exports.FeedController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const comments_service_1 = require("./comments.service");
const feed_service_1 = require("./feed.service");
const link_preview_service_1 = require("./link-preview.service");
const posts_service_1 = require("./posts.service");
const search_service_1 = require("./search.service");
let FeedController = class FeedController {
    feed;
    search;
    constructor(feed, search) {
        this.feed = feed;
        this.search = search;
    }
    list(req, mode, cursor, limit) {
        return this.feed.listFeed(req.user.id, { mode, cursor, limit: limit ? Number(limit) : undefined });
    }
    searchPosts(req, q, cursor, limit) {
        return this.search.searchPosts(req.user.id, { q, cursor, limit: limit ? Number(limit) : undefined });
    }
};
exports.FeedController = FeedController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('mode')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "searchPosts", null);
exports.FeedController = FeedController = __decorate([
    (0, common_1.Controller)('feed'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [feed_service_1.FeedService,
        search_service_1.SearchService])
], FeedController);
let PostsController = class PostsController {
    posts;
    comments;
    reactions;
    constructor(posts, comments, reactions) {
        this.posts = posts;
        this.comments = comments;
        this.reactions = reactions;
    }
    create(req, body) {
        return this.posts.createPost(req.user.id, body);
    }
    get(req, id) {
        return this.posts.getPost(id, req.user.id);
    }
    update(req, id, body) {
        return this.posts.updatePost(id, req.user.id, body);
    }
    remove(req, id) {
        return this.posts.deletePost(id, req.user.id);
    }
    listComments(req, id) {
        return this.comments.list(id, req.user.id);
    }
    createComment(req, id, body) {
        return this.comments.create(id, req.user.id, body);
    }
    setReaction(req, id, kind) {
        return this.reactions.setPostReaction(id, req.user.id, this.reactions.assertKind(kind));
    }
    removeReaction(req, id) {
        return this.reactions.removePostReaction(id, req.user.id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "listComments", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Put)(':id/reactions/:kind'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "setReaction", null);
__decorate([
    (0, common_1.Delete)(':id/reactions/:kind'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "removeReaction", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        comments_service_1.CommentsService,
        comments_service_1.ReactionsService])
], PostsController);
let CommentsController = class CommentsController {
    comments;
    constructor(comments) {
        this.comments = comments;
    }
    update(req, id, body) {
        return this.comments.update(id, req.user.id, body);
    }
    remove(req, id) {
        return this.comments.delete(id, req.user.id);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "remove", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
let LinkPreviewsController = class LinkPreviewsController {
    linkPreviews;
    constructor(linkPreviews) {
        this.linkPreviews = linkPreviews;
    }
    preview(body) {
        return this.linkPreviews.fetchPreview(body.url);
    }
};
exports.LinkPreviewsController = LinkPreviewsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LinkPreviewsController.prototype, "preview", null);
exports.LinkPreviewsController = LinkPreviewsController = __decorate([
    (0, common_1.Controller)('link-previews'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [link_preview_service_1.LinkPreviewService])
], LinkPreviewsController);
//# sourceMappingURL=feed.controller.js.map