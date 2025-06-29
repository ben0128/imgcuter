# React Image Cropper (`imgcuter`)

This project is a simple front-end image cropping tool built with React and TypeScript.

## Technology Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Key Libraries**:
  - `react-easy-crop` for the cropping UI.
- **Storage**: Browser `localStorage` is used to save cropping history.
- **Core Logic**: HTML5 Canvas API for image manipulation.

## Project Structure

```
imgcuter/
├── src/
│   ├── components/         # React components
│   │   └── Cropper.tsx
│   ├── pages/              # Page components
│   │   └── index.tsx
│   ├── types/              # TypeScript definitions
│   │   └── crop.ts
│   ├── utils/              # Utility functions
│   │   └── cropImage.ts
│   └── main.tsx            # App entry point
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## Available Scripts

- `npm install`: Installs all necessary dependencies.
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
