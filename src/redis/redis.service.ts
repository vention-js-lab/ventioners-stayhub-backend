import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCache } from 'cache-manager-redis-yet';
import ms from 'ms';
import { RedisClientType } from 'redis';
import { parseJSON } from 'src/shared/helpers';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async blacklistRefreshToken(token: string): Promise<void> {
    await this.set(
      token,
      'blacklisted',
      ms(this.configService.get<string>('AUTH_REFRESH_TOKEN_EXPIRES_IN')) *
        1000,
    );
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const value = await this.get(token);

    return value === 'blacklisted';
  }

  get redis(): RedisClientType {
    return this.cacheManager.store.client;
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(
    key: string,
    value: string,
    expirationTimeInSeconds: number,
  ): Promise<string> {
    return await this.redis.set(key, value, { EX: expirationTimeInSeconds });
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);

    return exists === 0 ? false : true;
  }

  async delete(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async hGet<T>(key: string, field: string): Promise<T | string | undefined> {
    const result = await this.redis.hGet(key, field);

    return parseJSON<T>(result);
  }

  async hGetAll<T>(key: string): Promise<{ [key: string]: T | string } | null> {
    const result = await this.redis.hGetAll(key);

    if (Object.keys(result).length === 0) {
      return null;
    }

    const parsedResult: { [key: string]: T | string } = {};

    for (const field in result) {
      parsedResult[field] = parseJSON<T>(result[field]);
    }

    return parsedResult;
  }

  async hSet<T>(key: string, field: string, value: T): Promise<number> {
    return await this.redis.hSet(key, field, JSON.stringify(value));
  }

  async hDel(key: string, field: [string, ...string[]]): Promise<number> {
    return await this.redis.hDel(key, field);
  }

  async hExists(key: string, field: string): Promise<boolean> {
    return await this.redis.hExists(key, field);
  }

  async hSetExpiryTime(
    key: string,
    time: number,
    mode?: 'NX' | 'XX' | 'GT' | 'LT',
  ): Promise<boolean> {
    return await this.redis.expire(key, time, mode);
  }
}
