import React, { useCallback, useState } from "react";
import type { Area } from "react-easy-crop";
import type { CropData } from "../types/crop";
import { cropImage } from "../utils/cropImage";
import ImageCropper from "./Cropper";

interface ImageCropperPanelProps {
    onCropComplete: (cropData: CropData) => void;
}

const ImageCropperPanel: React.FC<ImageCropperPanelProps> = React.memo(
    ({ onCropComplete }) => {
        const [imageUrl, setImageUrl] = useState<string>("");
        const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
            null,
        );
        const [cropDimensions, setCropDimensions] = useState<{
            width: number;
            height: number;
        } | null>(null);
        const [croppedImage, setCroppedImage] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);

        const handleImageLoad = useCallback(() => {
            setError(null);
            setCroppedImage(null);
        }, []);

        const handleFileChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        setImageUrl(reader.result as string);
                        handleImageLoad();
                    });
                    reader.readAsDataURL(file);
                }
            },
            [handleImageLoad],
        );

        const handleCropComplete = useCallback(
            (_croppedArea: Area, croppedAreaPixels: Area) => {
                setCroppedAreaPixels(croppedAreaPixels);
                setCropDimensions({
                    width: croppedAreaPixels.width,
                    height: croppedAreaPixels.height,
                });
            },
            [],
        );

        const handleCropImage = async () => {
            if (!imageUrl || !croppedAreaPixels) return;
            try {
                const croppedImageBase64 = await cropImage(
                    imageUrl,
                    croppedAreaPixels,
                );
                setCroppedImage(croppedImageBase64);

                const cropData: CropData = {
                    originalUrl: imageUrl,
                    cropArea: croppedAreaPixels,
                    croppedImage: croppedImageBase64,
                    timestamp: Date.now(),
                };

                onCropComplete(cropData);
            } catch (_err) {
                setError("Failed to crop image.");
            }
        };

        return (
            <div>
                <h1>Image Cropper</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter Image URL"
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ width: "300px", marginRight: "10px" }}
                    />
                    <button
                        type="button"
                        onClick={handleImageLoad}
                        style={{ marginRight: "10px" }}
                    >
                        Load Image
                    </button>
                    <span>OR</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginLeft: "10px" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {imageUrl && (
                    <>
                        <ImageCropper
                            image={imageUrl}
                            onCropChange={() => {}}
                            onCropComplete={handleCropComplete}
                            onZoomChange={() => {}}
                        />
                        <button
                            type="button"
                            onClick={handleCropImage}
                            style={{ marginTop: "10px" }}
                        >
                            Crop Image
                        </button>
                        {cropDimensions && (
                            <p>
                                Crop Size: {cropDimensions.width}px x{" "}
                                {cropDimensions.height}px
                            </p>
                        )}
                    </>
                )}
                {croppedImage && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>Cropped Image</h2>
                        <img
                            src={croppedImage}
                            alt="Cropped"
                            style={{ maxWidth: "100%" }}
                        />
                        <br />
                        <a href={croppedImage} download="cropped-image.jpg">
                            Download Cropped Image
                        </a>
                    </div>
                )}
            </div>
        );
    },
);

export default ImageCropperPanel;
