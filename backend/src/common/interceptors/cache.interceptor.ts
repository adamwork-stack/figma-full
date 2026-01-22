import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Simple cache implementation
    // In production, use Redis for distributed caching
    const cache = new Map<string, { data: any; timestamp: number }>();
    const ttl = 60000; // 1 minute

    const request = context.switchToHttp().getRequest();
    const cacheKey = request.url;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        cache.set(cacheKey, { data, timestamp: Date.now() });
      }),
    );
  }
}
