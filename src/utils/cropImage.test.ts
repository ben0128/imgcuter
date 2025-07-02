import { beforeEach, describe, expect, it, vi } from "vitest";
import { cropImage } from "./cropImage";

describe("cropImage", () => {
    let mockImage: HTMLImageElement;
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        mockImage = {
            src: "",
            crossOrigin: "",
            onload: null,
            onerror: null,
        } as unknown as HTMLImageElement;

        mockContext = {
            drawImage: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn(() => mockContext),
            toDataURL: vi.fn(() => "data:image/jpeg;base64,mocked_image_data"),
        } as unknown as HTMLCanvasElement;

        vi.stubGlobal(
            "Image",
            vi.fn(() => mockImage),
        );
        vi.spyOn(document, "createElement").mockReturnValue(mockCanvas);
    });

    it("should crop the image successfully", async () => {
        const imageUrl = "http://example.com/image.jpg";
        const cropArea = { x: 10, y: 20, width: 100, height: 50 };

        const promise = cropImage(imageUrl, cropArea);

        // Simulate image loading
        mockImage.onload?.(new Event("load"));

        const result = await promise;

        expect(Image).toHaveBeenCalledWith();
        expect(mockImage.src).toBe(imageUrl);
        expect(mockImage.crossOrigin).toBe("anonymous");
        expect(document.createElement).toHaveBeenCalledWith("canvas");
        expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
        expect(mockCanvas.width).toBe(cropArea.width);
        expect(mockCanvas.height).toBe(cropArea.height);
        expect(mockContext.drawImage).toHaveBeenCalledWith(
            mockImage,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            cropArea.width,
            cropArea.height,
        );
        expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/jpeg");
        expect(result).toBe("data:image/jpeg;base64,mocked_image_data");
    });

    it("should reject if canvas context cannot be obtained", async () => {
        mockCanvas.getContext = vi.fn(() => null);

        const imageUrl = "http://example.com/image.jpg";
        const cropArea = { x: 10, y: 20, width: 100, height: 50 };

        const promise = cropImage(imageUrl, cropArea);

        // Simulate image loading
        mockImage.onload?.(new Event("load"));

        await expect(promise).rejects.toThrow("Failed to get canvas context");
    });

    it("should reject if image loading fails", async () => {
        const imageUrl = "http://example.com/image.jpg";
        const cropArea = { x: 10, y: 20, width: 100, height: 50 };

        const promise = cropImage(imageUrl, cropArea);

        // Simulate image loading error
        mockImage.onerror?.(new Event("error"));

        await expect(promise).rejects.toThrow();
    });
});
