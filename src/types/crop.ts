export interface CropData {
    originalUrl: string;
    cropArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    croppedImage: string;
    timestamp: number;
}
