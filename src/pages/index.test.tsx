import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IndexPage from "./index";

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock child components
vi.mock("../components/ImageCropperPanel", () => ({
    default: vi.fn(({ onCropComplete }) => (
        <div data-testid="image-cropper-panel">
            <button
                type="button"
                onClick={() =>
                    onCropComplete({
                        originalUrl: "http://example.com/image.jpg",
                        cropArea: { x: 0, y: 0, width: 100, height: 100 },
                        croppedImage: "data:image/jpeg;base64,test",
                        timestamp: Date.now(),
                    })
                }
            >
                Simulate Crop Complete
            </button>
        </div>
    )),
}));

vi.mock("../components/CropHistoryPanel", () => ({
    default: vi.fn(({ history, onClearHistory, onDeleteHistory }) => (
        <div data-testid="crop-history-panel">
            <span>History Count: {history.length}</span>
            <button type="button" onClick={onClearHistory}>
                Clear History
            </button>
            <button type="button" onClick={() => onDeleteHistory(0)}>
                Delete First
            </button>
        </div>
    )),
}));

describe("IndexPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    it("renders both panels", () => {
        render(<IndexPage />);

        expect(screen.getByTestId("image-cropper-panel")).toBeInTheDocument();
        expect(screen.getByTestId("crop-history-panel")).toBeInTheDocument();
    });

    it("loads history from localStorage on mount", () => {
        const mockHistory = [
            {
                originalUrl: "http://example.com/image.jpg",
                cropArea: { x: 0, y: 0, width: 100, height: 100 },
                croppedImage: "data:image/jpeg;base64,test",
                timestamp: Date.now(),
            },
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

        render(<IndexPage />);

        expect(screen.getByText("History Count: 1")).toBeInTheDocument();
    });

    it("adds new crop to history", async () => {
        render(<IndexPage />);

        fireEvent.click(screen.getByText("Simulate Crop Complete"));

        await waitFor(() => {
            expect(screen.getByText("History Count: 1")).toBeInTheDocument();
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
    });

    it("clears history when clear button is clicked", () => {
        render(<IndexPage />);

        fireEvent.click(screen.getByText("Clear History"));

        expect(screen.getByText("History Count: 0")).toBeInTheDocument();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith(
            "crop_history",
        );
    });

    it("deletes specific item from history", () => {
        const mockHistory = [
            {
                originalUrl: "http://example.com/image1.jpg",
                cropArea: { x: 0, y: 0, width: 100, height: 100 },
                croppedImage: "data:image/jpeg;base64,test1",
                timestamp: Date.now(),
            },
            {
                originalUrl: "http://example.com/image2.jpg",
                cropArea: { x: 0, y: 0, width: 200, height: 200 },
                croppedImage: "data:image/jpeg;base64,test2",
                timestamp: Date.now(),
            },
        ];

        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

        render(<IndexPage />);

        expect(screen.getByText("History Count: 2")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Delete First"));

        expect(screen.getByText("History Count: 1")).toBeInTheDocument();
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("handles invalid localStorage data gracefully", () => {
        localStorageMock.getItem.mockReturnValue("invalid json");

        render(<IndexPage />);

        expect(screen.getByText("History Count: 0")).toBeInTheDocument();
    });

    it("maintains history order when adding new items", async () => {
        const initialHistory = [
            {
                originalUrl: "http://example.com/image1.jpg",
                cropArea: { x: 0, y: 0, width: 100, height: 100 },
                croppedImage: "data:image/jpeg;base64,test1",
                timestamp: Date.now() - 1000,
            },
        ];

        localStorageMock.getItem.mockReturnValue(
            JSON.stringify(initialHistory),
        );

        render(<IndexPage />);

        expect(screen.getByText("History Count: 1")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Simulate Crop Complete"));

        await waitFor(() => {
            expect(screen.getByText("History Count: 2")).toBeInTheDocument();
        });
    });
});
