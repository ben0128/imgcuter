import React from "react";
import type { CropData } from "../types/crop";

interface CropHistoryPanelProps {
    history: CropData[];
    onClearHistory: () => void;
    onDeleteHistory: (index: number) => void;
}

const CropHistoryPanel: React.FC<CropHistoryPanelProps> = React.memo(
    ({ history, onClearHistory, onDeleteHistory }) => {
        return (
            <div>
                <h2>Crop History</h2>
                <button
                    type="button"
                    onClick={onClearHistory}
                    style={{ marginBottom: "10px" }}
                >
                    Clear History
                </button>
                {history.length === 0 ? (
                    <p>No crop history yet.</p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                        }}
                    >
                        {history.map((item, index) => (
                            <div
                                key={item.timestamp}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}
                            >
                                <img
                                    src={item.croppedImage}
                                    alt="Cropped History"
                                    style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                    }}
                                />
                                <p>
                                    Size: {item.cropArea.width}x
                                    {item.cropArea.height}
                                </p>
                                <p>
                                    Time:{" "}
                                    {new Date(
                                        item.timestamp,
                                    ).toLocaleTimeString()}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            item.croppedImage,
                                        )
                                    }
                                >
                                    CopyUrl
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDeleteHistory(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    },
);

export default CropHistoryPanel;
