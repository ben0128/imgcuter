import { act, render } from "@testing-library/react";
import Cropper, { type Area } from "react-easy-crop";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ImageCropper from "./Cropper";

interface MockCropperProps {
    image: string;
    onCropChange: (location: { x: number; y: number }) => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    onZoomChange: (zoom: number) => void;
}

// Define a variable to hold the props passed to the mock
let passedProps: MockCropperProps | null;

// Mock react-easy-crop
vi.mock("react-easy-crop", () => ({
    // The default export is the component we want to mock
    default: vi.fn((props) => {
        passedProps = props;
        return <div data-testid="mock-cropper" />;
    }),
}));

describe("ImageCropper", () => {
    beforeEach(() => {
        // Reset the mock and the captured props before each test
        (Cropper as vi.Mock).mockClear();
        passedProps = null;
    });

    it("renders the Cropper component and passes props correctly", () => {
        const onCropComplete = vi.fn();
        render(
            <ImageCropper
                image="test-image.jpg"
                onCropChange={() => {}}
                onCropComplete={onCropComplete}
                onZoomChange={() => {}}
            />,
        );

        expect(Cropper).toHaveBeenCalledTimes(1);
        expect(passedProps.image).toBe("test-image.jpg");
        expect(passedProps.onCropComplete).toBe(onCropComplete);
    });

    it("calls onCropChange when the cropper triggers it", () => {
        const onCropChange = vi.fn();
        render(
            <ImageCropper
                image="test-image.jpg"
                onCropChange={onCropChange}
                onCropComplete={() => {}}
                onZoomChange={() => {}}
            />,
        );

        // Simulate the cropper's onCropChange callback
        act(() => {
            passedProps.onCropChange({ x: 10, y: 20 });
        });

        // The component's handler should have called the prop function
        expect(onCropChange).toHaveBeenCalledWith({ x: 10, y: 20 });
    });

    it("calls onZoomChange when the cropper triggers it", () => {
        const onZoomChange = vi.fn();
        render(
            <ImageCropper
                image="test-image.jpg"
                onCropChange={() => {}}
                onCropComplete={() => {}}
                onZoomChange={onZoomChange}
            />,
        );

        // Simulate the cropper's onZoomChange callback
        act(() => {
            passedProps.onZoomChange(2);
        });

        // The component's handler should have called the prop function
        expect(onZoomChange).toHaveBeenCalledWith(2);
    });
});
