// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  const log = app.console.log;
  app.console.log = (...args) => {
    if (args.length === 1 && typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
      return;
    }
    log(...args);
  };
}

// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('include', '/courses');
  cy.get('[data-cy=user-menu]').should('be.visible');
}); 