import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cropImage } from "../utils/cropImage";
import ImageCropperPanel from "./ImageCropperPanel";

// Mock the cropImage utility
vi.mock("../utils/cropImage");
vi.mocked(cropImage).mockResolvedValue("data:image/jpeg;base64,cropped");

// Mock the ImageCropper component
vi.mock("./Cropper", () => ({
    default: vi.fn(({ onCropComplete }) => (
        <div data-testid="image-cropper">
            <button
                type="button"
                onClick={() =>
                    onCropComplete(
                        { x: 0, y: 0 },
                        { x: 10, y: 10, width: 100, height: 100 },
                    )
                }
            >
                Simulate Crop Complete
            </button>
        </div>
    )),
}));

describe("ImageCropperPanel", () => {
    const mockOnCropComplete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the component with input field", () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        expect(screen.getByText("Image Cropper")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Enter Image URL"),
        ).toBeInTheDocument();
        expect(screen.getByText("Load Image")).toBeInTheDocument();
    });

    it("updates image URL when input changes", () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const input = screen.getByPlaceholderText("Enter Image URL");
        fireEvent.change(input, {
            target: { value: "http://example.com/image.jpg" },
        });

        expect(input).toHaveValue("http://example.com/image.jpg");
    });

    it("shows cropper when image URL is provided", () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const input = screen.getByPlaceholderText("Enter Image URL");
        fireEvent.change(input, {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.click(screen.getByText("Load Image"));

        expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
        expect(screen.getByText("Crop Image")).toBeInTheDocument();
    });

    it("crops image successfully", async () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const input = screen.getByPlaceholderText("Enter Image URL");
        fireEvent.change(input, {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.click(screen.getByText("Load Image"));

        // Simulate crop completion
        fireEvent.click(screen.getByText("Simulate Crop Complete"));

        // Click crop button
        fireEvent.click(screen.getByText("Crop Image"));

        await waitFor(() => {
            expect(cropImage).toHaveBeenCalledWith(
                "http://example.com/image.jpg",
                { x: 10, y: 10, width: 100, height: 100 },
            );
            expect(mockOnCropComplete).toHaveBeenCalled();
        });
    });

    it("shows crop dimensions when crop area is set", () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const input = screen.getByPlaceholderText("Enter Image URL");
        fireEvent.change(input, {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.click(screen.getByText("Load Image"));

        // Simulate crop completion
        fireEvent.click(screen.getByText("Simulate Crop Complete"));

        expect(
            screen.getByText("Crop Size: 100px x 100px"),
        ).toBeInTheDocument();
    });

    it("shows error when crop fails", async () => {
        vi.mocked(cropImage).mockRejectedValue(new Error("Crop failed"));

        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const input = screen.getByPlaceholderText("Enter Image URL");
        fireEvent.change(input, {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.click(screen.getByText("Load Image"));

        // Simulate crop completion
        fireEvent.click(screen.getByText("Simulate Crop Complete"));

        // Click crop button
        fireEvent.click(screen.getByText("Crop Image"));

        await waitFor(() => {
            expect(
                screen.getByText("Failed to crop image."),
            ).toBeInTheDocument();
        });
    });

    it("loads image from file input", async () => {
        render(<ImageCropperPanel onCropComplete={mockOnCropComplete} />);

        const file = new File(["(⌐□_□)"], "chucknorris.png", {
            type: "image/png",
        });
        const fileInput = screen.getByLabelText(/or/i);

        // Mock FileReader
        const reader = {
            onload: null as
                | ((this: FileReader, ev: ProgressEvent<FileReader>) => void)
                | null,
            readAsDataURL: vi.fn(),
            result: "data:image/png;base64,chucknorris",
        };
        vi.spyOn(window, "FileReader").mockImplementation(
            () => reader as unknown as FileReader,
        );

        fireEvent.change(fileInput, { target: { files: [file] } });

        // Simulate file reading
        if (reader.onload) {
            reader.onload.call(
                reader as unknown as FileReader,
                {} as ProgressEvent<FileReader>,
            );
        }

        await waitFor(() => {
            expect(screen.getByTestId("image-cropper")).toBeInTheDocument();
        });
    });
});
