import React, { useState, useEffect, useCallback } from 'react';
import ImageCropperPanel from '../components/ImageCropperPanel';
import CropHistoryPanel from '../components/CropHistoryPanel';
import { CropData } from '../types/crop';

const IndexPage: React.FC = () => {
  const [history, setHistory] = useState<CropData[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('crop_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    localStorage.removeItem('crop_history');
    setHistory([]);
  }, []);

  const handleDeleteHistory = useCallback((index: number) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem('crop_history', JSON.stringify(updatedHistory));
  }, [history]);

  const handleCropComplete = useCallback((cropData: CropData) => {
    const updatedHistory = [...history, cropData];
    setHistory(updatedHistory);
    localStorage.setItem('crop_history', JSON.stringify(updatedHistory));
  }, [history]);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <ImageCropperPanel onCropComplete={handleCropComplete} />
      </div>
      <div style={{ flex: 1 }}>
        <CropHistoryPanel 
          history={history} 
          onClearHistory={handleClearHistory}
          onDeleteHistory={handleDeleteHistory}
        />
      </div>
    </div>
  );
};

export default IndexPage;
