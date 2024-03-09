const {
    client,
    createTables,
    createUser,
    createSkill,
    fetchUsers,
    fetchSkills,
    createUserSkill,
    fetchUserSkills,
    deleteUserSkill,
} = require("./db");

const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const init = async () => {
    try {
        await client.connect();
        console.log("Connected to database!");

        await createTables();
        console.log("Tables Created 📊!");

        const [moe, lucy, ethyl, singing, dancing, juggling, plateSpinning] =
            await Promise.all([
                createUser({ username: "moe", password: "s3cr3t" }),
                createUser({ username: "lucy", password: "s3cr3t!!" }),
                createUser({ username: "ethyl", password: "shhh" }),
                createSkill({ name: "singing" }),
                createSkill({ name: "dancing" }),
                createSkill({ name: "juggling" }),
                createSkill({ name: "plate spinning" }),
            ]);

        const users = await fetchUsers();
        console.log(users);

        const skills = await fetchSkills();
        console.log(skills);

        const userSkills = await Promise.all([
            createUserSkill({ user_id: moe.id, skill_id: plateSpinning.id }),
            createUserSkill({ user_id: moe.id, skill_id: juggling.id }),
            createUserSkill({ user_id: ethyl.id, skill_id: juggling.id }),
            createUserSkill({ user_id: lucy.id, skill_id: dancing.id }),
        ]);

        console.log(await fetchUserSkills(moe.id));

        await deleteUserSkill(userSkills[0].id);
        console.log(await fetchUserSkills(moe.id));
    } catch (error) {
        console.error(error);
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

init();
