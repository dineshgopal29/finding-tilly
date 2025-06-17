import React from 'react';
import '../styles/LocationDisplay.css';

const LocationDisplay = ({ location, locationKey }) => {
  // Map of location keys to emoji representations
  const locationEmojis = {
    home: '🏠',
    garden: '🌺',
    kitchen: '🍽️',
    bedroom: '🛏️',
    dining_room: '🍴',
    closet: '👕',
    playground: '🛝',
    treehouse: '🌳',
    tilly: '🧸'  // Tilly is now a teddy bear
  };

  // Use the emoji from props if available, otherwise use from the map
  const emoji = location.emoji || locationEmojis[locationKey] || '📍';

  return (
    <div className="location-display">
      <div className="location-image-container">
        <div className="location-emoji">
          {emoji}
        </div>
        <h3 className="location-name">{location.name}</h3>
      </div>
    </div>
  );
};

export default LocationDisplay;
