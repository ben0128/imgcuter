import { render, screen } from '@testing-library/react';
import ImageCropper from './Cropper';
import { describe, it, expect } from 'vitest';

describe('ImageCropper', () => {
  it('renders the Cropper component', () => {
    render(
      <ImageCropper
        image="test-image.jpg"
        onCropChange={() => {}}
        onCropComplete={() => {}}
        onZoomChange={() => {}}
      />
    );
    expect(screen.getByTestId('cropper-component')).toBeInTheDocument();
  });
});