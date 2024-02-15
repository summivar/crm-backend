import { Controller, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DevService } from './dev.service';

@ApiTags('dev')
@Controller('dev')
export class DevController {
  constructor(private devService: DevService) {
  }

  @ApiOperation({summary: 'Удаление всего'})
  @Delete('deleteAll')
  async deleteAll() {
    return this.devService.deleteAll();
  }
}
