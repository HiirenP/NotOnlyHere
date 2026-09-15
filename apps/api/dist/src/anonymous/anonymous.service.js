"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonymousService = void 0;
const common_1 = require("@nestjs/common");
const anonymous_constants_1 = require("./anonymous.constants");
let AnonymousService = class AnonymousService {
    createDisplayLabel() {
        return (0, anonymous_constants_1.generateAnonymousDisplayLabel)();
    }
};
exports.AnonymousService = AnonymousService;
exports.AnonymousService = AnonymousService = __decorate([
    (0, common_1.Injectable)()
], AnonymousService);
//# sourceMappingURL=anonymous.service.js.map