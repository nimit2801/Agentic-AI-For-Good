#!/usr/bin/env node
// Usage: node seed-tools-to-supabase.mjs
// Seeds tools from tool-catalog/*.yaml into Supabase

import { createClient } from '@supabase/supabase-js';
import { parse as parseYAML } from 'yaml';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Recursively find all YAML files in a directory
function findYamlFiles(dir, files = []) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findYamlFiles(fullPath, files);
    } else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Parse a YAML tool file and return the tool object
function parseToolFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const data = parseYAML(content);
  
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    long_description: data.long_description || null,
    url: data.url || data.website_url,
    logo_url: data.logo_url || null,
    category: data.category || null,
    tags: data.tags || [],
    pricing: data.pricing || null,
    is_open_source: data.is_open_source || false,
    featured: data.featured || false,
    approved: true, // Auto-approve for now
    submitted_by: data.meta?.added_by || null,
    // Extended fields
    tagline: data.tagline || null,
    github_url: data.github_url || null,
    website_url: data.website_url || null,
    docs_url: data.docs_url || null,
    license: data.license || null,
    stack_languages: data.stack?.languages || [],
    stack_frameworks: data.stack?.frameworks || [],
    install_command: data.integration?.install_command || null,
    code_snippet: data.integration?.code_snippet || null,
    integration_guide: data.integration?.guide || null,
    github_stars: data.github_stars || null,
    maintained: data.maintained !== false,
  };
}

async function seedTools() {
  const toolsDir = join(__dirname, 'tool-catalog', 'tools');
  const yamlFiles = findYamlFiles(toolsDir);
  
  console.log(`Found ${yamlFiles.length} tool definition files`);
  
  let success = 0;
  let failed = 0;
  
  for (const file of yamlFiles) {
    try {
      const tool = parseToolFile(file);
      
      // Check if tool already exists
      const { data: existing } = await supabase
        .from('tools')
        .select('id')
        .eq('slug', tool.slug)
        .single();
      
      if (existing) {
        // Update existing tool
        const { error } = await supabase
          .from('tools')
          .update(tool)
          .eq('slug', tool.slug);
        
        if (error) throw error;
        console.log(`✓ Updated: ${tool.name}`);
      } else {
        // Insert new tool
        const { error } = await supabase
          .from('tools')
          .insert(tool);
        
        if (error) throw error;
        console.log(`✓ Inserted: ${tool.name}`);
      }
      
      success++;
    } catch (err) {
      console.error(`✗ Failed ${file}: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\nDone! ${success} succeeded, ${failed} failed`);
  
  if (success > 0) {
    console.log('\nNext step: Generate embeddings by running:');
    console.log('  node seed-tools-with-embeddings.mjs');
  }
}

seedTools().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
