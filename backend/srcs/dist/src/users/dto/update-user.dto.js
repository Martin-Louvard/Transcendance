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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./create-user.dto");
const swagger_2 = require("@nestjs/swagger");
const user_entity_1 = require("../entities/user.entity");
class UpdateUserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "twoFAEnabled", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "victoriesCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "defeatCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "rank", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "level", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", user_entity_1.User)
], UpdateUserDto.prototype, "friends", void 0);
//# sourceMappingURL=update-user.dto.js.map