import React, { useEffect } from 'react';
import { fabric } from 'fabric';

const PFPMaker = () => {
  useEffect(() => {
    const canvas = new fabric.Canvas('pFPcanvas', {
      width: 500,
      height: 500,
      backgroundColor: '#ddd'
    });

    // Example to add text
    const text = new fabric.Text('Hello, world!', {
      left: 100,
      top: 100,
      fill: '#000',
      fontSize: 30,
    });
    canvas.add(text);

    // Example to handle image upload
    document.getElementById('imageUpload').addEventListener('change', (e) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        fabric.Image.fromURL(event.target.result, (img) => {
          img.scaleToWidth(300);
          canvas.centerObject(img);
          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }, []);

  return (
    <div>
      <input type="file" id="imageUpload" />
      <canvas id="pFPcanvas"></canvas>
    </div>
  );
};

export default PFPMaker;
