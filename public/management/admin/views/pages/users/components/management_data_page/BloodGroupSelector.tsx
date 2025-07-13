import React, { useState, useRef, useEffect } from 'react';

const BloodGroupSelector = ({ name, value, onChange, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const bloodGroups = [
        'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    ];

    // Close dropdown when clicking outside
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

    const handleBloodGroupSelect = (bloodGroup: string) => {
        onChange({ target: { name, value: bloodGroup } });
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleInputClick = () => {
        setIsOpen(true);
    };

    // Prevent typing in the input field
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Allow only Tab, Escape, and Arrow keys for navigation
        if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
            return;
        }
        // Prevent all other key inputs
        e.preventDefault();
    };

    return (
        <div className="position-relative" ref={dropdownRef}>
            <label>
                Blood Group
                {required && (
                    <span style={{ color: 'red' }}>*</span>
                )}
            </label>
            <div className="form_elements">
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        name={name}
                        value={value || ''}
                        onChange={() => {}} // Disable onChange to prevent typing
                        onKeyDown={handleKeyDown}
                        onClick={handleInputClick}
                        required={required}
                        className="form-control"
                        placeholder="Select blood group"
                        readOnly // Make input read-only
                        style={{ 
                            paddingRight: '40px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent' // Keep the background transparent like a normal input
                        }}
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary position-absolute"
                        style={{
                            right: '5px',
                            top: '76%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            padding: '2px 6px',
                            fontSize: '12px'
                        }}
                        onClick={toggleDropdown}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                </div>
                
                {isOpen && (
                    <div 
                        className="position-absolute bg-dark border rounded shadow-sm"
                        style={{
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                    >
                        {bloodGroups.map((bloodGroup) => (
                            <div
                                key={bloodGroup}
                                className="px-3 py-2 cursor-pointer hover:bg-light"
                                style={{
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee'
                                }}
                                onClick={() => handleBloodGroupSelect(bloodGroup)}
                            >
                                <div className="d-flex align-items-center">
                                    <span className="me-2" style={{ fontSize: '18px', color: '#dc3545' }}>
                                        🩸
                                    </span>
                                    <span style={{ fontWeight: '500' }}>{bloodGroup}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodGroupSelector;
