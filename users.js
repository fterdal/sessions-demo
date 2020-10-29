const usersTable = [];

const findUserById = (id) =>
  usersTable.find((user) => user.id === id);

const createOrCreateUser = (userData) => {
  const user = findUserById(userData.id);
  if (user) return user;
  usersTable.push(userData);
  return userData;
};

module.exports = {
  findUserById,
  createOrCreateUser,
};
