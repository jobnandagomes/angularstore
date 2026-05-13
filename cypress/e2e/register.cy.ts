describe('Registration Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    
    // Verifica se o servidor está respondendo
    cy.request({
      url: 'http://localhost:3000/health',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(200);
    });

    cy.visit('/auth/register', {
      timeout: 90000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    });
  });

  it('should successfully register a new user', () => {
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
    
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');

    cy.get('[data-cy=name-input]').type('Test User');
    cy.get('[data-cy=email-input]').type(randomEmail);
    cy.get('[data-cy=password-input]').type('test123');
    cy.get('[data-cy=confirm-password-input]').type('test123');
    cy.get('[data-cy=register-button]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.equal(201);
      expect(interception.response?.body).to.have.property('token');
      expect(interception.response?.body.user).to.have.property('email', randomEmail);
    });

    cy.url().should('include', '/courses');
    cy.get('[data-cy=user-menu]').should('be.visible');
  });

  it('should show error for existing email', () => {
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 400,
      body: { message: 'Usuário já existe' }
    }).as('registerRequest');

    cy.get('[data-cy=name-input]').type('Existing User');
    cy.get('[data-cy=email-input]').type('admin@edugital.com.br');
    cy.get('[data-cy=password-input]').type('test123');
    cy.get('[data-cy=confirm-password-input]').type('test123');
    cy.get('[data-cy=register-button]').click();

    cy.wait('@registerRequest');
    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .and('contain', 'Usuário já existe');
  });

  it('should validate password match', () => {
    cy.get('[data-cy=name-input]').type('Test User');
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('test123');
    cy.get('[data-cy=confirm-password-input]').type('test456');
    
    cy.get('[data-cy=register-button]').should('be.disabled');
    cy.get('[data-cy=password-match-error]')
      .should('be.visible')
      .and('contain', 'As senhas não conferem');
  });

  it('should validate form fields', () => {
    cy.get('[data-cy=register-button]').click();

    cy.get('[data-cy=name-error]')
      .should('be.visible')
      .and('contain', 'Nome é obrigatório');

    cy.get('[data-cy=email-error]')
      .should('be.visible')
      .and('contain', 'Email é obrigatório');

    cy.get('[data-cy=password-error]')
      .should('be.visible')
      .and('contain', 'Senha é obrigatória');
  });
}); 