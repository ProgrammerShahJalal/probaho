export const getValue = (state, key) => {
    try {
        // Handle user_id case specifically for user-login-histories
        if (key === 'user_id' && state.item?.user?.name) {
            return state.item.user.name;
        }

        let value = state.item?.[key] ?? state.item?.info?.[key];

        if (key === 'role_serial') {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        // For Details.tsx files, join into a string
                        // For Edit.tsx files, return the array
                        return parsed.join(', '); // Or handle based on context if needed
                    }
                } catch {
                    // Fallback for non-JSON strings or other issues
                }
            }
            if (Array.isArray(value)) {
                 // For Details.tsx files, join into a string
                 // For Edit.tsx files, return the array
                return value.join(', '); // Or handle based on context if needed
            }
            if (typeof value === 'number') {
                return value.toString(); // Or [value] for Edit.tsx
            }
            return ''; // Or [] for Edit.tsx
        }

        return value ?? '';
    } catch (error) {
        console.error(`Error getting value for key: ${key}`, error);
        return '';
    }
};

// Specific version for Edit components that need array for role_serial
export const getValueForEdit = (state, key) => {
    try {
        let value = state.item?.[key] ?? state.item?.info?.[key];

        if (key === 'role_serial') {
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed;
                } catch {
                    // fallback
                }
            }
            if (Array.isArray(value)) return value;
            if (typeof value === 'number') return [value];
            return [];
        }
        return value ?? '';
    } catch (error) {
        console.error(`Error getting value for key (edit): ${key}`, error);
        return '';
    }
}
