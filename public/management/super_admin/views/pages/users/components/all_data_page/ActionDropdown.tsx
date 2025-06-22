import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../../../store';
import { all } from '../../config/store/async_actions/all';
import { anyObject } from '../../../../../common_types/object';

interface ActionDropdownProps {
    selectedItems: number[];
    users: anyObject[]; // Full list of users currently in the table
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ selectedItems, users }) => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [actions, setActions] = useState<string[]>([]);

    // Placeholder API call functions
    const handleApiCall = async (action: string, items: number[]) => {
        console.log(`Performing action: ${action} for items:`, items);
        // Simulate API call
        return new Promise((resolve) => setTimeout(resolve, 500));
    };

    const handleInactive = async () => {
        await handleApiCall('Inactive', selectedItems);
        dispatch(all({}));
        setIsOpen(false);
    };

    const handleActive = async () => {
        await handleApiCall('Active', selectedItems);
        dispatch(all({}));
        setIsOpen(false);
    };

    const handleSoftDelete = async () => {
        await handleApiCall('SoftDelete', selectedItems);
        dispatch(all({}));
        setIsOpen(false);
    };

    const handleRestore = async () => {
        await handleApiCall('Restore', selectedItems);
        dispatch(all({}));
        setIsOpen(false);
    };

    const handleDestroy = async () => {
        if (window.confirm('Are you sure you want to permanently destroy these items? This action cannot be undone.')) {
            await handleApiCall('Destroy', selectedItems);
            dispatch(all({}));
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (selectedItems.length === 0) {
            setActions([]);
            setIsOpen(false);
            return;
        }

        const selectedUsersData = users.filter(user => selectedItems.includes(user.id));

        if (selectedUsersData.length === 0 && selectedItems.length > 0) {
            // This can happen if users prop is not yet updated or out of sync
            // For now, let's not show any actions to be safe
            setActions([]);
            return;
        }

        const isActive = (user: anyObject) => user.status === 'active' && !user.deleted_at;
        const isInactive = (user: anyObject) => user.status === 'deactive' && !user.deleted_at;
        const isTrashed = (user: anyObject) => user.deleted_at !== null;

        const allActive = selectedUsersData.every(isActive);
        const allInactive = selectedUsersData.every(isInactive);
        const allTrashed = selectedUsersData.every(isTrashed);

        let newActions: string[] = [];

        if (allActive) {
            newActions = ['Inactive', 'Soft Delete', 'Destroy'];
        } else if (allInactive) {
            newActions = ['Active', 'Destroy'];
        } else if (allTrashed) {
            newActions = ['Restore', 'Destroy'];
        } else {
            // Mixed selection or no specific group matches.
            // Potentially add a "Destroy" option or specific logic for mixed states if required.
            // For now, if not all items fit a single category, only "Destroy" might be universally applicable.
            // Or, show no actions if states are mixed and specific group actions are preferred.
            // Based on the prompt, it seems actions are determined if *all* data is of a certain type.
            // If selected items are of mixed status, no actions are shown except possibly a universal "Destroy".
            // Let's add "Destroy" if there's any selection and no other category matches.
             if (selectedItems.length > 0) {
                newActions = ['Destroy'];
            }
        }
        setActions(newActions);

    }, [selectedItems, users]);

    if (selectedItems.length === 0) {
        return null; // Don't render anything if no items are selected
    }

    return (
        <div className="dropdown d-inline-block">
            <button
                className="btn btn-outline-primary btn-sm dropdown-toggle"
                type="button"
                id="actionDropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                disabled={actions.length === 0}
            >
                Select Action ({selectedItems.length})
            </button>
            <ul
                className={`dropdown-menu custom-action-dropdown${isOpen && actions.length > 0 ? ' show' : ''}`}
                aria-labelledby="actionDropdownMenuButton"
                style={{ minWidth: 160, zIndex: 10 }}
            >
                {actions.includes('Active') && (
                    <li>
                        <button className="dropdown-item" style={{ color: '#fff', background: 'transparent' }} onClick={handleActive}>Active</button>
                    </li>
                )}
                {actions.includes('Inactive') && (
                    <li>
                        <button className="dropdown-item" style={{ color: '#fff', background: 'transparent' }} onClick={handleInactive}>Inactive</button>
                    </li>
                )}
                {actions.includes('Soft Delete') && (
                    <li>
                        <button className="dropdown-item" style={{ color: '#fff', background: 'transparent' }} onClick={handleSoftDelete}>Soft Delete</button>
                    </li>
                )}
                {actions.includes('Restore') && (
                    <li>
                        <button className="dropdown-item" style={{ color: '#fff', background: 'transparent' }} onClick={handleRestore}>Restore</button>
                    </li>
                )}
                {actions.includes('Destroy') && (
                    <li>
                        <button className="dropdown-item text-danger" onClick={handleDestroy}>Destroy</button>
                    </li>
                )}
            </ul>
            {/* Add a style block for hover effects */}
            <style>{`
                .custom-action-dropdown .dropdown-item {
                    color: #fff;
                    background: transparent;
                    transition: background 0.2s;
                }
                .custom-action-dropdown .dropdown-item:hover {
                    background: #f1f1f1 !important;
                    color: #212529 !important;
                }
                .custom-action-dropdown .dropdown-item.text-danger:hover {
                    background: #f1f1f1 !important;
                    color: #dc3545 !important;
                }
            `}</style>
        </div>
    );
};

export default ActionDropdown;
