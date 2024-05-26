// notebookController.test.js
const { createNotebook,getNotebooks,updateNotebook, deleteNotebook} = require('../../controllers/notebookController');
const { encryptNotebook,decryptNotebook } = require('../../encrypt');
const notebookModal = require('../../models/notebook');
const noteModal = require('../../models/notebook');

jest.mock('../../encrypt');
jest.mock('../../models/notebook');


const httpMocks = require('node-mocks-http');

describe('createNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /****  Create Notebook tests  *******/

  //test 1
  test('should create a notebook successfully', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/notebooks',
      body: {
        title: 'Test Title',
        description: 'Test Description',
        author: 'Test Author'
      }
    });
    const res = httpMocks.createResponse();

    encryptNotebook.mockReturnValue({
      encryptedTitle: 'encryptedTitle',
      encryptedDescription: 'encryptedDescription'
    });
    notebookModal.create.mockResolvedValue({});

    await createNotebook(req, res);

    expect(encryptNotebook).toHaveBeenCalledWith('Test Title', 'Test Description');
    expect(notebookModal.create).toHaveBeenCalledWith({
      title: 'encryptedTitle',
      description: 'encryptedDescription',
      author: 'Test Author'
    });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({ success: 'notebook created successfully.' });
  });

  //test 2
  test('should handle errors during notebook creation', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/notebooks',
      body: {
        title: 'Test Title',
        description: 'Test Description',
        author: 'Test Author'
      }
    });
    const res = httpMocks.createResponse();

    encryptNotebook.mockImplementation(() => {
      throw new Error('Encryption error');
    });

    await createNotebook(req, res);

    expect(encryptNotebook).toHaveBeenCalledWith('Test Title', 'Test Description');
    expect(notebookModal.create).not.toHaveBeenCalled();

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(responseData).toEqual({ 'error while creating notebook': 'Encryption error' });
  });
});

  /****  Getting Notebook tests  *******/


describe('getNotebooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch and decrypt notebooks successfully', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notebooks/123',
      params: {
        id: '123'
      }
    });
    const res = httpMocks.createResponse();

    const mockNotebooks = [
      { title: 'encryptedTitle1', description: 'encryptedDescription1', author: '123' },
      { title: 'encryptedTitle2', description: 'encryptedDescription2', author: '123' }
    ];

    notebookModal.find.mockResolvedValue(mockNotebooks);

    decryptNotebook.mockImplementation((title, description) => ({
      title: `decrypted ${title}`,
      description: `decrypted ${description}`
    }));

    await getNotebooks(req, res);

    expect(notebookModal.find).toHaveBeenCalledWith({ author: '123' });
    expect(decryptNotebook).toHaveBeenCalledTimes(2);

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual([
      { title: 'decrypted encryptedTitle1', description: 'decrypted encryptedDescription1', author: '123' },
      { title: 'decrypted encryptedTitle2', description: 'decrypted encryptedDescription2', author: '123' }
    ]);
  });

  test('should return an empty array when no notebooks are found', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notebooks/123',
      params: {
        id: '123'
      }
    });
    const res = httpMocks.createResponse();

    notebookModal.find.mockResolvedValue([]);

    await getNotebooks(req, res);

    expect(notebookModal.find).toHaveBeenCalledWith({ author: '123' });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual([]);
  });

  test('should handle errors during fetching notebooks', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/notebooks/123',
      params: {
        id: '123'
      }
    });
    const res = httpMocks.createResponse();

    notebookModal.find.mockRejectedValue(new Error('Database error'));

    await getNotebooks(req, res);

    expect(notebookModal.find).toHaveBeenCalledWith({ author: '123' });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(responseData).toEqual({ "error while fetching notebooks": 'Database error' });
  });
});

  /****  Updating Notebook tests  *******/

describe('updateNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a notebook successfully', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: '/notebooks/123',
      params: {
        id: '123'
      },
      body: {
        title: 'Updated Title',
        description: 'Updated Description'
      }
    });
    const res = httpMocks.createResponse();

    const encryptedData = {
      encryptedTitle: 'encryptedUpdatedTitle',
      encryptedDescription: 'encryptedUpdatedDescription'
    };

    encryptNotebook.mockReturnValue(encryptedData);
    notebookModal.updateOne.mockResolvedValue({ nModified: 1 });

    await updateNotebook(req, res);

    expect(encryptNotebook).toHaveBeenCalledWith('Updated Title', 'Updated Description');
    expect(notebookModal.updateOne).toHaveBeenCalledWith(
      { _id: '123' },
      { $set: { title: encryptedData.encryptedTitle, description: encryptedData.encryptedDescription } }
    );

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({ success: 'notebook updated successfully.' });
  });

  test('should handle errors during notebook update', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      url: '/notebooks/123',
      params: {
        id: '123'
      },
      body: {
        title: 'Updated Title',
        description: 'Updated Description'
      }
    });
    const res = httpMocks.createResponse();

    const encryptedData = {
      encryptedTitle: 'encryptedUpdatedTitle',
      encryptedDescription: 'encryptedUpdatedDescription'
    };

    encryptNotebook.mockReturnValue(encryptedData);
    notebookModal.updateOne.mockRejectedValue(new Error('Database error'));

    await updateNotebook(req, res);

    expect(encryptNotebook).toHaveBeenCalledWith('Updated Title', 'Updated Description');
    expect(notebookModal.updateOne).toHaveBeenCalledWith(
      { _id: '123' },
      { $set: { title: encryptedData.encryptedTitle, description: encryptedData.encryptedDescription } }
    );

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(responseData).toEqual({ "error while updating the notebook": 'Database error' });
  });
});

  /****  Deleting Notebook tests  *******/


describe('deleteNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle errors during notebook deletion', async () => {
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: '/notebooks/123',
      params: {
        id: '123'
      }
    });
    const res = httpMocks.createResponse();

    notebookModal.deleteOne.mockRejectedValue(new Error('Database error'));

    await deleteNotebook(req, res);

    expect(notebookModal.deleteOne).toHaveBeenCalledWith({ _id: '123' });
    expect(noteModal.deleteMany).not.toHaveBeenCalled();

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(responseData).toEqual({ "error while deleting the notebook": 'Database error' });
  });
});
