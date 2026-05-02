"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTourDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tour_dto_1 = require("./create-tour.dto");
class UpdateTourDto extends (0, swagger_1.PartialType)(create_tour_dto_1.CreateTourDto) {
}
exports.UpdateTourDto = UpdateTourDto;
//# sourceMappingURL=update-tour.dto.js.map