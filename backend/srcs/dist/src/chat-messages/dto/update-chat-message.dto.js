"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_chat_message_dto_1 = require("./create-chat-message.dto");
class UpdateChatMessageDto extends (0, swagger_1.PartialType)(create_chat_message_dto_1.CreateChatMessageDto) {
}
exports.UpdateChatMessageDto = UpdateChatMessageDto;
//# sourceMappingURL=update-chat-message.dto.js.map