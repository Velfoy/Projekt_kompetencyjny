import React from 'react';
import ReactDOM from 'react-dom';

import '@styles/components/Overlay.css'; 

interface OverlayProps {
  message: string;
}

const Overlay: React.FC<OverlayProps> = ({ message }) => {
  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  return ReactDOM.createPortal(
    <div className="global_overlay">
      <div className="overlay_message">{message}</div>
    </div>,
    overlayRoot
  );
};

export default Overlay;
