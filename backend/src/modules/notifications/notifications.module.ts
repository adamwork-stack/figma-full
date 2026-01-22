import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../database/entities/notification.entity';
// Import controllers and services here as they are created
// import { NotificationsController } from './notifications.controller';
// import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  // controllers: [NotificationsController],
  // providers: [NotificationsService],
  // exports: [NotificationsService],
})
export class NotificationsModule {}
