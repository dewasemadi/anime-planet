describe('Anime List Page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('Database')
  })

  it('should show anime list', () => {
    // case 1: see 10 anime cards
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=anime-card]').should('have.length', 10)

    // case 2: pagination
    cy.get('[data-cy=anime-card-title]').first().contains('Cowboy')
    cy.get('[data-cy=next-button]').click()
    cy.get('[data-cy=anime-card-title]').first().contains('NARUTO')

    // case 3: click on anime card
    cy.get('[data-cy=anime-card').first().click()
    cy.url().should('include', '/anime/')
  })

  it('should be able bulk add to the collection', () => {
    cy.visit('http://localhost:3000/')

    cy.addMultipleAnime()
  })
})
