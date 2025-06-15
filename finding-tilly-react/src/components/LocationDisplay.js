import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import '../styles/LocationDisplay.css';

const LocationDisplay = () => {
  const { gameState, formatLocationName } = useGameContext();
  const currentLocation = gameState.currentLocation;
  
  // Create a placeholder colored div instead of using images
  const getColorForLocation = (location) => {
    const colors = {
      home: '#FFD700',        // Gold
      garden: '#90EE90',      // Light Green
      kitchen: '#ADD8E6',     // Light Blue
      bedroom: '#FFC0CB',     // Pink
      playground: '#FF7F50',  // Coral
      dining_room: '#BA55D3', // Medium Orchid
      closet: '#F0E68C',      // Khaki
      treehouse: '#8FBC8F'    // Dark Sea Green
    };
    
    return colors[location] || '#CCCCCC';
  };
  
  // Get emoji for location
  const getEmojiForLocation = (location) => {
    const emojis = {
      home: '🏠',
      garden: '🌷',
      kitchen: '🍳',
      bedroom: '🛏️',
      playground: '🎢',
      dining_room: '🍽️',
      closet: '👚',
      treehouse: '🌳'
    };
    
    return emojis[location] || '📍';
  };
  
  return (
    <div className="location-image-container">
      <div 
        className="location-image-placeholder"
        style={{
          backgroundColor: getColorForLocation(currentLocation)
        }}
      >
        <div className="location-emoji">{getEmojiForLocation(currentLocation)}</div>
        <div className="location-name">{formatLocationName ? formatLocationName(currentLocation) : currentLocation}</div>
      </div>
    </div>
  );
};

export default LocationDisplay;
