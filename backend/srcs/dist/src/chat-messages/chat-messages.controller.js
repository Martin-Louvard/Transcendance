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
exports.ChatMessagesController = void 0;
const common_1 = require("@nestjs/common");
const chat_messages_service_1 = require("./chat-messages.service");
const create_chat_message_dto_1 = require("./dto/create-chat-message.dto");
const update_chat_message_dto_1 = require("./dto/update-chat-message.dto");
const swagger_1 = require("@nestjs/swagger");
let ChatMessagesController = exports.ChatMessagesController = class ChatMessagesController {
    constructor(chatMessagesService) {
        this.chatMessagesService = chatMessagesService;
    }
    create(createChatMessageDto) {
        return this.chatMessagesService.create(createChatMessageDto);
    }
    findAll() {
        return this.chatMessagesService.findAll();
    }
    findOne(id) {
        return this.chatMessagesService.findOne(+id);
    }
    update(id, updateChatMessageDto) {
        return this.chatMessagesService.update(+id, updateChatMessageDto);
    }
    remove(id) {
        return this.chatMessagesService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_message_dto_1.CreateChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatMessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatMessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatMessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chat_message_dto_1.UpdateChatMessageDto]),
    __metadata("design:returntype", void 0)
], ChatMessagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatMessagesController.prototype, "remove", null);
exports.ChatMessagesController = ChatMessagesController = __decorate([
    (0, common_1.Controller)('chat-messages'),
    (0, swagger_1.ApiTags)('chat-messages'),
    __metadata("design:paramtypes", [chat_messages_service_1.ChatMessagesService])
], ChatMessagesController);
//# sourceMappingURL=chat-messages.controller.js.map