import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class BackendDatabaseModule {
  static forRoot(dbNameEnvVar: string): DynamicModule {
    return {
      module: BackendDatabaseModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>(dbNameEnvVar),
            autoLoadEntities: true,
            synchronize: true, // DEV only
            namingStrategy: new SnakeNamingStrategy(),
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}