import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarComponentProps {
  // You can add any props you might need here
}

const CalendarComponent: React.FC<CalendarComponentProps> = () => {
  const [date, setDate] = useState<Date | Date[] | null>(new Date());

  const onChange = (newDate: Date | Date[] | null) => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar
        onChange={onChange as any} // Type assertion to handle potential array type for range selection
        value={date}
      />
    </div>
  );
};

export default CalendarComponent;
