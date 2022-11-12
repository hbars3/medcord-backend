import { Test } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NoteBodyDto } from '../dto/noteBodyDto.dto';
import { NoteQueryDto } from '../dto/noteQueryDto.dto';
import * as mocks from 'node-mocks-http';
import { NotesService } from '../services/notes.service';
import { Query } from 'typeorm/driver/Query';

describe('Notes Controller', () => {
  let notesController: NotesController;
  let notesService: NotesService;
  const mockNotesService = {
    findActive: jest.fn(),
    findArchived: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
  };
  const res = mocks.createResponse();
  const noteBodyDto = new NoteBodyDto();
  const noteQueryDto = new NoteQueryDto();
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService],
    })
      .overrideProvider(NotesService)
      .useValue(mockNotesService)
      .compile();
    notesController = moduleRef.get<NotesController>(NotesController);
    notesService = moduleRef.get<NotesService>(NotesService);
  });

  it('Should return that it got all active notes', async () => {
    const response = await notesController.getActive(res);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.findActive).toBeCalledTimes(1);
  });
  it('Should return that it did not get all active notes', async () => {
    jest.spyOn(notesService, 'findActive').mockRejectedValue(new Error());
    const response = await notesController.getActive(res);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.findActive).toBeCalledTimes(2);
  });
  it('Should return that it got all archived notes', async () => {
    const response = await notesController.getArchived(res);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.findArchived).toBeCalledTimes(1);
  });
  it('Should return that it did not get all notes', async () => {
    jest.spyOn(notesService, 'findArchived').mockRejectedValue(new Error());
    const response = await notesController.getArchived(res);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.findArchived).toBeCalledTimes(2);
  });
  it('Should return that it created a note', async () => {
    const response = await notesController.create(res, noteBodyDto);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.create).toBeCalledTimes(1);
    expect(mockNotesService.create).toBeCalledWith(noteBodyDto);
  });
  it('Should return that it did not create a note', async () => {
    jest.spyOn(notesService, 'create').mockRejectedValue(new Error());
    const response = await notesController.create(res, noteBodyDto);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.create).toBeCalledTimes(2);
    expect(mockNotesService.create).toBeCalledWith(noteBodyDto);
  });
  it('Should return that it updated a note', async () => {
    const response = await notesController.update(
      res,
      noteQueryDto,
      noteBodyDto,
    );
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.update).toBeCalledTimes(1);
    expect(mockNotesService.update).toBeCalledWith(
      noteQueryDto.id,
      noteBodyDto,
    );
  });
  it('Should return that it did not update a note', async () => {
    jest.spyOn(notesService, 'update').mockRejectedValue(new Error());
    const response = await notesController.update(
      res,
      noteQueryDto,
      noteBodyDto,
    );
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.update).toBeCalledTimes(2);
    expect(mockNotesService.update).toBeCalledWith(
      noteQueryDto.id,
      noteBodyDto,
    );
  });
  it('Should return that it deleted a note', async () => {
    const response = await notesController.delete(res, noteQueryDto);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.delete).toBeCalledTimes(1);
    expect(mockNotesService.delete).toBeCalledWith(noteQueryDto.id);
  });
  it('Should return that it did not delete a note', async () => {
    jest.spyOn(notesService, 'delete').mockRejectedValue(new Error());
    const response = await notesController.delete(res, noteQueryDto);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.delete).toBeCalledTimes(2);
    expect(mockNotesService.delete).toBeCalledWith(noteQueryDto.id);
  });
  it('Should return that it archived the note', async () => {
    const response = await notesController.archive(res, noteQueryDto);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.archive).toBeCalledTimes(1);
    expect(mockNotesService.archive).toBeCalledWith(noteQueryDto.id);
  });
  it('Should return that it did not archive a note', async () => {
    jest.spyOn(notesService, 'archive').mockRejectedValue(new Error());
    const response = await notesController.archive(res, noteQueryDto);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.archive).toBeCalledTimes(2);
    expect(mockNotesService.archive).toBeCalledWith(noteQueryDto.id);
  });
  it('Should return that it unarchived the note', async () => {
    const response = await notesController.unarchive(res, noteQueryDto);
    expect(response.statusCode).toEqual(200);
    expect(mockNotesService.unarchive).toBeCalledTimes(1);
    expect(mockNotesService.unarchive).toBeCalledWith(noteQueryDto.id);
  });
  it('Should return that it did not unarchive a note', async () => {
    jest.spyOn(notesService, 'unarchive').mockRejectedValue(new Error());
    const response = await notesController.unarchive(res, noteQueryDto);
    expect(response.statusCode).toEqual(500);
    expect(mockNotesService.unarchive).toBeCalledTimes(2);
    expect(mockNotesService.unarchive).toBeCalledWith(noteQueryDto.id);
  });
});
