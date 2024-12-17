import users from "../../../dummy_data/usuarios.json";

const getUsers = (page, rowsPerPage, filter) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const response = {
        rows:users,
        nRows: 100,
        nPages: 10,
        currentPage: 1,
      }
      resolve(response);
      // reject(new Error("Error fetching users"));
    }, 1000);
  });
};

export default getUsers;
