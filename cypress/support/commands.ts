/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable<Subject> {
    createCollection(collectionName: string): Chainable<void>
    renameCollection(collectionName: string): Chainable<void>
    addMultipleAnime(): Chainable<void>
  }
}

Cypress.Commands.add('createCollection', (collectionName: string) => {
  cy.get('[data-cy=collection-name-text-field').should('be.visible')
  cy.get('[data-cy=collection-name-text-field').type(collectionName)
  cy.get('[data-cy=save-collection-button').click()
})

Cypress.Commands.add('renameCollection', (collectionName: string) => {
  cy.get('[data-cy=collection-name-text-field').should('be.visible')
  cy.get('[data-cy=collection-name-text-field').clear().type(collectionName)
  cy.get('[data-cy=save-collection-button').click()
})

Cypress.Commands.add('addMultipleAnime', () => {
  cy.get('[data-cy=floating-button]').click()
  cy.get('[data-cy=modal-title').should('contain', 'Search and Select Anime')

  // case 1: add multiple anime to collection
  cy.get('[data-cy=search-anime-text-field]').type('naruto')
  cy.get('[data-cy=anime-item]').should('have.length.at.least', 2)
  cy.get('[data-cy=anime-item]').first().click()
  cy.get('[data-cy=anime-item]').eq(1).click()
  cy.get('[data-cy=selected-anime-text]').should('contain', '2 anime selected')
  cy.get('[data-cy=modal-button-next]').click()
  cy.get('[data-cy=modal-title').should('contain', 'Add to Collection')

  // case 2: collection name is unique
  cy.get('[data-cy=create-collection-button').click()
  cy.createCollection('Naruto Collection')
  cy.createCollection('Naruto Collection')
  cy.get('[data-cy=toast-text]').should('contain', 'Collection name already exist')

  // case 3: continue save anime to collection
  cy.get('[data-cy=collection-item-card]').should('have.length', 1)
  cy.get('[data-cy=collection-item-card]').first().click()
  cy.get('[data-cy=save-anime-to-collection-button]').click()
  cy.get('[data-cy=toast-text]').should('contain', 'Success add anime to collection')
})
