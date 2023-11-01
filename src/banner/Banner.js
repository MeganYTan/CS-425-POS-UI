import React from 'react';

function Banner({ message, type }) {
  const bannerStyle = {
    backgroundColor: type === 'success' ? 'green' : 'red',
    color: 'white',
    padding: '10px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1000,
  };

  return (
    <div style={bannerStyle}>
      {message}
    </div>
  );
}

export default Banner;
