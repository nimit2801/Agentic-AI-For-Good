#!/usr/bin/env node
/**
 * Validate tool YAML files against schema
 * Usage: npx ts-node scripts/validate.ts [file-or-directory]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import Ajv from 'ajv'

// Load schema
const schemaPath = path.join(__dirname, '../schema/tool-schema.json')
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

interface ValidationError {
  file: string
  error: string
}

function validateFile(filePath: string): ValidationError | null {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath)

  if (ext !== '.yaml' && ext !== '.yml') {
    return null
  }

  try {
    const data = yaml.load(content)
    const valid = validate(data)

    if (!valid) {
      return {
        file: filePath,
        error: ajv.errorsText(validate.errors, { dataVar: 'tool' }),
      }
    }
  } catch (e) {
    return {
      file: filePath,
      error: `YAML parse error: ${e instanceof Error ? e.message : String(e)}`,
    }
  }

  return null
}

function validateDirectory(dirPath: string): ValidationError[] {
  const errors: ValidationError[] = []
  const entries = fs.readdirSync(dirPath)

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      errors.push(...validateDirectory(fullPath))
    } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
      const error = validateFile(fullPath)
      if (error) errors.push(error)
    }
  }

  return errors
}

// Main
const target = process.argv[2] || path.join(__dirname, '../tools')
const targetPath = path.resolve(target)

console.log(`Validating: ${targetPath}`)

let errors: ValidationError[] = []
const stat = fs.statSync(targetPath)

if (stat.isDirectory()) {
  errors = validateDirectory(targetPath)
} else {
  const error = validateFile(targetPath)
  if (error) errors.push(error)
}

if (errors.length === 0) {
  console.log('\u2713 All files valid')
  process.exit(0)
} else {
  console.error(`\u2717 ${errors.length} validation error(s):`)
  for (const err of errors) {
    console.error(`  - ${path.relative(process.cwd(), err.file)}: ${err.error}`)
  }
  process.exit(1)
}
