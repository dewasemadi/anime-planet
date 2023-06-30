describe('Collection Detail Page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('Database')

    cy.visit('http://localhost:3000/')
    cy.addMultipleAnime()

    cy.get('[data-cy=my-collection-button]').click()
    cy.url().should('include', '/collection')
    cy.wait(5000)
    cy.get('[data-cy=banner-image]').first().click()
  })

  it('should display collection detail, edit collection, and delete collection functionality', () => {
    // case 1: show anime card
    cy.get('[data-cy=banner-image]').should('be.visible')
    cy.get('[data-cy=anime-card-title]').should('be.visible')
    cy.get('[data-cy=banner-image]').first().click()
    cy.url().should('include', '/anime/20')

    // back
    cy.get('[data-cy=my-collection-button]').click()
    cy.url().should('include', '/collection')
    cy.get('[data-cy=banner-image]').first().click()

    // case 2: remove anime from collection
    cy.get('[data-cy=remove-from-collection-button]').first().click()
    cy.get('[data-cy=modal-title]').should('contain', 'Delete ')
    cy.get('[data-cy=yes-button]').click()
    cy.get('[data-cy=toast-text]').should('contain', 'Anime deleted')

    // case 3: edit collection name
    cy.get('[data-cy=edit-button]').first().click()
    cy.renameCollection('Rename Naruto')
    cy.get('[data-cy=toast-text]').should('contain', 'Collection renamed successfully')
  })
})
