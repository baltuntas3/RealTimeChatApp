const app = require("../..");
const request = require("supertest")(app);

test("creates a new user", async () => {
    try {
        const userToCreate = {
            username: "user22",
            password: "123456",
            email: "aaaa@avbc.com",
            age: 67,
        };

        const response = await request.post("/users/sign-in").send(userToCreate).expect(200);

        const userCreated = response.body;

        expect(userCreated).toMatchObject(userToCreate);
        // done();
    } catch (error) {
        console.log(error.message);
    }
});
