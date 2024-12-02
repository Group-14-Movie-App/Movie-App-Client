import React from 'react';

const citiesInFinland = [
  'Espoo',
  'Helsinki',
  'Vantaa',
  'Jyväskylä',
  'Kuopio',
  'Lahti',
  'Lappeenranta',
  'Oulu',
  'Pori',
  'Tampere',
  'Turku',
  'Raisio',
];

function CitySelector({ value, onChange }) {
  return (
    <select id="city" name="city" value={value} onChange={onChange} required>
      <option value="">Select the nearest city</option>
      {citiesInFinland.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}

export default CitySelector;
