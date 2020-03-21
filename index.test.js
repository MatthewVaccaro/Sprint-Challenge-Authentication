const server = require("./api/server");
const supertest = require("supertest");
const db = require("./database/dbConfig");

// make sure everything is working correctly
test("sanity", () => {
  expect(2 + 2).toBe(4);
});

// Register
test("Register User", async () => {
  const res = await supertest(server)
    .post("/api/auth/register")
    .send({
      username: "Micky",
      password: "stuff"
    });
  expect(res.statusCode).toBe(201);
  expect(res.type).toBe("application/json");
  expect(res.body[0].username).toBe("Micky");
});

test("Failure to Register", async () => {
  const res = await supertest(server)
    .post("/api/auth/register")
    .send({});
  expect(res.statusCode).toBe(400);
  expect(res.type).toBe("application/json");
});

//Login End point

test("login User", async () => {
  const res = await supertest(server)
    .post("/api/auth/login")
    .send({
      username: "matt",
      password: "code"
    });
  console.log("this is res.body", res.body);
  expect(res.statusCode).toBe(200);
  expect(res.type).toBe("application/json");
  expect(res.body.message).toBe(`welcome matt`);
  expect(res.body.token.length).toBeGreaterThan(1);
});

test("Password incorrect", async () => {
  const res = await supertest(server)
    .post("/api/auth/login")
    .send({
      username: "matt",
      password: "wrong"
    });
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe(`error, bad request 3`);
});

// Jokes End Point
test("Restriction failure", async () => {
  const res = await supertest(server).get("/api/jokes");
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe("error, bad request 1");
});

test("get all jokes", async () => {
  const res = await supertest(server)
    .post("/api/auth/login")
    .send({
      username: "matt",
      password: "code"
    });
  if (!res) {
    return console.log("didnt get anything");
  }
  const resAgain = await supertest(server)
    .get("/api/jokes")
    .set({ authorization: res.body.token });

  expect(res.statusCode).toBe(200);
  expect(res.type).toBe("application/json");
  expect(resAgain.body.length).toBeGreaterThan(1);
});
