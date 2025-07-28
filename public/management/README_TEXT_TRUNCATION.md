# Text Truncation System Documentation

This document explains the centralized text truncation system implemented across all table components in the management system.

## Overview

The text truncation system provides a consistent way to handle long text content in table cells, ensuring better user experience and responsive design across all admin and super admin interfaces.

## Files Structure

### Core Utility Files
- `public/management/admin/helpers/textUtils.ts` - Main utility functions for admin section
- `public/management/super_admin/helpers/textUtils.ts` - Main utility functions for super admin section

### CSS Styles
- `public/management/admin/views/components/styles/table-truncation.css` - Styles for admin tables
- `public/management/super_admin/views/components/styles/table-truncation.css` - Styles for super admin tables

### Helper Scripts
- `public/management/admin/helpers/applyTextTruncation.ts` - Configuration and mapping helpers
- `public/management/admin/helpers/bulkApplyTruncation.js` - Bulk application script

## Usage

### Basic Implementation

1. **Import the utilities in your table component:**

```typescript
import { truncateText, formatArrayForTable, getTruncatedCellProps } from '../../../helpers/textUtils';
import '../../../views/components/styles/table-truncation.css';
```

2. **Apply truncation to table cells:**

```tsx
// Simple text truncation
<td 
    {...getTruncatedCellProps({
        text: i.name,
        maxLength: 40,
        columnType: 'name'
    })}
/>

// For cells with interactive elements
<td 
    {...getTruncatedCellProps({
        text: i.name,
        maxLength: 40,
        columnType: 'name'
    })}
>
    <span
        className="quick_view_trigger"
        onClick={() => quick_view(i)}
    >
        {truncateText(i.name, 40)}
    </span>
</td>

// For array data (relationships)
<td 
    {...getTruncatedCellProps({
        text: formatArrayForTable(i.users, 'name'),
        maxLength: 60,
        columnType: 'title'
    })}
/>
```

## Available Functions

### `truncateText(text, maxLength, suffix, preserveWords)`
Truncates text to specified length with ellipsis.

**Parameters:**
- `text` (string): Text to truncate
- `maxLength` (number): Maximum characters (default: 50)
- `suffix` (string): Suffix when truncated (default: '...')
- `preserveWords` (boolean): Preserve whole words (default: false)

### `getTruncatedCellProps(options)`
Returns props object for table cells with truncation and tooltip.

**Options:**
- `text` (string): Text to display
- `maxLength` (number): Maximum length
- `showTooltip` (boolean): Show full text in tooltip (default: true)
- `className` (string): Additional CSS classes
- `columnType` (string): Column type for styling

### `formatArrayForTable(data, key, separator, maxLength)`
Formats array data for table display.

**Parameters:**
- `data` (array): Array of objects or strings
- `key` (string): Key to extract from objects (optional)
- `separator` (string): Join separator (default: ', ')
- `maxLength` (number): Maximum result length (default: 60)

### `getCharacterLimit(columnType, screenSize)`
Gets responsive character limits based on column type and screen size.

## Column Types and Default Limits

| Column Type | Desktop | Tablet | Mobile |
|-------------|---------|--------|--------|
| `name` | 20 | 15 | 10 |
| `email` | 25 | 20 | 15 |
| `title` | 30 | 25 | 20 |
| `description` | 45 | 40 | 30 |
| `event_name` | 30 | 25 | 20 |
| `address` | 60 | 40 | 25 |
| `phone` | 25 | 20 | 15 |
| `default` | 30 | 25 | 20 |

## CSS Classes

### Core Classes
- `.table-cell-truncate` - Base truncation styling
- `.id-cell` - ID column styling
- `.status-cell` - Status column styling
- `.date-cell` - Date column styling

### Column-Specific Classes
- `.name-cell` - Name columns
- `.email-cell` - Email columns
- `.title-cell` - Title columns
- `.description-cell` - Description columns
- `.address-cell` - Address columns
- `.phone-cell` - Phone columns

## Applied Files

### Admin Section
✅ **Academic Calendar**
- `public/management/admin/views/pages/academic_calendar/All.tsx`
- `public/management/admin/views/pages/academic_calendar/History.tsx`

✅ **Users**
- `public/management/admin/views/pages/users/All.tsx`

✅ **Admins**
- `public/management/admin/views/pages/admins/All.tsx`

✅ **Contact Management**
- `public/management/admin/views/pages/contact_management/All.tsx`

### Remaining Files to Apply
The following files can be updated using the bulk application script or manual implementation:

**Admin Section:**
- `public/management/admin/views/pages/users/History.tsx`
- `public/management/admin/views/pages/user_roles/All.tsx`
- `public/management/admin/views/pages/user_roles/History.tsx`
- `public/management/admin/views/pages/user-login-histories/All.tsx`
- `public/management/admin/views/pages/user-login-histories/History.tsx`
- `public/management/admin/views/pages/admins/History.tsx`
- `public/management/admin/views/pages/academic_year/All.tsx`
- `public/management/admin/views/pages/academic_year/History.tsx`
- `public/management/admin/views/pages/academic_calendar_event_types/All.tsx`
- `public/management/admin/views/pages/academic_calendar_event_types/History.tsx`
- `public/management/admin/views/pages/academic_batch_id_rules/All.tsx`
- `public/management/admin/views/pages/academic_batch_id_rules/History.tsx`

**Super Admin Section:**
- `public/management/super_admin/views/pages/user_roles/All.tsx`
- `public/management/super_admin/views/pages/user_roles/History.tsx`
- `public/management/super_admin/views/pages/users/All.tsx`
- `public/management/super_admin/views/pages/users/History.tsx`
- `public/management/super_admin/views/pages/user-login-histories/All.tsx`
- `public/management/super_admin/views/pages/user-login-histories/History.tsx`
- `public/management/super_admin/views/pages/contact_management/All.tsx`
- `public/management/super_admin/views/pages/admins/All.tsx`
- `public/management/super_admin/views/pages/admins/History.tsx`

## Best Practices

1. **Consistent Character Limits**: Use the predefined column types for consistent limits across the application.

2. **Responsive Design**: The system automatically adjusts character limits based on screen size.

3. **Tooltips**: Always enable tooltips (default behavior) to show full content on hover.

4. **Interactive Elements**: For cells with clickable elements, apply truncation to both the cell and the inner content.

5. **Array Data**: Use `formatArrayForTable()` for relationship data that needs to be displayed as comma-separated values.

## Customization

### Custom Character Limits
```typescript
<td 
    {...getTruncatedCellProps({
        text: i.customField,
        maxLength: 75, // Custom limit
        columnType: 'default'
    })}
/>
```

### Custom CSS Classes
```typescript
<td 
    {...getTruncatedCellProps({
        text: i.field,
        maxLength: 50,
        columnType: 'default',
        className: 'my-custom-class'
    })}
/>
```

## Testing

To test the implementation:

1. **Visual Testing**: Check tables with long content to ensure proper truncation
2. **Responsive Testing**: Test on different screen sizes
3. **Tooltip Testing**: Hover over truncated cells to verify tooltips
4. **Interactive Testing**: Ensure clickable elements still work within truncated cells

## Maintenance

When adding new table components:

1. Import the required utilities and CSS
2. Apply `getTruncatedCellProps()` to appropriate cells
3. Use appropriate column types for consistent styling
4. Test across different screen sizes

## Troubleshooting

**Common Issues:**

1. **Tooltips not showing**: Ensure the cell has a `title` attribute (handled automatically by `getTruncatedCellProps`)
2. **Inconsistent styling**: Use predefined column types instead of custom maxLength values
3. **Interactive elements not working**: Apply truncation to both cell and inner content
4. **CSS not loading**: Verify the CSS import path is correct for your component location

For questions or issues, refer to the utility functions in `textUtils.ts` or the CSS definitions in `table-truncation.css`.