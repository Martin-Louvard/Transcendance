"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatChannelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_chat_channel_dto_1 = require("./create-chat-channel.dto");
class UpdateChatChannelDto extends (0, swagger_1.PartialType)(create_chat_channel_dto_1.CreateChatChannelDto) {
}
exports.UpdateChatChannelDto = UpdateChatChannelDto;
//# sourceMappingURL=update-chat-channel.dto.js.map