import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

interface CropperProps {
  image: string;
  onCropChange: (crop: { x: number; y: number }) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onZoomChange: (zoom: number) => void;
}

const ImageCropper: React.FC<CropperProps> = ({ image, onCropChange, onCropComplete, onZoomChange }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
    onCropChange(location);
  }, [onCropChange]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    onZoomChange(newZoom);
  }, [onZoomChange]);

  return (
    <div data-testid="cropper-component" style={{ position: 'relative', width: '100%', height: 400 }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        
        onCropChange={handleCropChange}
        onCropComplete={onCropComplete}
        onZoomChange={handleZoomChange}
      />
    </div>
  );
};

export default ImageCropper;
