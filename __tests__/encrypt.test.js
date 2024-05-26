const { encryptNotebook, decryptNotebook } = require('../encrypt'); 
require("dotenv/config");
const encryptly = require('encryptly');

jest.mock('encryptly');

describe('encryptNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should encrypt notebook title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    const encryptedTitle = 'Encrypted Title';
    const encryptedDescription = 'Encrypted Description';
    encryptly.encrypt.mockReturnValueOnce(encryptedTitle);
    encryptly.encrypt.mockReturnValueOnce(encryptedDescription);

    const result = encryptNotebook(title, description);

    expect(encryptly.encrypt).toHaveBeenCalledWith(title, process.env.SECRET_KEY);
    expect(encryptly.encrypt).toHaveBeenCalledWith(description, process.env.SECRET_KEY);
    expect(result).toEqual({
      encryptedTitle,
      encryptedDescription
    });
  });
});

describe('decryptNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should decrypt encrypted notebook title and description', () => {
    const encryptedTitle = 'Encrypted Title';
    const encryptedDescription = 'Encrypted Description';
    const decryptedTitle = 'Decrypted Title';
    const decryptedDescription = 'Decrypted Description';
    encryptly.decrypt.mockReturnValueOnce(decryptedTitle);
    encryptly.decrypt.mockReturnValueOnce(decryptedDescription);

    const result = decryptNotebook(encryptedTitle, encryptedDescription);

    expect(encryptly.decrypt).toHaveBeenCalledWith(encryptedTitle, process.env.SECRET_KEY);
    expect(encryptly.decrypt).toHaveBeenCalledWith(encryptedDescription, process.env.SECRET_KEY);
    expect(result).toEqual({
      title: decryptedTitle,
      description: decryptedDescription
    });
  });
});
