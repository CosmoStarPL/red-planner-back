const queries = {
    createPerson: "INSERT INTO person (name, surname, email, passwordHash) values ($1, $2, $3, $4) RETURNING *",
    getUser: "SELECT id, name, surname, email FROM person WHERE id = $1",
    updateUser: "UPDATE person SET name = $2, surname = $3, email = $4 WHERE id = $1 RETURNING * ",
    getUsers: "SELECT * FROM person",
    delUser: "DELETE FROM person WHERE id = $1",
    getEmail: "SELECT 1 FROM person WHERE email = $1",
    getPassword: "SELECT * FROM person WHERE email = $1",
    createDescription: "INSERT INTO description (data, person_id) VALUES ($1, $2) RETURNING *",
    checkDesc: "SELECT 1 FROM description WHERE person_id = $1",
    getDesc: "SELECT * FROM description WHERE person_id = $1",
}

module.exports = queries