import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../entities/notes.entity';
import { NoteBodyDto } from '../dto/noteBodyDto.dto';

/* It's a service that uses the Note repository to find all notes */
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  /**
   * Find all notes that are active.
   * @returns An array of notes that are active.
   */
  async findActive(): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { archived: false },
    });
  }

/**
 * Find all notes that are archived.
 * @returns An array of notes that have been archived.
 */
  async findArchived(): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { archived: true },
    });
  }

  /**
   * We're creating a new note using the create method from the notesRepository, and then saving it using
   * the save method from the notesRepository
   * @param {CreateNoteBodyDto} body - CreateNoteBodyDto
   * @returns The new note that was created.
   */
  async create(body: NoteBodyDto): Promise<Note> {
    const newNote = this.notesRepository.create({
      title: body.title,
      description: body.description,
    });
    return await this.notesRepository.save(newNote);
  }

  /**
   * We're finding a note by its id, merging the body of the request with the note, and then saving the
   * note
   * @param {number} id - number - the id of the note we want to update
   * @param {UpdateNoteBodyDto} body - UpdateNoteBodyDto
   * @returns The updated note
   */
  async update(id: number, body: NoteBodyDto): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
    });
    this.notesRepository.merge(note, body);
    return await this.notesRepository.save(note);
  }

  /**
   * It deletes a note from the database
   * @param {number} id - number - The id of the note to delete
   * @returns The result of the delete operation.
   */
  async delete(id: number): Promise<DeleteResult> {
    return await this.notesRepository.delete(id);
  }

/**
 * Find a note by its id, set its archived property to true, and save it.
 * @param {number} id - number - The id of the note to archive
 * @returns The note that was archived.
 */
  async archive(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
    });
    note.archived = true;
    return await this.notesRepository.save(note);
  }

/**
 * It finds a note by its id, sets its archived property to false, and then saves the note
 * @param {number} id - number - The id of the note to be unarchived.
 * @returns The note that was just updated.
 */
  async unarchive(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
    });
    note.archived = false;
    return await this.notesRepository.save(note);
  }

}
