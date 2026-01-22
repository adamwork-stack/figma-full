import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { PurchaseTicketsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: "Get user's tickets" })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  findAll(@CurrentUser() user: User) {
    return this.ticketsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketsService.findOne(id, user.id);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Purchase tickets' })
  @ApiResponse({ status: 201, description: 'Tickets purchased successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  purchase(@Body() purchaseDto: PurchaseTicketsDto, @CurrentUser() user: User) {
    return this.ticketsService.purchase(purchaseDto, user.id);
  }
}
