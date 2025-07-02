# imgcuter

`imgcuter` is a simple front-end image cropping tool built with React and TypeScript.

## Features

- Image cropping functionality using `react-easy-crop`.
- Image manipulation using HTML5 Canvas API.
- Cropping history saved in browser `localStorage`.

## Technology Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Key Libraries**:
    - `react-easy-crop`: For the cropping UI.
- **Storage**: Browser `localStorage` for history.
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

In the project directory, you can run:

### `npm install`

Installs all necessary dependencies.

### `npm run dev`

Runs the app in development mode.
Opens [http://localhost:5173](http://localhost:5173) in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run preview`

Serves the production build locally. This is useful for checking the production build before deploying.
