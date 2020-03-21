const db = require("./database/dbConfig");
const bcrypt = require("bcryptjs");

async function createUser(user) {
  user.password = await bcrypt.hash(user.password, 10);
  return db
    .insert(user)
    .into("users")
    .then(res => {
      const id = res[0];
      return db("username")
        .from("users")
        .where({ id });
    });
}

function findUser(user) {
  return db("*")
    .from("users")
    .where(user)
    .first();
}

module.exports = {
  createUser,
  findUser
};
