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
    const [menuPositionStyle, setMenuPositionStyle] = useState({ top: '100%', bottom: 'auto' as 'auto' | string });
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null); // For click outside
    const triggerRef = useRef<HTMLButtonElement>(null); // For the button itself
    const menuRef = useRef<HTMLDivElement>(null); // For the menu div

    const { show_active_data } = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const calculateMenuPosition = () => {
        if (!isOpen || !triggerRef.current || !menuRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        // A little buffer to prevent menu from sticking to the very edge
        const buffer = 5; 

        if (spaceBelow < (menuHeight + buffer) && spaceAbove > (menuHeight + buffer)) {
            setMenuPositionStyle({ bottom: '100%', top: 'auto' }); // Open upwards
        } else {
            setMenuPositionStyle({ top: '100%', bottom: 'auto' }); // Open downwards (default)
        }
    };

    const toggleDropdown = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        // Reset position to default when opening, recalculation will happen in useEffect
        if (newIsOpen) {
            setMenuPositionStyle({ top: '100%', bottom: 'auto' });
        }
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

    useEffect(() => {
        if (isOpen) {
            // Use requestAnimationFrame to ensure the menu is rendered and its dimensions are available
            requestAnimationFrame(() => {
                calculateMenuPosition();
            });
        }
    }, [isOpen]); // Recalculate when isOpen changes (specifically, when it becomes true)


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
        <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
            <button
                ref={triggerRef} // Attach triggerRef to the button
                onClick={toggleDropdown}
                style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', background: '#f9f9f9', borderRadius: '4px' }}
                disabled={isBulk && (!selectedItems || selectedItems.length === 0)} // Disable if bulk and no items
            >
                {isBulk ? 'Bulk Actions' : 'Actions'} <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>▼</span>
            </button>
            {isOpen && (
                <div
                    ref={menuRef} // Attach menuRef to the menu div
                    style={{
                        position: 'absolute',
                        left: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '160px',
                        // Apply dynamic position and margins
                        ...menuPositionStyle,
                        marginTop: menuPositionStyle.bottom === '100%' ? 0 : '2px',
                        marginBottom: menuPositionStyle.bottom === '100%' ? '2px' : 0,
                    }}
                >
                    <ul style={{ listStyle: 'none', margin: 0, padding: '5px 0' }}>
                        {actionItems.map((action, index) => (
                            <li key={index} style={{ padding: '10px 15px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    action.handler();
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                {action.iconClass && <span className={action.iconClass} style={{ marginRight: '8px' }}></span>}
                                {action.label}
                            </li>
                        ))}
                        {actionItems.length === 0 && (
                            <li style={{ padding: '10px 15px', color: '#888', fontSize: '14px' }}>No actions available</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ActionDropdown;
