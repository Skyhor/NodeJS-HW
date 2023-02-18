const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "./db/contacts.json");
const { v4: id } = require("uuid");
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const normalizeData = JSON.parse(data);
    console.table(normalizeData);
    return normalizeData;
  } catch (err) {
    console.log(`Message:`, err);
  }
}

async function getContactById(contactId) {
  try {
    const normalizeData = JSON.parse(await fs.readFile(contactsPath, "utf8"));
    const contactFilter = normalizeData.filter(
      (contact) => contact.id === contactId
    );
    if (contactFilter.length === 0) {
      return console.log(`There is no contact with id: ${contactId}`);
    }
    return console.table(contactFilter);
  } catch (error) {
    return console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const normalizeData = JSON.parse(await fs.readFile(contactsPath, "utf8"));
    const newList = normalizeData.filter(({ id }) => id !== contactId);
    if (newList.length === 0) {
      return console.log(`Contact with id: ${contactId} not exist`);
    }
    await fs.writeFile(
      contactsPath,
      JSON.stringify(newList, null, "\t"),
      "utf8"
    );
    const contactsAfterRemove = await fs.readFile(contactsPath, "utf8");

    return console.table(JSON.parse(contactsAfterRemove));
  } catch (err) {
    console.log(err);
  }
}
async function addContact(name, email, phone) {
  try {
    const newContact = { id: id(), name, email, phone };
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(data);
    const nameToFind = parsedContacts.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    const emailToFind = parsedContacts.find(
      (contact) => contact.email.toLowerCase() === email.toLowerCase()
    );
    const phoneToFind = parsedContacts.find(
      (contact) => contact.phone === phone
    );

    if (nameToFind) {
      return console.log(`The contact named ${name} already exists`);
    }

    if (emailToFind) {
      return console.log(`The contact with email: ${email} already exists`);
    }

    if (phoneToFind) {
      return console.log(
        `The contact with phone number: ${phone} already exists`
      );
    }
    const newList = [...parsedContacts, newContact];
    await fs.writeFile(
      contactsPath,
      JSON.stringify(newList, null, "\t"),
      "utf8"
    );

    return console.table(newList);
  } catch (error) {
    return console.error(error);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
