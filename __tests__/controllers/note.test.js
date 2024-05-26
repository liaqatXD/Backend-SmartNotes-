const { createNote,getNotes,updateNote,deleteNote } = require('../../controllers/noteController');
const noteModal = require("../../models/note");

jest.mock("../../models/note");
jest.mock("../../encrypt");

const httpMocks = require("node-mocks-http");


// test creating notes

describe("createNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("should create a note successfully", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/notes",
      body: {
        title: "Test Title",
        content: "Test Content",
        notebook: "Test Notebook"
      }
    });
    const res = httpMocks.createResponse();

    const encryptedTitle = "Encrypted Title";
    const encryptedContent = "Encrypted Content";

    // Mocking the encryptNote function
    const { encryptNote } = require("../../encrypt");
    encryptNote.mockReturnValueOnce({
      encryptedTitle,
      encryptedContent
    });

    // Mocking the create method of noteModal
    noteModal.create.mockResolvedValueOnce({
      title: encryptedTitle,
      content: encryptedContent,
      notebook: "Test Notebook"
    });

    await createNote(req, res);

    expect(noteModal.create).toHaveBeenCalledWith({
      title: encryptedTitle,
      content: encryptedContent,
      notebook: "Test Notebook"
    });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({
      title: encryptedTitle,
      content: encryptedContent,
      notebook: "Test Notebook"
    });
  });

  test("should handle errors while creating note", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/notes",
      body: {
        title: "Test Title",
        content: "Test Content",
        notebook: "Test Notebook"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the encryptNote function
    const { encryptNote } = require("../../encrypt");
    encryptNote.mockImplementation(() => {
      throw new Error("Encryption error");
    });

    await createNote(req, res);

    expect(noteModal.create).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      "error while creating note": "Encryption error"
    });
  });
});

// testing getting notes


describe("getNotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch notes successfully", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/notes/123",
      params: {
        id: "123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the find method of noteModal
    const notes = [
      {
        title: "Encrypted Title 1",
        content: "Encrypted Content 1"
      },
      {
        title: "Encrypted Title 2",
        content: "Encrypted Content 2"
      }
    ];
    noteModal.find.mockResolvedValueOnce(notes);

    // Mocking the decryptNote function
    const { decryptNote } = require("../../encrypt");
    const decryptedNotes = [
      {
        title: "Decrypted Title 1",
        content: "Decrypted Content 1"
      },
      {
        title: "Decrypted Title 2",
        content: "Decrypted Content 2"
      }
    ];
    decryptNote.mockReturnValueOnce(decryptedNotes[0]).mockReturnValueOnce(decryptedNotes[1]);

    await getNotes(req, res);

    expect(noteModal.find).toHaveBeenCalledWith({ notebook: "123" });
    expect(decryptNote).toHaveBeenCalledWith("Encrypted Title 1", "Encrypted Content 1");
    expect(decryptNote).toHaveBeenCalledWith("Encrypted Title 2", "Encrypted Content 2");

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual(decryptedNotes);
  });

  test("should handle errors while fetching notes", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/notes/123",
      params: {
        id: "123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the find method of noteModal to throw an error
    noteModal.find.mockRejectedValueOnce(new Error("Database error"));

    await getNotes(req, res);

    expect(noteModal.find).toHaveBeenCalledWith({ notebook: "123" });
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      "error while fetching notes.": "Database error"
    });
  });

  test("should return empty array if no notes found", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/notes/123",
      params: {
        id: "123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the find method of noteModal to return an empty array
    noteModal.find.mockResolvedValueOnce([]);

    await getNotes(req, res);

    expect(noteModal.find).toHaveBeenCalledWith({ notebook: "123" });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });
});

// testing updating notes

describe("updateNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update a note successfully", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/notes/123",
      params: {
        id: "123"
      },
      body: {
        title: "Updated Title",
        content: "Updated Content"
      }
    });
    const res = httpMocks.createResponse();

    const encryptedTitle = "Encrypted Updated Title";
    const encryptedContent = "Encrypted Updated Content";

    // Mocking the encryptNote function
    const { encryptNote } = require("../../encrypt");
    encryptNote.mockReturnValueOnce({
      encryptedTitle,
      encryptedContent
    });

    // Mocking the updateOne method of noteModal
    noteModal.updateOne.mockResolvedValueOnce({ nModified: 1 });

    await updateNote(req, res);

    expect(encryptNote).toHaveBeenCalledWith("Updated Title", "Updated Content");
    expect(noteModal.updateOne).toHaveBeenCalledWith(
      { _id: "123" },
      {
        $set: {
          title: encryptedTitle,
          content: encryptedContent
        }
      }
    );

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({ "success": "note updated successfully!" });
  });

  test("should handle errors while updating note", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/notes/123",
      params: {
        id: "123"
      },
      body: {
        title: "Updated Title",
        content: "Updated Content"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the encryptNote function
    const { encryptNote } = require("../../encrypt");
    encryptNote.mockReturnValueOnce({
      encryptedTitle: "Encrypted Updated Title",
      encryptedContent: "Encrypted Updated Content"
    });

    // Mocking the updateOne method of noteModal to throw an error
    noteModal.updateOne.mockRejectedValueOnce(new Error("Database error"));

    await updateNote(req, res);

    expect(noteModal.updateOne).toHaveBeenCalledWith(
      { _id: "123" },
      {
        $set: {
          title: "Encrypted Updated Title",
          content: "Encrypted Updated Content"
        }
      }
    );
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error while updating note.": "Database error" });
  });
});

// testing deleting notes

describe("deleteNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a note successfully", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      url: "/notes/123",
      params: {
        id: "123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the deleteOne method of noteModal
    noteModal.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

    await deleteNote(req, res);

    expect(noteModal.deleteOne).toHaveBeenCalledWith({ _id: "123" });

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual({ "success": "note deleted successfully." });
  });

  test("should handle errors while deleting note", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      url: "/notes/123",
      params: {
        id: "123"
      }
    });
    const res = httpMocks.createResponse();

    // Mocking the deleteOne method of noteModal to throw an error
    noteModal.deleteOne.mockRejectedValueOnce(new Error("Database error"));

    await deleteNote(req, res);

    expect(noteModal.deleteOne).toHaveBeenCalledWith({ _id: "123" });
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ "error while deleting note.": "Database error" });
  });
});
