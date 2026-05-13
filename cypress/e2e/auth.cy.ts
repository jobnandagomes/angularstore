describe('Authentication Flow', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    cy.clearLocalStorage();
    
    // Verifica se o servidor está respondendo antes de prosseguir
    cy.request({
      url: 'http://localhost:3000/health',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });

    cy.visit('/auth/login', {
      timeout: 90000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    });
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    cy.get('[data-cy=email-input]', { timeout: 10000 }).should('be.visible').type('admin@edugital.com.br');
    cy.get('[data-cy=password-input]', { timeout: 10000 }).should('be.visible').type('admin123');
    cy.get('[data-cy=login-button]', { timeout: 10000 }).should('be.visible').click();

    cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    cy.url().should('include', '/courses');
    cy.get('[data-cy=user-menu]', { timeout: 10000 }).should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    }).as('loginRequest');

    cy.get('[data-cy=email-input]', { timeout: 10000 }).should('be.visible').type('wrong@email.com');
    cy.get('[data-cy=password-input]', { timeout: 10000 }).should('be.visible').type('wrongpass');
    cy.get('[data-cy=login-button]', { timeout: 10000 }).should('be.visible').click();

    cy.wait('@loginRequest', { timeout: 10000 });
    cy.get('[data-cy=error-message]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Credenciais inválidas');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/courses', {
      timeout: 90000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    });
    cy.url().should('include', '/auth/login');
  });

  it('should logout successfully', () => {
    // Login first using custom command
    cy.login('admin@edugital.com.br', 'admin123');

    // Then test logout
    cy.get('[data-cy=user-menu]', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Sair').click();

    cy.url().should('include', '/auth/login');
    cy.get('[data-cy=user-menu]').should('not.exist');
  });
}); 