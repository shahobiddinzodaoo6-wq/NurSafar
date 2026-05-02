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
exports.CrowdfundController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crowdfund_service_1 = require("./crowdfund.service");
const create_crowdfund_dto_1 = require("./dto/create-crowdfund.dto");
const update_crowdfund_dto_1 = require("./dto/update-crowdfund.dto");
const donate_dto_1 = require("./dto/donate.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let CrowdfundController = class CrowdfundController {
    crowdfundService;
    constructor(crowdfundService) {
        this.crowdfundService = crowdfundService;
    }
    findAll() {
        return this.crowdfundService.findAll();
    }
    findOne(id) {
        return this.crowdfundService.findOne(id);
    }
    create(dto, user) {
        return this.crowdfundService.create(user.id, dto);
    }
    donate(id, dto, user) {
        return this.crowdfundService.donate(id, user.id, dto);
    }
    update(id, dto) {
        return this.crowdfundService.update(id, dto);
    }
    remove(id) {
        return this.crowdfundService.remove(id);
    }
};
exports.CrowdfundController = CrowdfundController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all crowdfunding campaigns (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all campaigns.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a crowdfunding campaign by ID (public)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Campaign ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the campaign.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Campaign not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Create a new crowdfunding campaign' }),
    (0, swagger_1.ApiBody)({ type: create_crowdfund_dto_1.CreateCrowdfundDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campaign created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_crowdfund_dto_1.CreateCrowdfundDto, Object]),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/donate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Donate to a crowdfunding campaign' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Campaign ID' }),
    (0, swagger_1.ApiBody)({ type: donate_dto_1.DonateDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Donation recorded.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Campaign already completed.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donate_dto_1.DonateDto, Object]),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "donate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Update a crowdfunding campaign' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Campaign ID' }),
    (0, swagger_1.ApiBody)({ type: update_crowdfund_dto_1.UpdateCrowdfundDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_crowdfund_dto_1.UpdateCrowdfundDto]),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Delete a crowdfunding campaign' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Campaign ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrowdfundController.prototype, "remove", null);
exports.CrowdfundController = CrowdfundController = __decorate([
    (0, swagger_1.ApiTags)('crowdfund'),
    (0, common_1.Controller)('crowdfund'),
    __metadata("design:paramtypes", [crowdfund_service_1.CrowdfundService])
], CrowdfundController);
//# sourceMappingURL=crowdfund.controller.js.map