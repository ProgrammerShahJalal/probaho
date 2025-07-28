/**
 * Utility to apply text truncation to table files
 * This script helps apply the text truncation utilities to existing table files
 */

export const tableFileUpdates = {
  // Import statements to add
  imports: `import { truncateText, formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';`,

  // Super admin import path
  superAdminImports: `import { truncateText, formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';`,

  // Common cell replacements
  getCellReplacements: () => ({
    // ID cells
    idCell: (content: string) => `<td className="id-cell">${content}</td>`,
    
    // Name cells with quick view
    nameWithQuickView: (name: string, maxLength: number = 40) => `
<td 
    {...getTruncatedCellProps({
        text: ${name},
        maxLength: ${maxLength},
        columnType: 'name'
    })}
>
    <span
        className="quick_view_trigger"
        onClick={() => quick_view(i)}
    >
        {truncateText(${name}, ${maxLength})}
    </span>
</td>`,

    // Regular truncated cells
    truncatedCell: (content: string, maxLength: number, columnType: string) => `
<td 
    {...getTruncatedCellProps({
        text: ${content},
        maxLength: ${maxLength},
        columnType: '${columnType}'
    })}
/>`,

    // Status cells
    statusCell: (content: string) => `<td className="status-cell">${content}</td>`,

    // Date cells
    dateCell: (content: string) => `<td className="date-cell">${content}</td>`,

    // Array format cells
    arrayCell: (arrayData: string, key: string, maxLength: number = 60) => `
<td 
    {...getTruncatedCellProps({
        text: formatArrayForTable(${arrayData}, '${key}'),
        maxLength: ${maxLength},
        columnType: 'title'
    })}
/>`
  })
};

// Column type mappings for different table types
export const columnTypeMappings = {
  users: {
    name: { type: 'name', maxLength: 40 },
    email: { type: 'email', maxLength: 40 },
    role: { type: 'title', maxLength: 40 },
    phone: { type: 'phone', maxLength: 25 },
    address: { type: 'address', maxLength: 60 }
  },
  admins: {
    name: { type: 'name', maxLength: 40 },
    email: { type: 'email', maxLength: 40 },
    role: { type: 'title', maxLength: 40 },
    department: { type: 'title', maxLength: 35 }
  },
  academic_calendar: {
    event_name: { type: 'event_name', maxLength: 45 },
    description: { type: 'description', maxLength: 100 },
    title: { type: 'title', maxLength: 50 }
  },
  academic_year: {
    title: { type: 'title', maxLength: 50 },
    description: { type: 'description', maxLength: 80 }
  },
  contact_management: {
    name: { type: 'name', maxLength: 40 },
    email: { type: 'email', maxLength: 40 },
    subject: { type: 'title', maxLength: 50 },
    message: { type: 'description', maxLength: 100 }
  }
};

// Helper function to generate truncated cell props
export const generateTruncatedCell = (
  content: string, 
  columnType: string, 
  maxLength?: number,
  customClassName?: string
) => {
  const length = maxLength || getDefaultMaxLength(columnType);
  return `
<td 
    {...getTruncatedCellProps({
        text: ${content},
        maxLength: ${length},
        columnType: '${columnType}'${customClassName ? `,\n        className: '${customClassName}'` : ''}
    })}
/>`;
};

// Get default max length for column types
export const getDefaultMaxLength = (columnType: string): number => {
  const defaults: Record<string, number> = {
    name: 40,
    email: 40,
    title: 50,
    description: 100,
    event_name: 45,
    address: 60,
    phone: 25,
    default: 50
  };
  return defaults[columnType] || defaults.default;
};