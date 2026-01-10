/**
 * 画像の描画位置・サイズ計算ロジック
 * アスペクト比を維持しつつ、Canvasにフィットするように計算します。
 */
export const calculateImagePosition = (
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  const imgAspectRatio = imgWidth / imgHeight;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, x, y;

  if (imgAspectRatio > canvasAspectRatio) {
    // 画像の方が横長の場合
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgAspectRatio;
    x = 0;
    y = (canvasHeight - drawHeight) / 2;
  } else {
    // 画像の方が縦長の場合
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgAspectRatio;
    x = (canvasWidth - drawWidth) / 2;
    y = 0;
  }

  return { x, y, width: drawWidth, height: drawHeight };
};

/**
 * グレースケール変換ロジック
 * 指定されたContextの描画内容を白黒に変換します。
 */
export const applyGrayscale = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas;
  if (width === 0 || height === 0) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // 人間の目の感度に基づいた輝度計算（Y = 0.299R + 0.587G + 0.114B）
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    
    data[i] = brightness;     // R
    data[i + 1] = brightness; // G
    data[i + 2] = brightness; // B
    // data[i + 3] (Alpha) は変更しない
  }

  ctx.putImageData(imageData, 0, 0);
};
