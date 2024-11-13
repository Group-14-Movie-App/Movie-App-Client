import React, { useState } from 'react';

function FilterShowtimes({ onFilter }) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onFilter(date); // Call the filter function with the selected date
  };

  return (
    <div className="mb-4">
      <label htmlFor="showtimeDate" className="form-label"><strong>Filter by Showtime Date:</strong></label>
      <input 
        type="date" 
        id="showtimeDate" 
        className="form-control" 
        value={selectedDate} 
        onChange={handleDateChange} 
      />
    </div>
  );
}

export default FilterShowtimes;
