"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const anonymous_module_1 = require("../anonymous/anonymous.module");
const auth_module_1 = require("../auth/auth.module");
const activity_service_1 = require("../activity/activity.service");
const media_service_1 = require("../media/media.service");
const feed_controller_1 = require("./feed.controller");
const comments_service_1 = require("./comments.service");
const outbox_module_1 = require("../outbox/outbox.module");
const feed_policy_service_1 = require("./feed-policy.service");
const feed_service_1 = require("./feed.service");
const link_preview_service_1 = require("./link-preview.service");
const posts_service_1 = require("./posts.service");
const search_service_1 = require("./search.service");
let FeedModule = class FeedModule {
};
exports.FeedModule = FeedModule;
exports.FeedModule = FeedModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, anonymous_module_1.AnonymousModule, outbox_module_1.OutboxModule],
        controllers: [feed_controller_1.FeedController, feed_controller_1.PostsController, feed_controller_1.CommentsController, feed_controller_1.LinkPreviewsController],
        providers: [
            feed_service_1.FeedService,
            posts_service_1.PostsService,
            feed_policy_service_1.FeedPolicyService,
            activity_service_1.ActivityService,
            media_service_1.MediaService,
            comments_service_1.CommentsService,
            comments_service_1.ReactionsService,
            link_preview_service_1.LinkPreviewService,
            search_service_1.SearchService,
        ],
        exports: [feed_policy_service_1.FeedPolicyService, posts_service_1.PostsService, feed_service_1.FeedService],
    })
], FeedModule);
//# sourceMappingURL=feed.module.js.map