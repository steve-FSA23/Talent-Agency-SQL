const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_talent_agency"
);

//createTables - based on schema shown above

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS user_skills;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS skills;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255)
    );

    CREATE TABLE skills(
        id UUID PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE user_skills(
        id UUID PRIMARY KEY,
        skill_id UUID REFERENCES skills(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_id_skill_id UNIQUE (user_id, skill_id)
    );
    `;

    await client.query(SQL);
};

// createUser - creates a user given a username and password (we can use bcrypt to hash)
const createUser = async ({ username, password }) => {
    const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [
        uuid.v4(),
        username,
        await bcrypt.hash(password, 5),
    ]);
    return response.rows[0];
};

// createSkill - creates a skill given a name
const createSkill = async ({ name }) => {
    const SQL = `
    INSERT INTO skills(id,name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};
// createUserSkill - adds a user_skill
const createUserSkill = async ({ user_id, skill_id }) => {
    const SQL = `
    INSERT INTO user_skills(id, user_id, skill_id) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, skill_id]);
    return response.rows[0];
};

// fetchUsers - fetches all the users
const fetchUsers = async () => {
    const SQL = `
      SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

// fetchSkills - fetches all the skills

const fetchSkills = async () => {
    const SQL = `
      SELECT * FROM skills;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

// fetchUserSkills - takes an id for a user and returns their user_skills
const fetchUserSkills = async (user_id) => {
    const SQL = `
      SELECT * FROM user_skills
      WHERE user_id = $1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

// destroyUserSkill - removes a user_skill

const deleteUserSkill = async ({ id, user_id }) => {
    const SQL = `
      DELETE FROM user_skills
      WHERE id = $1 AND user_id = $2
    `;
    await client.query(SQL, [id, user_id]);
};

module.exports = {
    client,
    createTables,
    createUser,
    createSkill,
    createUserSkill,
    fetchUsers,
    fetchSkills,
    fetchUserSkills,
    deleteUserSkill,
};
