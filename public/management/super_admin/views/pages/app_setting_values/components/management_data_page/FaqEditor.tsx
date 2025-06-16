import React, { useState, useEffect } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  url: string;
}

interface FaqEditorProps {
  value: string; // JSON string of FaqItem[]
  onChange: (data: FaqItem[]) => void;
}

const FaqEditor: React.FC<FaqEditorProps> = ({ value, onChange }) => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    let itemsToSet: FaqItem[] = [{ question: '', answer: '', url: '' }]; // Default to one empty item

    if (value && typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue) && parsedValue.length > 0) {
          itemsToSet = parsedValue;
        }
        // If parsedValue is an empty array, it will correctly use the default itemsToSet (one empty item)
        // If parsedValue is not an array, it will also use the default.
      } catch (error) {
        console.error('Failed to parse FAQ JSON:', error);
        // On error, itemsToSet remains the default (one empty item)
      }
    }
    // If value is empty or not a string, itemsToSet also remains the default.

    setFaqItems(itemsToSet);
  }, [value]);

  const handleAddItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '', url: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = faqItems.filter((_, i) => i !== index);
    setFaqItems(newItems);
    onChange(newItems);
  };

  const handleChangeItem = (index: number, field: keyof FaqItem, fieldValue: string) => {
    const newItems = faqItems.map((item, i) => 
      i === index ? { ...item, [field]: fieldValue } : item
    );
    setFaqItems(newItems);
    onChange(newItems);
  };

  return (
    <div>
      {faqItems.map((item, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label>Question:</label>
            <input 
              type="text" 
              value={item.question} 
              onChange={(e) => handleChangeItem(index, 'question', e.target.value)}
              style={{ width: '100%', marginBottom: '5px' }}
            />
          </div>
          <div>
            <label>Answer:</label>
            <textarea 
              value={item.answer} 
              onChange={(e) => handleChangeItem(index, 'answer', e.target.value)}
              style={{ width: '100%', marginBottom: '5px' }}
            />
          </div>
          <div>
            <label>URL (Optional):</label>
            <input 
              type="text" 
              value={item.url} 
              onChange={(e) => handleChangeItem(index, 'url', e.target.value)}
              style={{ width: '100%', marginBottom: '5px' }}
            />
          </div>
          <button type="button" className="btn  btn-sm btn-danger btn-sm" onClick={() => handleRemoveItem(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-primary" onClick={handleAddItem}>Add FAQ Item</button>
    </div>
  );
};

export default FaqEditor;
