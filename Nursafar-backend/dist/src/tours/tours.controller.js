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
exports.ToursController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tours_service_1 = require("./tours.service");
const create_tour_dto_1 = require("./dto/create-tour.dto");
const update_tour_dto_1 = require("./dto/update-tour.dto");
const search_tour_dto_1 = require("./dto/search-tour.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ToursController = class ToursController {
    toursService;
    constructor(toursService) {
        this.toursService = toursService;
    }
    search(filters) {
        return this.toursService.search(filters);
    }
    partnerTours(user) {
        return this.toursService.findPartnerTours(user.id);
    }
    partnerStats(user) {
        return this.toursService.getPartnerStats(user.id);
    }
    partnerClients(user) {
        return this.toursService.findPartnerClients(user.id);
    }
    findAll() {
        return this.toursService.findAll();
    }
    findOne(id) {
        return this.toursService.findOne(id);
    }
    create(dto, user) {
        return this.toursService.create(user.id, dto);
    }
    book(id, user) {
        return this.toursService.book(id, user.id);
    }
    myBookings(user) {
        return this.toursService.findUserBookings(user.id);
    }
    update(id, dto, user) {
        return this.toursService.update(id, user.id, dto);
    }
    remove(id, user) {
        return this.toursService.remove(id, user.id);
    }
};
exports.ToursController = ToursController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search tours with filters (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filtered list of available tours.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_tour_dto_1.SearchTourDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('partner-tours'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Get own tours with booking counts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return partner tours.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "partnerTours", null);
__decorate([
    (0, common_1.Get)('partner-stats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Get dashboard stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return partner stats.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "partnerStats", null);
__decorate([
    (0, common_1.Get)('partner-clients'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Get clients who booked own tours' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return partner clients.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "partnerClients", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tours (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all tours.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a tour by ID (public)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tour ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the tour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tour not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Create a new tour' }),
    (0, swagger_1.ApiBody)({ type: create_tour_dto_1.CreateTourDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tour created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_dto_1.CreateTourDto, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/book'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[CLIENT] Book a tour' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tour ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "book", null);
__decorate([
    (0, common_1.Get)('my/bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '[CLIENT] Get current user bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return user bookings.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "myBookings", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Update a tour' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tour ID' }),
    (0, swagger_1.ApiBody)({ type: update_tour_dto_1.UpdateTourDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tour_dto_1.UpdateTourDto, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PARTNER', 'ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: '[PARTNER] Delete a tour' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Tour ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tour deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "remove", null);
exports.ToursController = ToursController = __decorate([
    (0, swagger_1.ApiTags)('tours'),
    (0, common_1.Controller)('tours'),
    __metadata("design:paramtypes", [tours_service_1.ToursService])
], ToursController);
//# sourceMappingURL=tours.controller.js.map