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
exports.CreateTourDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTourDto {
    title;
    description;
    departureCity;
    price;
    hotelStars;
    distanceToHaram;
    duration;
    imageUrl;
    isAvailable;
}
exports.CreateTourDto = CreateTourDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Premium Umrah Package 2026', description: 'Tour title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A luxurious 14-day Umrah experience...', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dushanbe', description: 'Departure city' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "departureCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500, description: 'Price in USD' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Hotel stars (1-5)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "hotelStars", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.5, description: 'Distance to Haram in km' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "distanceToHaram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 14, description: 'Duration in days', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/tour.jpg', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false, description: 'Whether the tour is open for booking' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "isAvailable", void 0);
//# sourceMappingURL=create-tour.dto.js.map