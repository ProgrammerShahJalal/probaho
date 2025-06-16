import React, { useState } from 'react'; // Add useState if it's just React

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  iconClasses: string[];
  onIconSelect: (iconClass: string) => void;
}

const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  iconClasses,
  onIconSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) {
    return null;
  }

  const handleIconClick = (iconClass: string) => {
    onIconSelect(iconClass);
    onClose(); // Close modal after selection
  };

  const filteredIcons = iconClasses.filter(iconClass =>
    iconClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Basic inline styles for the modal
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's on top
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#101115',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxWidth: '400px',
    maxHeight: '300px', // Max height
    display: 'flex',
    flexDirection: 'column',
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  };

  const listStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto', // Make list scrollable
    flexGrow: 1,
  };

  const listItemStyle: React.CSSProperties = {
    padding: '8px 0',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}> {/* Close on overlay click */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking content */}
        <div style={modalHeaderStyle}>
          <h4>Select an Icon</h4>
          <button className='text-danger' style={closeButtonStyle} onClick={onClose}>
            &times; {/* Close button (X) */}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm} // Control the input
          onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            boxSizing: 'border-box', // Ensures padding doesn't add to width
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <ul style={listStyle}>
          {filteredIcons.map((iconClass) => ( // Changed from iconClasses to filteredIcons
            <li
              key={iconClass}
              style={listItemStyle}
              onClick={() => handleIconClick(iconClass)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0BAF97')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <i className={iconClass} style={{ marginRight: '10px' }}></i> {/* Icon preview in list */}
              {iconClass}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IconPickerModal;
