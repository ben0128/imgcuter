import type React from "react";
import { useCallback, useEffect, useState } from "react";
import CropHistoryPanel from "../components/CropHistoryPanel";
import ImageCropperPanel from "../components/ImageCropperPanel";
import type { CropData } from "../types/crop";

const IndexPage: React.FC = () => {
    const [history, setHistory] = useState<CropData[]>([]);

    // Load history from localStorage on component mount
    useEffect(() => {
        const storedHistory = localStorage.getItem("crop_history");
        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory));
            } catch (error) {
                console.error("Failed to parse stored history:", error);
                localStorage.removeItem("crop_history");
                setHistory([]);
            }
        }
    }, []);

    const handleClearHistory = useCallback(() => {
        localStorage.removeItem("crop_history");
        setHistory([]);
    }, []);

    const handleDeleteHistory = useCallback(
        (index: number) => {
            const updatedHistory = [...history];
            updatedHistory.splice(index, 1);
            setHistory(updatedHistory);
            localStorage.setItem(
                "crop_history",
                JSON.stringify(updatedHistory),
            );
        },
        [history],
    );

    const handleCropComplete = useCallback(
        (cropData: CropData) => {
            const updatedHistory = [...history, cropData];
            setHistory(updatedHistory);
            localStorage.setItem(
                "crop_history",
                JSON.stringify(updatedHistory),
            );
        },
        [history],
    );

    return (
        <div style={{ display: "flex", padding: "20px" }}>
            <div style={{ flex: 1, marginRight: "20px" }}>
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
