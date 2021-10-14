const file_system = require('fs')
const archiver = require('archiver')

const output = file_system.createWriteStream('files.zip')
const archive = archiver('zip')
const { FILES, DIRECTORIES } = require('./files')

console.log('Zipping files for submission...')

output.on('close', () => {
  console.log(`Wrote ${archive.pointer()} total bytes`)
  console.log('Zip written and output stream closed successfully.')
})

archive.on('error', err => {
  console.log('There was an error:')
  throw err
})

// Write all files and directories specified above straight to the zip
archive.pipe(output)
FILES.forEach(file => archive.file(file))
DIRECTORIES.forEach(dir => archive.directory(dir))

archive.finalize()
