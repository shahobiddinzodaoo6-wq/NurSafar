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
exports.LogisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logistics_service_1 = require("./logistics.service");
const create_logistics_dto_1 = require("./dto/create-logistics.dto");
const update_logistics_dto_1 = require("./dto/update-logistics.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let LogisticsController = class LogisticsController {
    logisticsService;
    constructor(logisticsService) {
        this.logisticsService = logisticsService;
    }
    create(dto) {
        return this.logisticsService.create(dto);
    }
    findAll() {
        return this.logisticsService.findAll();
    }
    myTrips(user) {
        return this.logisticsService.findByDriver(user.id);
    }
    findOne(id) {
        return this.logisticsService.findOne(id);
    }
    update(id, dto) {
        return this.logisticsService.update(id, dto);
    }
    remove(id) {
        return this.logisticsService.remove(id);
    }
};
exports.LogisticsController = LogisticsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Create a logistics/transit booking' }),
    (0, swagger_1.ApiBody)({ type: create_logistics_dto_1.CreateLogisticsDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Logistics booking created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_logistics_dto_1.CreateLogisticsDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Get all logistics bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all logistics bookings.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-trips'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    (0, swagger_1.ApiOperation)({ summary: '[DRIVER] Get assigned trips' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return driver assigned trips.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "myTrips", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a logistics booking by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Logistics ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the logistics booking.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Logistics booking not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '[AUTH] Update a logistics booking' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Logistics ID' }),
    (0, swagger_1.ApiBody)({ type: update_logistics_dto_1.UpdateLogisticsDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logistics booking updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_logistics_dto_1.UpdateLogisticsDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[ADMIN] Delete a logistics booking' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Logistics ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logistics booking deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "remove", null);
exports.LogisticsController = LogisticsController = __decorate([
    (0, swagger_1.ApiTags)('logistics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [logistics_service_1.LogisticsService])
], LogisticsController);
//# sourceMappingURL=logistics.controller.js.map