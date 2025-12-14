import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendDatabaseModule } from '@backend/database';

@Module({
  imports: [ 
    BackendDatabaseModule.forRoot('DB_NAME_AUTH')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
