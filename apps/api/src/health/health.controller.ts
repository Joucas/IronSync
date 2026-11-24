import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check that the API and the database are up' })
  @ApiServiceUnavailableResponse({
    description: 'The database is unreachable.',
  })
  check(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }
}
