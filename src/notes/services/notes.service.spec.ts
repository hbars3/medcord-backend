import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteBodyDto } from '../dto/noteBodyDto.dto';
import { NotesService } from '../services/notes.service';
import { Note } from '../entities/notes.entity';

const noteBodyDto = new NoteBodyDto();
const oneNote = new Note();
const secondNote = new Note();
secondNote.archived = true;
const mockRepository = () => ({
  create: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
});
type MockRepository<T = any> = Partial<
  Record<keyof Repository<Note>, jest.Mock>
>;

describe('UserService', () => {
  let noteService: NotesService;
  let notesRepository: MockRepository<Note>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    noteService = module.get<NotesService>(NotesService);
    notesRepository = module.get(getRepositoryToken(Note));
  });

  it('Should be defined', () => {
    expect(noteService).toBeDefined();
  });
  it('Should return that it got all active notes', async () => {
    notesRepository.find.mockResolvedValue(oneNote);
    expect(await noteService.findActive()).toEqual(oneNote);
    expect(notesRepository.find).toBeCalledTimes(1);
    expect(notesRepository.find).toBeCalledWith({
      where: { archived: false },
    });
  });
  it('Should return that it got all unactive notes', async () => {
    notesRepository.find.mockResolvedValue(secondNote);
    expect(await noteService.findArchived()).toEqual(secondNote);
    expect(notesRepository.find).toBeCalledTimes(1);
    expect(notesRepository.find).toBeCalledWith({
      where: { archived: true },
    });
  });
  it('Should return that it created a note', async () => {
    notesRepository.create.mockResolvedValue(oneNote);
    notesRepository.save.mockResolvedValue(oneNote);
    expect(await noteService.create(noteBodyDto)).toEqual(oneNote);
    expect(notesRepository.create).toBeCalledTimes(1);
    expect(notesRepository.create).toBeCalledWith(noteBodyDto);
    expect(notesRepository.save).toBeCalledTimes(1);
    expect(notesRepository.save).toBeCalledWith(oneNote);
  });
  it('Should return that it updated a note', async () => {
    notesRepository.findOne.mockResolvedValue(oneNote);
    notesRepository.merge.mockReturnThis();
    notesRepository.save.mockResolvedValue(secondNote);
    expect(await noteService.update(oneNote.id, noteBodyDto)).toEqual(
      secondNote,
    );
    expect(notesRepository.findOne).toBeCalledTimes(1);
    expect(notesRepository.findOne).toBeCalledWith({
      where: { id: oneNote.id },
    });
    expect(notesRepository.merge).toBeCalledTimes(1);
    expect(notesRepository.merge).toBeCalledWith(oneNote, noteBodyDto);
    expect(notesRepository.save).toBeCalledTimes(1);
    expect(notesRepository.save).toBeCalledWith(oneNote);
  });
  it('Should return that it deleted a note', async () => {
    notesRepository.delete.mockResolvedValue('The note was deleted');
    expect(await noteService.delete(oneNote.id)).toEqual(
      'The note was deleted',
    );
    expect(notesRepository.delete).toBeCalledTimes(1);
    expect(notesRepository.delete).toBeCalledWith(oneNote.id);
  });
  it('Should return that it archived the note', async () => {
    notesRepository.findOne.mockResolvedValue(oneNote);
    notesRepository.save.mockResolvedValue(secondNote);
    expect(await noteService.archive(oneNote.id)).toEqual(secondNote);
    expect(notesRepository.findOne).toBeCalledTimes(1);
    expect(notesRepository.findOne).toBeCalledWith({
      where: { id: oneNote.id },
    });
    expect(notesRepository.save).toBeCalledTimes(1);
    expect(notesRepository.save).toBeCalledWith(secondNote);
  });
  it('Should return that it unarchived the note', async () => {
    oneNote.archived = false;
    notesRepository.findOne.mockResolvedValue(secondNote);
    notesRepository.save.mockResolvedValue(oneNote);
    expect(await noteService.unarchive(secondNote.id)).toEqual(oneNote);
    expect(notesRepository.findOne).toBeCalledTimes(1);
    expect(notesRepository.findOne).toBeCalledWith({
      where: { id: secondNote.id },
    });
    expect(notesRepository.save).toBeCalledTimes(1);
    expect(notesRepository.save).toBeCalledWith(oneNote);
  });
});
