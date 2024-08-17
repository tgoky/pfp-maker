import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

const PFPMaker = () => {
  const [canvas, setCanvas] = useState(null);

  // React Spring animations for glowing effects
  const fileInputStyle = useSpring({
    to: { opacity: 1, transform: 'scale(1)', textShadow: '0 0 8px rgba(255,255,255,0.8)' },
    from: { opacity: 0, transform: 'scale(0.9)', textShadow: '0 0 0 rgba(255,255,255,0)' },
    config: { tension: 300, friction: 20 },
  });

  const containerStyle = useSpring({
    to: { opacity: 1, transform: 'translateY(0)' },
    from: { opacity: 0, transform: 'translateY(-15px)' },
    config: { tension: 300, friction: 20 },
  });

  const headerStyle = useSpring({
    to: { opacity: 1, textShadow: '0 0 12px rgba(0, 255, 255, 0.8)' },
    from: { opacity: 0, textShadow: '0 0 0 rgba(0, 255, 255, 0)' },
    config: { tension: 300, friction: 20 },
  });

  // Animation for asset image
  const [hovered, setHovered] = useState(false);
  const assetImageStyle = useSpring({
    transform: hovered ? 'scale(1.1)' : 'scale(1)',
    boxShadow: hovered
      ? '0 0 12px rgba(255, 255, 255, 0.8)'
      : '0 0 8px rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    backgroundColor: '#0d324b',
    transition: 'background-color 0.3s ease',
    config: { tension: 300, friction: 15 },
  });

  useEffect(() => {
    const canvasInstance = new fabric.Canvas('pFPcanvas', {
      width: 400,
      height: 400,
    });

    setCanvas(canvasInstance);

    // Create a marble-like gradient pattern
    const marbleCanvas = document.createElement('canvas');
    marbleCanvas.width = 400;
    marbleCanvas.height = 400;
    const marbleCtx = marbleCanvas.getContext('2d');

    const gradient = marbleCtx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, '#b0b0b0');
    gradient.addColorStop(0.5, '#e0e0e0');
    gradient.addColorStop(1, '#b0b0b0');

    marbleCtx.fillStyle = gradient;
    marbleCtx.fillRect(0, 0, 400, 400);

    const pattern = new fabric.Pattern({
      source: marbleCanvas,
      repeat: 'repeat',
    });

    canvasInstance.setBackgroundColor(
      pattern,
      canvasInstance.renderAll.bind(canvasInstance)
    );

    // Handle image upload
    const handleImageUpload = (e) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        fabric.Image.fromURL(event.target.result, (img) => {
          img.scaleToWidth(240);
          canvasInstance.centerObject(img);
          canvasInstance.add(img);
          canvasInstance.setActiveObject(img);
          canvasInstance.renderAll();
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const imageUploadInput = document.getElementById('imageUpload');
    imageUploadInput.addEventListener('change', handleImageUpload);

    return () => {
      imageUploadInput.removeEventListener('change', handleImageUpload);
    };
  }, []);

  const downloadCanvas = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'mypfp.png';
      link.click();
    }
  };

  const handleAssetClick = () => {
    const imagePath = '/gear.PNG';
    if (canvas) {
      fabric.Image.fromURL(imagePath, (img) => {
        img.scaleToWidth(100);
        canvas.centerObject(img);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    }
  };

  const moveSelectedObject = (direction) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      switch (direction) {
        case 'up':
          activeObject.top -= 10;
          break;
        case 'down':
          activeObject.top += 10;
          break;
        case 'left':
          activeObject.left -= 10;
          break;
        case 'right':
          activeObject.left += 10;
          break;
        default:
          break;
      }
      activeObject.setCoords();
      canvas.renderAll();
    }
  };

  return (
    
    <animated.div style={{ ...containerStyle }} className="pfpmaker-container">
      <div style={{ width:'100%', backgroundColor: 'black' , height: '100%', marginTop: '150px', marginBottom: '150px' }}>
      <div className="canvas-card">
        <canvas id="pFPcanvas" className="canvas"></canvas>
        <div className="canvas-controls">
          <animated.div style={fileInputStyle}>
            <input type="file" id="imageUpload" className="file-input" />
          </animated.div>
          <button className="download-button" onClick={downloadCanvas}>
            Download PFP
          </button>
        </div>
        {/* My Assets Section */}
        <div style={{backgroundColor: 'blue', marginTop: '-478px' , marginBottom: '50px', width: '34%', marginLeft: '700px'}}>
        <div className="card-container">
          <h2 className="assets-header">My Assets</h2>
          <div className="tiles-container">
            <div
              className="tile"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src="/gear.PNG"
                alt="Assets"
                className="assets-image"
                style={assetImageStyle}
                onClick={handleAssetClick}
              />
            </div>
          </div>
        </div>
        {/* Controls Section */}
        <div className="controls-container">
          <h2>Controls</h2>
          <div className="arrow-buttons">
            <button className="arrow-button" onClick={() => moveSelectedObject('up')}>
              Up
            </button>
            <div className="horizontal-arrows">
              <button className="arrow-button" onClick={() => moveSelectedObject('left')}>
                Left
              </button>
              <button className="arrow-button" onClick={() => moveSelectedObject('right')}>
                Right
              </button>
            </div>
            <button className="arrow-button" onClick={() => moveSelectedObject('down')}>
              Down
            </button>
             {/* New Box Section */}
     
          </div>
          </div>
        </div>
        </div>
      </div>
    </animated.div>
  );
};

export default PFPMaker;
