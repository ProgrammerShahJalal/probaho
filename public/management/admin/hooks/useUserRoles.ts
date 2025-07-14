import React from 'react';

const useUserRoles = () => {
    // State to store user roles map
    const [userRolesMap, setUserRolesMap] = React.useState<{ [key: number]: string }>({});

    // Fetch user roles and store them in a map
    React.useEffect(() => {
        fetch(
            `/api/v1/user-roles?orderByCol=id&orderByAsc=true&show_active_data=true&select_fields=`,
        )
            .then((res) => res.json())
            .then((data) => {
                const roleMap: { [key: number]: string } = {};
                data?.data?.data?.forEach(
                    (role: { serial: number; title:string }) => {
                        roleMap[role.serial] = role.title;
                    },
                );
                setUserRolesMap(roleMap);
            })
            .catch((err) => console.error('Error fetching user roles:', err));
    }, []);

    // Function to map role_serial array to role titles
    function getRoleTitles(roleSerial: any): string {
        try {
            let serials: number[] = [];
            // If value is a stringified array, parse it
            if (typeof roleSerial === 'string') {
                try {
                    const parsed = JSON.parse(roleSerial);
                    if (Array.isArray(parsed)) serials = parsed;
                } catch {
                    // fallback
                }
            }
            // If value is already an array, use it
            if (Array.isArray(roleSerial)) serials = roleSerial;
            // If value is a single number, treat as array
            if (typeof roleSerial === 'number') serials = [roleSerial];

            // Map each serial to its role title and join
            const roles = serials
                .map((serial) => userRolesMap[serial] || 'Unknown')
                .filter((role) => role !== 'Unknown');
            return roles.length > 0 ? roles.join(', ') : 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    return { userRolesMap, getRoleTitles };
};

export default useUserRoles;
