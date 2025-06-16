import React, { useState, useEffect } from 'react';
import IconPickerModal from './IconPickerModal';

const FONT_AWESOME_ICONS: string[] = [
    "fa fa-book",
    "fa fa-car",
    "fa fa-camera",
    "fa fa-camera-retro",
    "fa fa-calendar",
    "fa fa-calendar-check-o",
    "fa fa-calendar-minus-o",
    "fa fa-calendar-o",
    "fa fa-calendar-plus-o",
    "fa fa-calendar-times-o",
    "fa fa-caret-down",
    "fa fa-caret-left",
    "fa fa-caret-right",
    "fa fa-caret-square-o-down",
    "fa fa-caret-square-o-left",
    "fa fa-caret-square-o-right",
    "fa fa-caret-square-o-up",
    "fa fa-caret-up",
    "fa fa-cart-arrow-down",
    "fa fa-cart-plus",
    "fa fa-cc",
    "fa fa-certificate",
    "fa fa-check",
    "fa fa-check-circle",
    "fa fa-check-circle-o",
    "fa fa-check-square",
    "fa fa-check-square-o",
    "fa fa-child",
    "fa fa-circle",
    "fa fa-circle-o",
    "fa fa-circle-o-notch",
    "fa fa-circle-thin",
    "fa fa-clock-o",
    "fa fa-clone",
    "fa fa-close",
    "fa fa-cloud",
    "fa fa-cloud-download",
    "fa fa-cloud-upload",
    "fa fa-code",
    "fa fa-code-fork",
    "fa fa-coffee",
    "fa fa-cog",
    "fa fa-cogs",
    "fa fa-comment",
    "fa fa-comment-o",
    "fa fa-comments",
    "fa fa-comments-o",
    "fa fa-compass",
    "fa fa-copyright",
    "fa fa-credit-card",
    "fa fa-credit-card-alt",
    "fa fa-crop",
    "fa fa-crosshairs",
    "fa fa-cube",
    "fa fa-cubes",
    "fa fa-cutlery",
    "fa fa-dashboard", // alias for fa-tachometer
    "fa fa-database",
    "fa fa-deaf",
    "fa fa-desktop",
    "fa fa-diamond",
    "fa fa-dot-circle-o",
    "fa fa-download",
    "fa fa-edit", // alias for fa-pencil-square-o
    "fa fa-envelope",
    "fa fa-envelope-o",
    "fa fa-envelope-open",
    "fa fa-envelope-open-o",
    "fa fa-envelope-square",
    "fa fa-eraser",
    "fa fa-exchange",
    "fa fa-exclamation",
    "fa fa-exclamation-circle",
    "fa fa-exclamation-triangle",
    "fa fa-external-link",
    "fa fa-external-link-square",
    "fa fa-eye",
    "fa fa-eye-slash",
    "fa fa-eyedropper",
    "fa fa-fax",
    "fa fa-female",
    "fa fa-fighter-jet",
    "fa fa-file",
    "fa fa-file-archive-o",
    "fa fa-file-audio-o",
    "fa fa-file-code-o",
    "fa fa-file-excel-o",
    "fa fa-file-image-o",
    "fa fa-file-movie-o", // alias for fa-file-video-o
    "fa fa-file-pdf-o",
    "fa fa-file-photo-o", // alias for fa-file-image-o
    "fa fa-file-picture-o", // alias for fa-file-image-o
    "fa fa-file-powerpoint-o",
    "fa fa-file-sound-o", // alias for fa-file-audio-o
    "fa fa-file-text",
    "fa fa-file-text-o",
    "fa fa-file-video-o",
    "fa fa-file-word-o",
    "fa fa-file-zip-o", // alias for fa-file-archive-o
    "fa fa-film",
    "fa fa-filter",
    "fa fa-fire",
    "fa fa-fire-extinguisher",
    "fa fa-flag",
    "fa fa-flag-checkered",
    "fa fa-flag-o",
    "fa fa-flash", // alias for fa-bolt
    "fa fa-flask",
    "fa fa-folder",
    "fa fa-folder-o",
    "fa fa-folder-open",
    "fa fa-folder-open-o",
    "fa fa-frown-o",
    "fa fa-futbol-o", // alias for fa-soccer-ball-o
    "fa fa-gamepad",
    "fa fa-gavel", // alias for fa-legal
    "fa fa-gear", // alias for fa-cog
    "fa fa-gears", // alias for fa-cogs
    "fa fa-gift",
    "fa fa-glass",
    "fa fa-globe",
    "fa fa-graduation-cap",
    "fa fa-group", // alias for fa-users
    "fa fa-hdd-o",
    "fa fa-headphones",
    "fa fa-heart",
    "fa fa-heart-o",
    "fa fa-heartbeat",
    "fa fa-history",
    "fa fa-home",
    "fa fa-hospital-o",
    "fa fa-hourglass",
    "fa fa-hourglass-end", // alias for fa-hourglass-3
    "fa fa-hourglass-half", // alias for fa-hourglass-2
    "fa fa-hourglass-o", // alias for fa-hourglass-empty
    "fa fa-hourglass-start", // alias for fa-hourglass-1
    "fa fa-i-cursor",
    "fa fa-image", // alias for fa-photo or fa-picture-o
    "fa fa-inbox",
    "fa fa-info",
    "fa fa-info-circle",
    "fa fa-key",
    "fa fa-keyboard-o",
    "fa fa-language",
    "fa fa-laptop",
    "fa fa-leaf",
    "fa fa-legal", // alias for fa-gavel
    "fa fa-lemon-o",
    "fa fa-level-down",
    "fa fa-level-up",
    "fa fa-life-bouy", // alias for fa-life-ring
    "fa fa-life-ring",
    "fa fa-life-saver", // alias for fa-support
    "fa fa-lightbulb-o",
    "fa fa-line-chart",
    "fa fa-location-arrow",
    "fa fa-lock",
    "fa fa-magic",
    "fa fa-magnet",
    "fa fa-mail-forward", // alias for fa-share
    "fa fa-mail-reply", // alias for fa-reply
    "fa fa-mail-reply-all", // alias for fa-reply-all
    "fa fa-male",
    "fa fa-map",
    "fa fa-map-o",
    "fa fa-map-pin",
    "fa fa-map-signs",
    "fa fa-map-marker",
    "fa fa-meh-o",
    "fa fa-microphone",
    "fa fa-microphone-slash",
    "fa fa-minus",
    "fa fa-minus-circle",
    "fa fa-minus-square",
    "fa fa-minus-square-o",
    "fa fa-mobile", // alias for fa-mobile-phone
    "fa fa-money",
    "fa fa-motorcycle",
    "fa fa-mouse-pointer",
    "fa fa-music",
    "fa fa-navicon", // alias for fa-bars
    "fa fa-newspaper-o",
    "fa fa-paint-brush",
    "fa fa-paper-plane",
    "fa fa-paper-plane-o",
    "fa fa-paw",
    "fa fa-pencil",
    "fa fa-pencil-square",
    "fa fa-pencil-square-o", // alias for fa-edit
    "fa fa-percent",
    "fa fa-phone",
    "fa fa-phone-square",
    "fa fa-photo", // alias for fa-image or fa-picture-o
    "fa fa-picture-o", // alias for fa-image or fa-photo
    "fa fa-pie-chart",
    "fa fa-plane",
    "fa fa-plug",
    "fa fa-plus",
    "fa fa-plus-circle",
    "fa fa-plus-square",
    "fa fa-plus-square-o",
    "fa fa-power-off",
    "fa fa-print",
    "fa fa-puzzle-piece",
    "fa fa-qrcode",
    "fa fa-question",
    "fa fa-question-circle",
    "fa fa-question-circle-o",
    "fa fa-quote-left",
    "fa fa-quote-right",
    "fa fa-random",
    "fa fa-recycle",
    "fa fa-refresh",
    "fa fa-registered",
    "fa fa-remove", // alias for fa-close or fa-times
    "fa fa-reorder", // alias for fa-bars
    "fa fa-reply",
    "fa fa-reply-all",
    "fa fa-retweet",
    "fa fa-road",
    "fa fa-rocket",
    "fa fa-rss",
    "fa fa-rss-square",
    "fa fa-search",
    "fa fa-search-minus",
    "fa fa-search-plus",
    "fa fa-send", // alias for fa-paper-plane
    "fa fa-send-o", // alias for fa-paper-plane-o
    "fa fa-server",
    "fa fa-share",
    "fa fa-share-alt",
    "fa fa-share-alt-square",
    "fa fa-share-square",
    "fa fa-share-square-o",
    "fa fa-shield",
    "fa fa-ship",
    "fa fa-shopping-bag",
    "fa fa-shopping-basket",
    "fa fa-shopping-cart",
    "fa fa-shower",
    "fa fa-sign-in",
    "fa fa-sign-out",
    "fa fa-sitemap",
    "fa fa-sliders",
    "fa fa-smile-o",
    "fa fa-soccer-ball-o", // alias for fa-futbol-o
    "fa fa-sort", // alias for fa-unsorted
    "fa fa-sort-alpha-asc",
    "fa fa-sort-alpha-desc",
    "fa fa-sort-amount-asc",
    "fa fa-sort-amount-desc",
    "fa fa-sort-asc", // alias for fa-sort-up
    "fa fa-sort-desc", // alias for fa-sort-down
    "fa fa-sort-down", // alias for fa-sort-desc
    "fa fa-sort-numeric-asc",
    "fa fa-sort-numeric-desc",
    "fa fa-sort-up", // alias for fa-sort-asc
    "fa fa-space-shuttle",
    "fa fa-spinner",
    "fa fa-spoon",
    "fa fa-square",
    "fa fa-square-o",
    "fa fa-star",
    "fa fa-star-half",
    "fa fa-star-half-o", // alias for fa-star-half-empty or fa-star-half-full
    "fa fa-star-o",
    "fa fa-sticky-note",
    "fa fa-sticky-note-o",
    "fa fa-street-view",
    "fa fa-suitcase",
    "fa fa-sun-o",
    "fa fa-support", // alias for fa-life-ring
    "fa fa-tablet",
    "fa fa-tachometer", // alias for fa-dashboard
    "fa fa-tag",
    "fa fa-tags",
    "fa fa-tasks",
    "fa fa-taxi", // alias for fa-cab
    "fa fa-television", // alias for fa-tv
    "fa fa-terminal",
    "fa fa-thermometer", // (Font Awesome 5 has this, may not be in FA 4 if that's what's used)
    "fa fa-thumb-tack",
    "fa fa-thumbs-down",
    "fa fa-thumbs-o-up",
    "fa fa-thumbs-up",
    "fa fa-ticket",
    "fa fa-times", // alias for fa-close or fa-remove
    "fa fa-times-circle",
    "fa fa-times-circle-o",
    "fa fa-trash",
    "fa fa-trash-o",
    "fa fa-tree",
    "fa fa-trophy",
    "fa fa-truck",
    "fa fa-tv", // alias for fa-television
    "fa fa-umbrella",
    "fa fa-unlock",
    "fa fa-unlock-alt",
    "fa fa-university", // alias for fa-institution or fa-bank
    "fa fa-unsorted", // alias for fa-sort
    "fa fa-upload",
    "fa fa-user",
    "fa fa-user-circle",
    "fa fa-user-circle-o",
    "fa fa-user-o",
    "fa fa-user-plus",
    "fa fa-user-secret",
    "fa fa-user-times",
    "fa fa-users", // alias for fa-group
    "fa fa-video-camera",
    "fa fa-volume-down",
    "fa fa-volume-off",
    "fa fa-volume-up",
    "fa fa-warning", // alias for fa-exclamation-triangle
    "fa fa-wheelchair",
    "fa fa-wheelchair-alt", // May be specific to FA versions
    "fa fa-wrench"
];

interface StatItem {
    id: number;
    title: string;
    count: number | string;
    icon: string;
}

interface StatisticalInfoEditorProps {
    value: string; // JSON string of StatItem[]
    onChange: (data: StatItem[]) => void;
}

const StatisticalInfoEditor: React.FC<StatisticalInfoEditorProps> = ({ value, onChange }) => {
    const [statItems, setStatItems] = useState<StatItem[]>([]);
    const [isIconModalOpen, setIsIconModalOpen] = useState<boolean>(false);
    const [editingIconIndex, setEditingIconIndex] = useState<number | null>(null);

    useEffect(() => {
        let itemsToSet: StatItem[] = [{ id: 1, title: '', count: '', icon: '' }]; // Default ID is 1 for the first item

        if (value && typeof value === 'string') {
            try {
                const parsedValue = JSON.parse(value);
                if (Array.isArray(parsedValue) && parsedValue.length > 0) {
                    itemsToSet = parsedValue;
                }
            } catch (error) {
                console.error('Failed to parse Statistical Info JSON:', error);
            }
        }
        setStatItems(itemsToSet);
    }, [value]);

    const handleAddItem = () => {
        let newId = 1;
        if (statItems.length > 0) {
            const maxId = Math.max(...statItems.map(item => Number(item.id) || 0)); // Ensure IDs are numbers for Math.max
            newId = maxId + 1;
        }
        // Add new item with the calculated ID
        setStatItems([...statItems, { id: newId, title: '', count: '', icon: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = statItems.filter((_, i) => i !== index);
        setStatItems(newItems);
        onChange(newItems); // Propagate changes up
    };

    const handleChangeItem = (index: number, field: keyof Omit<StatItem, 'id'>, fieldValue: string) => {
        // Cast field to keyof StatItem if necessary, or adjust types
        // For simplicity, we'll assume the caller won't call this for 'id'.
        // The 'id' field is read-only, so no onChange handler should be attached to its input that calls this.
        // However, to be safe, we can guard:
        // if (field === 'id') return; // This check is not strictly necessary if Omit is used and no onChange on ID input

        let processedValue: string | number = fieldValue;
        if (field === 'count') { // Only process 'count'
            if (fieldValue === '') {
                processedValue = '';
            } else {
                const num = parseInt(fieldValue, 10);
                if (!isNaN(num)) {
                    processedValue = num;
                } else {
                    processedValue = fieldValue;
                }
            }
        }

        const newItems = statItems.map((item, i) => {
            if (i === index) {
                // Casting field back to keyof StatItem for the object spread
                return { ...item, [field as keyof StatItem]: processedValue };
            }
            return item;
        });
        setStatItems(newItems);
    };

    // Call onChange when statItems changes internally due to add/remove/initial load with actual data
    useEffect(() => {
        onChange(statItems);
    }, [statItems, onChange]);

    const handleModalIconSelect = (selectedIconClass: string) => {
        if (editingIconIndex !== null) {
            const newItems = statItems.map((item, i) =>
                i === editingIconIndex ? { ...item, icon: selectedIconClass } : item
            );
            setStatItems(newItems);
            // The useEffect for onChange(statItems) will propagate this change.
        }
        setEditingIconIndex(null); // Reset after selection
    };

    return (
        <div>
            {statItems.map((item, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>ID:</label>
                        <input
                            type="number" // Display as number
                            value={item.id} // item.id is now number
                            readOnly // Make it read-only
                            style={{ width: '100%', marginBottom: '5px', }} // Style to indicate read-only
                        />
                    </div>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleChangeItem(index, 'title', e.target.value)}
                            style={{ width: '100%', marginBottom: '5px' }}
                        />
                    </div>
                    <div>
                        <label>Count:</label>
                        <input
                            type="text" // Use text for count; can be number or string. Use type="number" if strict.
                            value={item.count}
                            onChange={(e) => handleChangeItem(index, 'count', e.target.value)}
                            style={{ width: '100%', marginBottom: '5px' }}
                        />
                    </div>
                    <div>
                        <label>Icon:</label>
                        <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => handleChangeItem(index, 'icon', e.target.value)}
                            style={{ width: 'calc(100% - 120px)', marginBottom: '5px', marginRight: '5px', display: 'inline-block' }} // Adjust width
                            placeholder="Icon class (e.g., fa fa-book)" // Updated placeholder
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                                setEditingIconIndex(index);
                                setIsIconModalOpen(true);
                            }}
                            style={{ width: '110px', display: 'inline-block' }} // Adjust width
                        >
                            Browse Icons
                        </button>
                        {item.icon && ( // Only show preview if icon field is not empty
                            <div style={{ marginTop: '5px', fontSize: '24px' }}> {/* Basic styling for preview visibility */}
                                Preview: <i className={item.icon}></i>
                            </div>
                        )}
                    </div>
                    <button type="button" className="btn  btn-sm btn-danger btn-sm" onClick={() => handleRemoveItem(index)}>Remove</button>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-primary" onClick={handleAddItem}>Add Stat Item</button>
            {isIconModalOpen && (
                <IconPickerModal
                    isOpen={isIconModalOpen}
                    onClose={() => {
                        setIsIconModalOpen(false);
                        setEditingIconIndex(null); // Reset index when closing
                    }}
                    iconClasses={FONT_AWESOME_ICONS} // Assuming FONT_AWESOME_ICONS is defined in this file
                    onIconSelect={handleModalIconSelect}
                />
            )}
        </div>
    );
};

export default StatisticalInfoEditor;
