export const cropImage = (
    imageUrl: string,
    cropArea: { x: number; y: number; width: number; height: number },
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                return reject(new Error("Failed to get canvas context"));
            }
            canvas.width = cropArea.width;
            canvas.height = cropArea.height;
            ctx.drawImage(
                image,
                cropArea.x,
                cropArea.y,
                cropArea.width,
                cropArea.height,
                0,
                0,
                cropArea.width,
                cropArea.height,
            );
            resolve(canvas.toDataURL("image/jpeg"));
        };
        image.onerror = (error) => reject(error);
    });
};
