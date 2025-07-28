/**
 * Text utility functions for table display and formatting
 */

export interface TruncateOptions {
  maxLength?: number;
  suffix?: string;
  preserveWords?: boolean;
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum number of characters (default: 50)
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @param preserveWords - Whether to preserve whole words (default: false)
 * @returns Truncated text
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50,
  suffix: string = '...',
  preserveWords: boolean = false
): string => {
  if (!text) return '';
  
  const textStr = String(text);
  
  if (textStr.length <= maxLength) {
    return textStr;
  }

  if (preserveWords) {
    const truncated = textStr.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + suffix;
    }
  }

  return textStr.substring(0, maxLength) + suffix;
};

/**
 * Get character limits based on column type and screen size
 * @param columnType - Type of column (description, title, name, etc.)
 * @param screenSize - Screen size (mobile, tablet, desktop)
 * @returns Character limit for the column type and screen size
 */
export const getCharacterLimit = (
  columnType: string,
  screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'
): number => {
  const limits: Record<string, Record<string, number>> = {
    description: { mobile: 30, tablet: 40, desktop: 45 },
    title: { mobile: 20, tablet: 25, desktop: 30 },
    name: { mobile: 10, tablet: 15, desktop: 20 },
    event_name: { mobile: 20, tablet: 25, desktop: 30 },
    email: { mobile: 15, tablet: 20, desktop: 25 },
    address: { mobile: 25, tablet: 40, desktop: 60 },
    phone: { mobile: 15, tablet: 20, desktop: 25 },
    default: { mobile: 20, tablet: 25, desktop: 30 }
  };

  return limits[columnType]?.[screenSize] || limits.default[screenSize];
};

/**
 * Truncates text based on column type with responsive limits
 * @param text - Text to truncate
 * @param columnType - Type of column
 * @param screenSize - Screen size
 * @param options - Additional truncation options
 * @returns Truncated text
 */
export const truncateByColumnType = (
  text: string | null | undefined,
  columnType: string,
  screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  options?: Omit<TruncateOptions, 'maxLength'>
): string => {
  const maxLength = getCharacterLimit(columnType, screenSize);
  return truncateText(text, maxLength, options?.suffix, options?.preserveWords);
};

/**
 * Formats array data for table display (e.g., joined relationships)
 * @param data - Array of objects or strings
 * @param key - Key to extract from objects (optional)
 * @param separator - Separator for joining (default: ', ')
 * @param maxLength - Maximum length for the result
 * @returns Formatted and truncated string
 */
export const formatArrayForTable = (
  data: any[] | null | undefined,
  key?: string,
  separator: string = ', ',
  maxLength: number = 60
): string => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  let result: string;
  
  if (key) {
    result = data.map(item => item[key]).filter(Boolean).join(separator);
  } else {
    result = data.map(item => String(item)).join(separator);
  }

  return truncateText(result, maxLength);
};

/**
 * React component props for truncated table cells
 */
export interface TruncatedCellProps {
  text: string | null | undefined;
  maxLength?: number;
  showTooltip?: boolean;
  className?: string;
  columnType?: string;
}

/**
 * Get props for a truncated table cell with tooltip
 * @param text - Text to display
 * @param maxLength - Maximum length
 * @param showTooltip - Whether to show full text in tooltip
 * @param className - Additional CSS classes
 * @returns Props object for table cell
 */
export const getTruncatedCellProps = ({
  text,
  maxLength = 50,
  showTooltip = true,
  className = '',
  columnType = 'default'
}: TruncatedCellProps) => {
  const truncated = truncateText(text, maxLength);
  const isTruncated = text && text.length > maxLength;
  
  return {
    children: truncated,
    title: showTooltip && isTruncated ? text : undefined,
    className: `table-cell-truncate ${className} ${columnType}-cell`.trim(),
    'data-full-text': text,
    'data-truncated': isTruncated
  };
};