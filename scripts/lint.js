const { CLIEngine } = require('eslint')
const { FILES } = require('./files')

console.log('Running ESLint on files...')

const cli = new CLIEngine({
  useEslintrc: true,
})

const report = cli.executeOnFiles(FILES)
const formatter = cli.getFormatter()

console.log(formatter(report.results))
console.log('Finished running ESLint.')
