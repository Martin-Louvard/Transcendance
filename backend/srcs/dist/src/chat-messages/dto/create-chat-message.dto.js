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
exports.CreateChatMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const chat_channel_entity_1 = require("../../chat-channels/entities/chat-channel.entity");
const user_entity_1 = require("../../users/entities/user.entity");
class CreateChatMessageDto {
}
exports.CreateChatMessageDto = CreateChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", chat_channel_entity_1.ChatChannel)
], CreateChatMessageDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_entity_1.User)
], CreateChatMessageDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateChatMessageDto.prototype, "content", void 0);
//# sourceMappingURL=create-chat-message.dto.js.map