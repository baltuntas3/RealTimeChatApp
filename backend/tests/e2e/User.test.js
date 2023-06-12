const app = require("../..");
const request = require("supertest")(app);
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("../../models/Users");

describe("users", () => {
    let { MONGO_CONNECTION } = process.env;

    beforeAll(() => {
        mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err, "hata");
                process.exit(1);
            }
        });
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    afterEach(async () => {
        await UserModel.remove({});
    });

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
});
