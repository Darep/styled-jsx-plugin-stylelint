const loopWhile = require('deasync').loopWhile
const stylelint = require('stylelint')
const postcss = require('postcss')
const reporter = require('postcss-reporter')

module.exports = function linter(css, options) {
  const processor = postcss()
  processor
    .use(stylelint(options))
    .use(reporter())

  let wait = true

  function resolved() {
    wait = false
  }

  function handleError(error) {
    wait = false
    console.error(error)
  }

  processor
    .process(css, { from: options.codeFilename })
    .then(resolved)
    .catch(handleError)

  loopWhile(() => wait)
}
