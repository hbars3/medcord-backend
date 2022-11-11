import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { NotesService } from '../services/notes.service';
import { Response } from 'express';
import { Note } from '../entities/notes.entity';
import { DeleteResult } from 'typeorm';
import { NoteBodyDto } from '../dto/noteBodyDto.dto';
import { NoteQueryDto } from '../dto/noteQueryDto.dto';

/* The NotesController class is a NestJS controller that uses the NotesService class to handle HTTP
requests to the /notes endpoint. */
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  /**
   * It gets all the active notes from the database and returns them in the response
   * @param {Response} res - Response - This is the response object that will be returned to the client.
   * @returns An array of notes
   */
  async getActive(@Res() res: Response) {
    try {
      const notes: Note[] = await this.notesService.findActive();
      return res.status(HttpStatus.OK).json(notes);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not get active notes',
        error,
      });
    }
  }

  @Get('/archived')
  /**
   * It gets all the archived notes from the database and returns them in the response
   * @param {Response} res - Response - This is the response object that we will use to send back a
   * response to the client.
   * @returns An array of notes that have been archived.
   */
  async getArchived(@Res() res: Response) {
    try {
      const notes: Note[] = await this.notesService.findArchived();
      return res.status(HttpStatus.OK).json(notes);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not get archived notes',
        error,
      });
    }
  }

  @Post()
  /**
   * It creates a note
   * @param {CreateNoteBodyDto} body - CreateNoteBodyDto
   * @returns The return type is a Promise of a Note.
   */
  async create(@Res() res: Response, @Body() body: NoteBodyDto) {
    try {
      const note: Note = await this.notesService.create(body);
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not create note',
        error,
      });
    }
  }

  @Put()
  /**
   * It takes a query parameter and a body parameter, and returns a promise of a note
   * @param {UpdateNoteQueryDto} query - UpdateNoteQueryDto - This are the query parameters that are
   * passed in the URL.
   * @param {UpdateNoteBodyDto} body - UpdateNoteBodyDto
   * @returns The updated note.
   */
  async update(
    @Res() res: Response,
    @Query() query: NoteQueryDto,
    @Body() body: NoteBodyDto,
  ) {
    try {
      const note: Note = await this.notesService.update(query.id, body);
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not update note',
        error,
      });
    }
  }

  @Delete()
  /**
   * It takes a query parameter, and passes it to the service
   * @param {DeleteNoteQueryDto} query - DeleteNoteQueryDto
   * @returns The result of the delete method in the notes service.
   */
  async delete(@Res() res: Response, @Query() query: NoteQueryDto) {
    try {
      const note: DeleteResult = await this.notesService.delete(query.id);
      return res.status(HttpStatus.OK).json({
        note,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not delete note',
        error,
      });
    }
  }

  @Put('/archive')
/**
 * It takes a note id as a query parameter, and then calls the archive() function in the notes service
 * @param {Response} res - Response - This is the response object that we will use to send back a
 * response to the client.
 * @param {NoteQueryDto} query - NoteQueryDto - This is a DTO (Data Transfer Object) that we will
 * create in the next step.
 * @returns The note that was archived
 */
  async archive(@Res() res: Response, @Query() query: NoteQueryDto) {
    try {
      const note: Note = await this.notesService.archive(query.id);
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not archive note',
        error,
      });
    }
  }

  @Put('/unarchive')
/**
 * It takes a note id as a query parameter, calls the unarchive() function in the notes service, and
 * returns the updated note
 * @param {Response} res - Response - This is the response object that we will use to send back a
 * response to the client.
 * @param {NoteQueryDto} query - NoteQueryDto - This is the query object that we will be sending to the
 * server.
 * @returns The note that was unarchived
 */
  async unarchive(@Res() res: Response, @Query() query: NoteQueryDto) {

    try {
      const note: Note = await this.notesService.unarchive(query.id);
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Could not unarchive note',
        error,
      });
    }
  }
}
