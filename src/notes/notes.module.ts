import { Module } from '@nestjs/common';
import { NotesService } from './services/notes.service';
import { NotesController } from './controllers/notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/notes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note])
  ],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule {}
