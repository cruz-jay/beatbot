describe("General App Display", () => {
  it("title element renders title", () => {
    cy.visit("/");
    cy.get("h1").first().should("contain", "Beat");
  });
});
