import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CropData } from "../types/crop";
import CropHistoryPanel from "./CropHistoryPanel";

describe("CropHistoryPanel", () => {
    const mockHistory: CropData[] = [
        {
            originalUrl: "http://example.com/image1.jpg",
            cropArea: { x: 0, y: 0, width: 100, height: 100 },
            croppedImage: "data:image/jpeg;base64,test1",
            timestamp: Date.now(),
        },
        {
            originalUrl: "http://example.com/image2.jpg",
            cropArea: { x: 10, y: 10, width: 200, height: 150 },
            croppedImage: "data:image/jpeg;base64,test2",
            timestamp: Date.now() - 1000,
        },
    ];

    const mockOnClearHistory = vi.fn();
    const mockOnDeleteHistory = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders empty state when no history", () => {
        render(
            <CropHistoryPanel
                history={[]}
                onClearHistory={mockOnClearHistory}
                onDeleteHistory={mockOnDeleteHistory}
            />,
        );

        expect(screen.getByText("Crop History")).toBeInTheDocument();
        expect(screen.getByText("No crop history yet.")).toBeInTheDocument();
    });

    it("renders history items correctly", () => {
        render(
            <CropHistoryPanel
                history={mockHistory}
                onClearHistory={mockOnClearHistory}
                onDeleteHistory={mockOnDeleteHistory}
            />,
        );

        expect(screen.getByText("Crop History")).toBeInTheDocument();
        expect(screen.getAllByAltText("Cropped History")).toHaveLength(2);
        expect(screen.getByText("Size: 100x100")).toBeInTheDocument();
        expect(screen.getByText("Size: 200x150")).toBeInTheDocument();
    });

    it("calls onClearHistory when clear button is clicked", () => {
        render(
            <CropHistoryPanel
                history={mockHistory}
                onClearHistory={mockOnClearHistory}
                onDeleteHistory={mockOnDeleteHistory}
            />,
        );

        fireEvent.click(screen.getByText("Clear History"));
        expect(mockOnClearHistory).toHaveBeenCalledTimes(1);
    });

    it("calls onDeleteHistory when delete button is clicked", () => {
        render(
            <CropHistoryPanel
                history={mockHistory}
                onClearHistory={mockOnClearHistory}
                onDeleteHistory={mockOnDeleteHistory}
            />,
        );

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        expect(mockOnDeleteHistory).toHaveBeenCalledWith(0);
    });

    it("copies image URL to clipboard when CopyUrl is clicked", async () => {
        const mockClipboard = {
            writeText: vi.fn().mockResolvedValue(undefined),
        };
        Object.assign(navigator, { clipboard: mockClipboard });

        render(
            <CropHistoryPanel
                history={mockHistory}
                onClearHistory={mockOnClearHistory}
                onDeleteHistory={mockOnDeleteHistory}
            />,
        );

        const copyButtons = screen.getAllByText("CopyUrl");
        fireEvent.click(copyButtons[0]);

        expect(mockClipboard.writeText).toHaveBeenCalledWith(
            "data:image/jpeg;base64,test1",
        );
    });
});
