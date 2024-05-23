require("dotenv/config");
const encryptly = require('encryptly');
const ENCRYPTION_KEY = process.env.SECRET_KEY;

module.exports={
    //encrypting notebook
    encryptNotebook:(title,description)=>{
    const encryptedTitle= title && encryptly.encrypt(title, ENCRYPTION_KEY);
    const encryptedDescription= description && encryptly.encrypt(description, ENCRYPTION_KEY);
    return {
        encryptedTitle,
      encryptedDescription
    }
    
    },
    //decrypting notebook 
    decryptNotebook:(encryptedTitle,encryptedDescription)=>{
    const title= encryptly.decrypt(encryptedTitle, ENCRYPTION_KEY);
    const description= encryptly.decrypt(encryptedDescription, ENCRYPTION_KEY);
    return {
        title,
        description
    }
    }
,
    //encrypting note
    encryptNote:(title,content)=>{
        const encryptedTitle= title && encryptly.encrypt(title, ENCRYPTION_KEY);
        const encryptedContent= content && encryptly.encrypt(content, ENCRYPTION_KEY);
        return {
            encryptedTitle,
            encryptedContent
        }
        
        },
        //decrypting note
        decryptNote:(encryptedTitle,encryptedContent)=>{
        const title= encryptly.decrypt(encryptedTitle, ENCRYPTION_KEY);
        const content= encryptly.decrypt(encryptedContent, ENCRYPTION_KEY);
        return {
            title,
            content
        }
        }


}
