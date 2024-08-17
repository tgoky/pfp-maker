import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useSpring, animated } from '@react-spring/web';
import './App.css';

import { MdOutlineArrowDropDown, MdOutlineArrowDropUp, MdOutlineArrowLeft, MdOutlineArrowRight } from 'react-icons/md';



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

  // State for scale values
  const [profilePictureValue, setProfilePictureValue] = useState(50);
  const [laserEyesValue, setLaserEyesValue] = useState(50);

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
      <div style={{ width: '100%', backgroundColor: 'black', height: '100%', marginTop: '150px', marginBottom: '150px', marginLeft: '30px', marginRight: '30px' }}>
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
          <div style={{ marginTop: '200px', marginBottom: '150px', width: '34%', marginLeft: '700px', padding: '20px', position: 'fixed', top: '5px', bottom: '40px' }}>
            <div className="card-container">
              <h2 className="assets-header">My Assets</h2>
              <h1 style={{ marginLeft: '260px', position: 'relative', top: '-55px', color: 'aquamarine' }}>scale</h1>
  
              <div className="tiles-container">
                <div className="tile" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  <img
                    src="/gear.PNG"
                    alt="Assets"
                    className="assets-image"
                    style={assetImageStyle}
                    onClick={handleAssetClick}
                  />
                </div>
              </div>
  
              {/* Scaler Section */}
              <div className="scaler">
                <div className="scale-item">
                  <label htmlFor="profile-picture-scale" className="scale-label">Pfp Profile:</label>
                  <button className="scale-button" onClick={() => setProfilePictureValue(prev => Math.max(0, prev - 1))}>-</button>
                  <input
                    type="range"
                    id="profile-picture-scale"
                    className="scale-slider"
                    min="0"
                    max="100"
                    value={profilePictureValue}
                    onChange={(e) => setProfilePictureValue(e.target.value)}
                  />
                  <button className="scale-button" onClick={() => setProfilePictureValue(prev => Math.min(100, prev + 1))}>+</button>
                </div>
                <div className="scale-item">
                  <label htmlFor="laser-eyes-scale" className="scale-label">Laser Eyes:</label>
                  <button className="scale-button" onClick={() => setLaserEyesValue(prev => Math.max(0, prev - 1))}>-</button>
                  <input
                    type="range"
                    id="laser-eyes-scale"
                    className="scale-slider"
                    min="0"
                    max="100"
                    value={laserEyesValue}
                    onChange={(e) => setLaserEyesValue(e.target.value)}
                  />
                  <button className="scale-button" onClick={() => setLaserEyesValue(prev => Math.min(100, prev + 1))}>+</button>
                </div>
              </div>
  
              {/* Controls Section */}
              <div className="controls-container">
                <h2>Controls</h2>
                <div>
                  <div className="arrow-buttons">
                    <button className="arrow-button up" onClick={() => moveSelectedObject('up')}>
                      <MdOutlineArrowDropUp />
                    </button>
                    <div className="horizontal-arrows">
                      <button className="arrow-button left" onClick={() => moveSelectedObject('left')}>
                        <MdOutlineArrowLeft />
                      </button>
                      <button className="arrow-button right" onClick={() => moveSelectedObject('right')}>
                        <MdOutlineArrowRight />
                      </button>
                    </div>
                    <button className="arrow-button down" onClick={() => moveSelectedObject('down')}>
                      <MdOutlineArrowDropDown />
                    </button>
                  </div>
                </div>
  
                {/* Move Container */}
                <div className="move-container">
                  <h1 className="move-header">MOVE</h1> {/* Centered Header */}
                  <div className="move-labels">
                    <label htmlFor="picture-option" className="move-label">
                      <input type="radio" id="picture-option" name="move-option" />
                      Picture
                    </label>
                    <label htmlFor="laser-eyes-option" className="move-label">
                      <input type="radio" id="laser-eyes-option" name="move-option" />
                      Laser Eyes
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </animated.div>
    );
  };
  

export default PFPMaker;
