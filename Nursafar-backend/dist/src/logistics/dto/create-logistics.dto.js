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
exports.CreateLogisticsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLogisticsDto {
    bookingId;
    pickupAddress;
    pickupTime;
    driverId;
}
exports.CreateLogisticsDto = CreateLogisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-booking-456', description: 'ID of the booking associated with this transit' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogisticsDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Rudaki Ave, Dushanbe', description: 'Pickup address' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLogisticsDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-01T10:00:00Z', description: 'Scheduled pickup time (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLogisticsDto.prototype, "pickupTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-driver-789', required: false, description: 'Assigned driver ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLogisticsDto.prototype, "driverId", void 0);
//# sourceMappingURL=create-logistics.dto.js.map