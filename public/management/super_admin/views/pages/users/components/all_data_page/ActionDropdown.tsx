import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
import { RootState, useAppDispatch } from '../../../../../store';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { active } from '../../config/store/async_actions/active';
import { inactive } from '../../config/store/async_actions/inactive';
import { soft_delete } from '../../config/store/async_actions/soft_delete';
import { destroy } from '../../config/store/async_actions/destroy';
import { restore } from '../../config/store/async_actions/restore';

export interface ActionDropdownProps {
    item?: anyObject; // Now optional
    selectedItems?: anyObject[]; // For bulk actions
    isBulk?: boolean; // To explicitly trigger bulk mode
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ item, selectedItems, isBulk }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Set menu to always open upwards
    const menuPositionStyle = { bottom: '100%', top: 'auto' as 'auto' | string };
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null); // For click outside
    const triggerRef = useRef<HTMLButtonElement>(null); // For the button itself

    const { show_active_data } = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Removed useEffect for calculateMenuPosition as it's no longer needed.

    const handleActive = async () => {
        setIsOpen(false);
        if (isBulk && selectedItems && selectedItems.length > 0) {
            const confirm = await (window as anyObject).s_confirm(`activate ${selectedItems.length} selected items`);
            if (confirm) {
                selectedItems.forEach(sItem => {
                    if (sItem && sItem.id) { // Ensure item and id exist
                        dispatch(active({ id: sItem.id }) as any);
                    }
                });
                // Optionally, add a toaster message for bulk completion here if desired
            }
        } else if (item && item.id) {
            const confirm = await (window as anyObject).s_confirm('activate data');
            if (confirm) {
                dispatch(active({ id: item.id }) as any);
            }
        }
    };

    const handleInactive = async () => {
        setIsOpen(false);
        if (isBulk && selectedItems && selectedItems.length > 0) {
            const confirm = await (window as anyObject).s_confirm(`inactivate ${selectedItems.length} selected items`);
            if (confirm) {
                selectedItems.forEach(sItem => {
                    if (sItem && sItem.id) {
                        dispatch(inactive({ id: sItem.id }) as any);
                    }
                });
            }
        } else if (item && item.id) {
            const confirm = await (window as anyObject).s_confirm('inactive data');
            if (confirm) {
                dispatch(inactive({ id: item.id }) as any);
            }
        }
    };

    const handleSoftDelete = async () => {
        setIsOpen(false);
        if (isBulk && selectedItems && selectedItems.length > 0) {
            const confirm = await (window as anyObject).s_confirm(`soft delete ${selectedItems.length} selected items`);
            if (confirm) {
                selectedItems.forEach(sItem => {
                    if (sItem && sItem.id) {
                        dispatch(soft_delete({ id: sItem.id }) as any);
                    }
                });
            }
        } else if (item && item.id) {
            const confirm = await (window as anyObject).s_confirm('delete data');
            if (confirm) {
                dispatch(soft_delete({ id: item.id }) as any);
            }
        }
    };

    const handleRestore = async () => {
        setIsOpen(false);
        if (isBulk && selectedItems && selectedItems.length > 0) {
            const confirm = await (window as anyObject).s_confirm(`restore ${selectedItems.length} selected items`);
            if (confirm) {
                selectedItems.forEach(sItem => {
                    if (sItem && sItem.id) {
                        dispatch(restore({ id: sItem.id }) as any);
                    }
                });
            }
        } else if (item && item.id) {
            const confirm = await (window as anyObject).s_confirm('restore data');
            if (confirm) {
                dispatch(restore({ id: item.id }) as any);
            }
        }
    };

    const handleDestroy = async () => {
        setIsOpen(false);
        const warningMsg = 'Warning: This will permanently delete the data and all associated dependencies. Proceed?';
        if (isBulk && selectedItems && selectedItems.length > 0) {
            const confirm = await (window as anyObject).s_confirm(
                `Permanently delete ${selectedItems.length} selected items? ${warningMsg}`,
            );
            if (confirm) {
                let count = 0;
                selectedItems.forEach(sItem => {
                    if (sItem && sItem.id) {
                        dispatch(destroy({ id: sItem.id }) as any);
                        count++;
                    }
                });
                if (count > 0) {
                    (window as any).toaster(`${count} Item(s) Parmanently Deleted!`);
                }
            }
        } else if (item && item.id) {
            const confirm = await (window as anyObject).s_confirm(warningMsg);
            if (confirm) {
                dispatch(destroy({ id: item.id }) as any);
                (window as any).toaster("Data Parmanently Deleted!");
            }
        }
    };

    // Define which actions are visible based on item status and current view
    const actionItems: { label: string; handler: () => Promise<void>; iconClass: string }[] = [];

    if (isBulk && selectedItems && selectedItems.length > 0) {
        const totalSelected = selectedItems.length;
        // Determine collective status
        const areAllActive = selectedItems.every(sItem => sItem.status === 'active' && !sItem.deleted_at);
        const areAllInactive = selectedItems.every(sItem => sItem.status === 'deactive' && !sItem.deleted_at);
        // Assuming 'deleted_at' field indicates a trashed item.
        // If 'deleted_at' is not standard, this might need adjustment to check a status like 'deleted'.
        const areAllTrashed = selectedItems.every(sItem => !!sItem.deleted_at);

        if (show_active_data) { // Viewing main list (Active or Inactive tabs)
            if (areAllActive) {
                actionItems.push({ label: 'Inactive', handler: handleInactive, iconClass: 'icon-power-off text-secondary' });
                actionItems.push({ label: 'Soft Delete', handler: handleSoftDelete, iconClass: 'icon-na text-warning' });
                actionItems.push({ label: 'Destroy', handler: handleDestroy, iconClass: 'icon-trash text-danger' });
            } else if (areAllInactive) {
                actionItems.push({ label: 'Active', handler: handleActive, iconClass: 'icon-eye text-success' });
                actionItems.push({ label: 'Destroy', handler: handleDestroy, iconClass: 'icon-trash text-danger' });
            }
            // If mixed (not all active, not all inactive) when show_active_data is true, no bulk actions are shown
            // as per the defined rules.
        } else { // Viewing Trash
            if (areAllTrashed) {
                actionItems.push({ label: 'Restore', handler: handleRestore, iconClass: 'icon-reload text-success' });
                actionItems.push({ label: 'Destroy', handler: handleDestroy, iconClass: 'icon-trash text-danger' });
            }
            // If items in trash view are not all marked with deleted_at (or equivalent 'deleted' status),
            // then no bulk actions are shown. This implies data consistency with the view.
        }

    } else if (!isBulk && item) {
        // Single item logic (as previously established)
        // Ensure item status is checked correctly. Assuming 'active', 'deactive'.
        // 'deleted' status might be implicit if !show_active_data and item is in a list of trashed items.
        if (item.status === 'deactive' && show_active_data) { // Can only activate if viewing active data list and item is deactive
             actionItems.push({ label: 'Active', handler: handleActive, iconClass: 'icon-eye text-success' });
        } else if (item.status === 'active' && show_active_data) { // Can only deactivate/soft-delete if viewing active data list and item is active
            actionItems.push({ label: 'Inactive', handler: handleInactive, iconClass: 'icon-power-off text-secondary' });
            actionItems.push({ label: 'Soft Delete', handler: handleSoftDelete, iconClass: 'icon-na text-warning' });
        }
        
        // Restore/Destroy logic for single items, typically when viewing trash
        if (!show_active_data) { // If in trash view
            // An item in trash view can be restored or destroyed.
            // Its status could be 'deactive' (if inactive led to trash) or 'deleted' (if soft delete led to trash)
            if (item.deleted_at || item.status === 'deleted' || item.status === 'deactive') { // Check multiple conditions for "trashable"
                actionItems.push({ label: 'Restore', handler: handleRestore, iconClass: 'icon-reload text-success' });
                actionItems.push({ label: 'Destroy', handler: handleDestroy, iconClass: 'icon-trash text-danger' });
            }
        } else if (item.status !== 'active' && item.status !== 'deactive' && show_active_data) {
            // If item is in an 'other' state (e.g. soft deleted but still in active view due to filter error)
            // This is less common, but providing a destroy might be an option.
            // For now, let's stick to clearer conditions based on `show_active_data`.
        }
         // Add Destroy for active/deactive items if it's a general action (not typical for this structure usually)
        if(show_active_data && (item.status === 'active' || item.status === 'deactive')) {
            // Per original individual button logic, Destroy was always available.
            // However, for the dropdown, it's more common to have it in trash or specific states.
            // The bulk rules include Destroy for active/inactive sets. Let's mirror for single items for consistency.
            // This might be too many destroy options. The original DestroyButton had no condition.
            // Let's follow the spirit of bulk rules: Destroy is available for active/inactive items.
             actionItems.push({ label: 'Destroy', handler: handleDestroy, iconClass: 'icon-trash text-danger' });
        }

        // Remove duplicate Destroy if already added by trash view logic
        if (actionItems.filter(a => a.label === 'Destroy').length > 1) {
            const destroyIndex = actionItems.findIndex(a => a.label === 'Destroy' && !(!show_active_data && (item.deleted_at || item.status === 'deleted' || item.status === 'deactive')));
            if (destroyIndex > -1) actionItems.splice(destroyIndex, 1);
        }


    }


    return (
        <div className="dropdown d-inline-block" ref={dropdownRef}>
            <button
                ref={triggerRef}
                className={`btn btn-outline-primary btn-sm dropdown-toggle${isOpen ? ' show' : ''}`}
                type="button"
                id={isBulk ? 'bulkActionDropdownMenuButton' : 'actionDropdownMenuButton'}
                data-bs-toggle="dropdown"
                aria-expanded={isOpen}
                onClick={toggleDropdown}
                disabled={isBulk && (!selectedItems || selectedItems.length === 0)}
                style={{ minWidth: isBulk ? 110 : undefined }}
            >
                {isBulk ? 'Bulk Actions' : 'Actions'}
            </button>
            <ul
                className={`dropdown-menu${isOpen ? ' show' : ''}`}
                aria-labelledby={isBulk ? 'bulkActionDropdownMenuButton' : 'actionDropdownMenuButton'}
                style={{ minWidth: 160, zIndex: 1000, fontSize: '14px' }}
            >
                {actionItems.map((action, index) => (
                    <li key={index}>
                        <button
                            className={`dropdown-item${action.label === 'Destroy' ? ' text-danger' : ''}`}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                action.handler();
                                setIsOpen(false);
                            }}
                        >
                            {action.iconClass && <span className={action.iconClass} style={{ marginRight: '8px' }}></span>}
                            {action.label}
                        </button>
                    </li>
                ))}
                {actionItems.length === 0 && (
                    <li>
                        <span className="dropdown-item text-muted">No actions available</span>
                    </li>
                )}
            </ul>
            <style>{`
  .dropdown-menu .dropdown-item {
    color: #fff !important;
    background: transparent !important;
    border-radius: 0.375rem !important; /* rounded-md */
    transition: background 0.2s, color 0.2s;
  }
  .dropdown-menu .dropdown-item:hover, .dropdown-menu .dropdown-item:focus {
    background: #2C2F35 !important; /* dark gray */
    color: #fff !important;
    border-radius: 0.375rem !important;
  }
  .dropdown-menu .dropdown-item.text-danger:hover, .dropdown-menu .dropdown-item.text-danger:focus {
    color: #dc3545 !important;
  }
`}</style>
        </div>
    );
};

export default ActionDropdown;
