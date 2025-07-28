/**
 * Bulk apply text truncation to all table files
 * This script can be used to apply text truncation utilities to multiple files at once
 */

const fs = require('fs');
const path = require('path');

// List of all table files that need updating
const tableFiles = [
  // Admin files
  'public/management/admin/views/pages/users/History.tsx',
  'public/management/admin/views/pages/user_roles/All.tsx',
  'public/management/admin/views/pages/user_roles/History.tsx',
  'public/management/admin/views/pages/user-login-histories/All.tsx',
  'public/management/admin/views/pages/user-login-histories/History.tsx',
  'public/management/admin/views/pages/admins/History.tsx',
  'public/management/admin/views/pages/academic_year/All.tsx',
  'public/management/admin/views/pages/academic_year/History.tsx',
  'public/management/admin/views/pages/academic_calendar_event_types/All.tsx',
  'public/management/admin/views/pages/academic_calendar_event_types/History.tsx',
  'public/management/admin/views/pages/contact_management/All.tsx',
  'public/management/admin/views/pages/academic_batch_id_rules/All.tsx',
  'public/management/admin/views/pages/academic_batch_id_rules/History.tsx',
  
  // Super admin files
  'public/management/super_admin/views/pages/user_roles/All.tsx',
  'public/management/super_admin/views/pages/user_roles/History.tsx',
  'public/management/super_admin/views/pages/users/All.tsx',
  'public/management/super_admin/views/pages/users/History.tsx',
  'public/management/super_admin/views/pages/user-login-histories/All.tsx',
  'public/management/super_admin/views/pages/user-login-histories/History.tsx',
  'public/management/super_admin/views/pages/contact_management/All.tsx',
  'public/management/super_admin/views/pages/admins/All.tsx',
  'public/management/super_admin/views/pages/admins/History.tsx'
];

// Import statements to add
const adminImports = `import { truncateText, formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';`;

const superAdminImports = `import { truncateText, formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';`;

// Function to add imports to a file
function addImportsToFile(filePath, content) {
  const isSuperAdmin = filePath.includes('super_admin');
  const imports = isSuperAdmin ? superAdminImports : adminImports;
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, imports);
    return lines.join('\n');
  }
  
  return content;
}

// Function to apply truncation to table cells
function applyTruncationToCells(content) {
  // Replace common patterns
  let updatedContent = content;
  
  // Replace ID cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.id\}<\/td>/g,
    '<td className="id-cell">{i.id}</td>'
  );
  
  // Replace UID cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.uid \|\| ''\}<\/td>/g,
    '<td className="id-cell">{i.uid || \'\'}</td>'
  );
  
  // Replace status cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.status\}<\/td>/g,
    '<td className="status-cell">{i.status}</td>'
  );
  
  // Replace simple name cells (without quick_view)
  updatedContent = updatedContent.replace(
    /<td>\{i\.name\}<\/td>/g,
    `<td 
        {...getTruncatedCellProps({
            text: i.name,
            maxLength: 40,
            columnType: 'name'
        })}
    />`
  );
  
  // Replace email cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.email\}<\/td>/g,
    `<td 
        {...getTruncatedCellProps({
            text: i.email,
            maxLength: 40,
            columnType: 'email'
        })}
    />`
  );
  
  // Replace description cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.description\}<\/td>/g,
    `<td 
        {...getTruncatedCellProps({
            text: i.description,
            maxLength: 100,
            columnType: 'description'
        })}
    />`
  );
  
  // Replace title cells
  updatedContent = updatedContent.replace(
    /<td>\{i\.title\}<\/td>/g,
    `<td 
        {...getTruncatedCellProps({
            text: i.title,
            maxLength: 50,
            columnType: 'title'
        })}
    />`
  );
  
  return updatedContent;
}

// Function to process a single file
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already processed
    if (content.includes('textUtils')) {
      console.log(`Already processed: ${filePath}`);
      return false;
    }
    
    // Add imports
    content = addImportsToFile(filePath, content);
    
    // Apply truncation to cells
    content = applyTruncationToCells(content);
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('Starting bulk text truncation application...');
  
  let processedCount = 0;
  let skippedCount = 0;
  
  tableFiles.forEach(filePath => {
    if (processFile(filePath)) {
      processedCount++;
    } else {
      skippedCount++;
    }
  });
  
  console.log(`\nCompleted!`);
  console.log(`Processed: ${processedCount} files`);
  console.log(`Skipped: ${skippedCount} files`);
}

// Export for use as module or run directly
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  addImportsToFile,
  applyTruncationToCells,
  tableFiles
};