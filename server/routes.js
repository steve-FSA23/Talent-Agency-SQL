const express = require("express");
const router = express.Router();

const {
    fetchUsers,
    fetchSkills,
    fetchUserSkills,
    createUserSkill,
    deleteUserSkill,
} = require("./db");

// GET - Returns an array of users
router.get("/users", async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.send(users);
    } catch (error) {
        next(error);
    }
});

// GET - Returns an array of skills
router.get("/skills", async (req, res, next) => {
    try {
        const skills = await fetchSkills();
        res.send(skills);
    } catch (error) {
        next(error);
    }
});

// GET - Return an array of user_skills for a user
router.get("/users/:id/userSkills", async (req, res, next) => {
    try {
        const userId = req.params.id;
        res.send(await fetchUserSkills(userId));
    } catch (error) {
        next(error);
    }
});

// POST-Create skill for a user
router.post("/users/:userId/userSkills/:id", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const skillId = req.params.id;

        const { user_id, skill_id } = req.body;

        const creatingUserSkills = await createUserSkill({
            userId,
            skillId,
            user_id,
            skill_id,
        });

        res.status(201).send(creatingUserSkills);
    } catch (error) {
        next(error);
    }
});

// Deletes a user skill

router.delete(
    "/users/:userId/userSkills/:userSkillId",
    async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const userSkillId = req.params.userSkillId;

            await deleteUserSkill({ id: userSkillId, user_id: userId });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
);

// Error handling route
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

module.exports = router;
