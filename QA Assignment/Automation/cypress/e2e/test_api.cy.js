describe("User Management API Tests", () => {
  const apiUrl = "http://localhost:8000";
  let testUser = {
    username: "qa_user",
    email: "qa_user@example.com",
    password: "StrongPass123",
    age: 25,
  };
  let token = null;
  let userId = null;

  it("GET / should return API info", () => {
    cy.request(`${apiUrl}/`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "User Management API");
    });
  });

  it("POST /users - create a new user", () => {
    cy.request("POST", `${apiUrl}/users`, testUser).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("username", testUser.username.toLowerCase());
      userId = response.body.id;
    });
  });

  it("POST /users - duplicate username should fail", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/users`,
      failOnStatusCode: false,
      body: testUser,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.detail).to.include("Username already exists");
    });
  });

  it("POST /login - should authenticate and return token", () => {
    cy.request("POST", `${apiUrl}/login`, {
      username: testUser.username,
      password: testUser.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
      token = response.body.token;
    });
  });

  it("PUT /users/{id} - update email with token", () => {
    cy.request({
      method: "PUT",
      url: `${apiUrl}/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      body: { email: "new_email@example.com" },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq("new_email@example.com");
    });
  });

  it("DELETE /users/{id} - delete user with Basic Auth", () => {
    cy.request({
      method: "DELETE",
      url: `${apiUrl}/users/${userId}`,
      auth: {
        user: testUser.username,
        pass: testUser.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "User deleted successfully");
    });
  });

  it("GET /users - list users (pagination)", () => {
    cy.request(`${apiUrl}/users?limit=5&offset=0`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("GET /users/search?q=username - should return results", () => {
    cy.request(`${apiUrl}/users/search?q=qa`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
    });
  });

  it("GET /stats - should return system stats", () => {
    cy.request(`${apiUrl}/stats`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("total_users");
    });
  });

  it("GET /health - should return healthy status", () => {
    cy.request(`${apiUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "healthy");
    });
  });

  it("Rate limit check (optional)", () => {
    let requests = [];
    for (let i = 0; i < 105; i++) {
      requests.push(
        cy.request({
          method: "POST",
          url: `${apiUrl}/users`,
          failOnStatusCode: false,
          body: {
            username: `spam${i}`,
            email: `spam${i}@example.com`,
            password: "Pass1234",
            age: 22,
          },
        })
      );
    }
    cy.wrap(Promise.all(requests)).then((responses) => {
      const tooMany = responses.some((r) => r.status === 429);
      expect(tooMany).to.be.true;
    });
  });
});
