import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { CreateNotificationDto } from './dto';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private firebaseApp: admin.app.App;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    // Initialize Firebase Admin SDK
    // In production, initialize with service account credentials
    if (!admin.apps.length) {
      try {
        this.firebaseApp = admin.initializeApp({
          // Credentials will be loaded from environment variables
        });
      } catch (error) {
        console.warn('Firebase Admin not initialized:', error);
      }
    }
  }

  async create(createDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createDto);
    const savedNotification = await this.notificationRepository.save(
      notification,
    );

    // Send push notification if Firebase is configured
    if (this.firebaseApp) {
      try {
        await this.sendPushNotification(
          createDto.userId,
          createDto.title,
          createDto.message,
          createDto.data,
        );
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }

    return savedNotification;
  }

  async findAll(userId: string, unreadOnly?: boolean) {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.read = :read', { read: false });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.findOne(id, userId);

    notification.read = true;
    notification.readAt = new Date();

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    return { message: 'All notifications marked as read' };
  }

  async remove(id: string, userId: string) {
    const notification = await this.findOne(id, userId);
    await this.notificationRepository.remove(notification);
    return { message: 'Notification deleted' };
  }

  private async sendPushNotification(
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    // TODO: Get FCM token from user's device
    // For now, this is a placeholder
    // In production, you would:
    // 1. Store FCM tokens in a user_devices table
    // 2. Retrieve tokens for the user
    // 3. Send to all user's devices

    // Example implementation:
    // const tokens = await this.getUserFCMTokens(userId);
    // if (tokens.length > 0) {
    //   await admin.messaging().sendMulticast({
    //     tokens,
    //     notification: { title, body: message },
    //     data: data || {},
    //   });
    // }
  }
}
