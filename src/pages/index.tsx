import React, { useState, useCallback } from 'react';
import ImageCropper from '../components/Cropper';
import { cropImage } from '../utils/cropImage';
import { CropData } from '../types/crop';
import { Area } from 'react-easy-crop';

const IndexPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropDimensions, setCropDimensions] = useState<{ width: number; height: number } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = () => {
    setError(null);
    setCroppedImage(null);
  };

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setCropDimensions({ width: croppedAreaPixels.width, height: croppedAreaPixels.height });
  }, []);

  const handleCropImage = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    try {
      const croppedImageBase64 = await cropImage(imageUrl, croppedAreaPixels);
      setCroppedImage(croppedImageBase64);

      const cropData: CropData = {
        originalUrl: imageUrl,
        cropArea: croppedAreaPixels,
        croppedImage: croppedImageBase64,
        timestamp: Date.now(),
      };

      const history = JSON.parse(localStorage.getItem('crop_history') || '[]');
      history.push(cropData);
      localStorage.setItem('crop_history', JSON.stringify(history));
    } catch (err) {
      setError('Failed to crop image.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Image Cropper</h1>
      <input
        type="text"
        placeholder="Enter Image URL"
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleImageLoad}>Load Image</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <>
          <ImageCropper
            image={imageUrl}
            onCropChange={() => {}}
            onCropComplete={handleCropComplete}
            onZoomChange={() => {}}
          />
          <button onClick={handleCropImage} style={{ marginTop: '10px' }}>
            Crop Image
          </button>
          {cropDimensions && (
            <p>
              Crop Size: {cropDimensions.width}px x {cropDimensions.height}px
            </p>
          )}
        </>
      )}
      {croppedImage && (
        <div style={{ marginTop: '20px' }}>
          <h2>Cropped Image</h2>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
          <br />
          <a href={croppedImage} download="cropped-image.jpg">
            Download Cropped Image
          </a>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
