describe('Anime Detail Page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('Database')
  })

  it('should display the anime detail and add to collection functionality', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=anime-card]').first().click()

    // case 1: show anime detail info
    cy.get('[data-cy=anime-detail-cover-image]').should('be.visible')
    cy.get('[data-cy=anime-detail-title]').should('be.visible')
    cy.get('[data-cy=anime-detail-genre]').should('be.visible')

    // case 2: add to the collection
    cy.get('[data-cy=add-to-collection-icon]').click()
    cy.get('[data-cy=create-collection-button').click()
    cy.createCollection('Naruto Collection')

    // case 3: collection name is unique
    cy.createCollection('Naruto Collection')
    cy.get('[data-cy=toast-text]').should('contain', 'Collection name already exist')

    // case 4: add anime to multiple collection
    cy.createCollection('Collection 1')
    cy.createCollection('Collection 2')
    cy.get('[data-cy=collection-item-card]').should('have.length', 3)
    cy.get('[data-cy=collection-item-card]').first().click()
    cy.get('[data-cy=collection-item-card]').eq(1).click()
    cy.get('[data-cy=save-anime-to-collection-button]').click()
    cy.get('[data-cy=toast-text]').should('contain', 'Success add anime to collection')

    // case 5: see collection info
    cy.get('[data-cy=add-to-collection-icon]').click()
    cy.get('[data-cy="modal-title"]').should('contain', 'Anime Available in This Collection')
    cy.get('[data-cy=collection-item-card]').should('have.length', 2)

    // case 6: click collection card
    cy.get('[data-cy=detail-button]').first().click()
    cy.url().should('include', '/collection/')
  })
})
