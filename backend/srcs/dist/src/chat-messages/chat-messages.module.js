"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessagesModule = void 0;
const common_1 = require("@nestjs/common");
const chat_messages_service_1 = require("./chat-messages.service");
const chat_messages_controller_1 = require("./chat-messages.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ChatMessagesModule = exports.ChatMessagesModule = class ChatMessagesModule {
};
exports.ChatMessagesModule = ChatMessagesModule = __decorate([
    (0, common_1.Module)({
        controllers: [chat_messages_controller_1.ChatMessagesController],
        providers: [chat_messages_service_1.ChatMessagesService],
        imports: [prisma_module_1.PrismaModule]
    })
], ChatMessagesModule);
//# sourceMappingURL=chat-messages.module.js.map