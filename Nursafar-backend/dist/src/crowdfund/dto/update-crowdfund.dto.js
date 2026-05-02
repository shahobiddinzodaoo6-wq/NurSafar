"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCrowdfundDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_crowdfund_dto_1 = require("./create-crowdfund.dto");
class UpdateCrowdfundDto extends (0, swagger_1.PartialType)(create_crowdfund_dto_1.CreateCrowdfundDto) {
}
exports.UpdateCrowdfundDto = UpdateCrowdfundDto;
//# sourceMappingURL=update-crowdfund.dto.js.map