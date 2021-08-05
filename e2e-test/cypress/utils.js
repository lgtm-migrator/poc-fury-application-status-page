function redirectToScenario(req, scenario) {
    if (req.query?.mockedScenario) {
        req.continue();
        return;
    }

    req.redirect(`${req.url}?mockedScenario=${scenario}`, 301)
}

function removeChache(req) {
    req.on('before:response', (res) => {
        // force all API responses to not be cached
        res.headers['cache-control'] = 'no-store'
    })
}

export function interceptAndMockToScenario(scenario) {
    cy.intercept("/api/lastChecks", {middleware: true}, (req) => removeChache(req))
    cy.intercept("GET", "/api/lastChecks", (req) => redirectToScenario(req, scenario))
    cy.intercept("/api/lastFailedChecks", {middleware: true}, (req) => removeChache(req))
    cy.intercept("GET", "/api/lastFailedChecks", (req) => redirectToScenario(req, scenario))
    cy.intercept("/api/lastChecksAndIssues/*", {middleware: true}, (req) => removeChache(req))
    cy.intercept("GET", "/api/lastChecksAndIssues/*", (req) => redirectToScenario(req, scenario))
    cy.intercept("/api/lastFailedChecks/day/*", {middleware: true}, (req) => removeChache(req))
    cy.intercept("GET", "/api/lastFailedChecks/day/*", (req) => redirectToScenario(req, scenario))
}