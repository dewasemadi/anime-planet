describe('Collection List Page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('Database')
  })

  it('should display the collection list page', () => {
    cy.visit('http://localhost:3000/collection')
    cy.get('p').should('contain', 'My Collection')

    // case 1: create collection
    cy.get('[data-cy=create-collection-button]').click()
    cy.createCollection('Naruto Collection')

    cy.get('[data-cy=create-collection-button]').click()
    cy.createCollection('One Piece Collection')
    cy.get('[data-cy=toast-text]').should('contain', 'Collection created successfully')

    // case 2: should show anime cover image
    cy.get('[data-cy=banner-image').should('be.visible')
    cy.get('[data-cy=banner-image').first().click()
    cy.url().should('include', '/collection/1')
    cy.get('[data-cy=back-button]').click()

    // case 3: remove collection
    cy.get('[data-cy=menu-button').first().click()
    cy.get('[data-cy=rename-button').click()
    cy.get('[data-cy=modal-title').should('contain', 'Rename Collection')
    cy.renameCollection('Rename Naruto')

    // case 4: edit collection
    cy.get('[data-cy=menu-button').first().click()
    cy.get('[data-cy=delete-button').click()
    cy.get('[data-cy=modal-title]').should('contain', 'Delete')
    cy.get('[data-cy=yes-button').click()
    cy.get('[data-cy=toast-text]').should('contain', 'Collection has been deleted')
  })
})
