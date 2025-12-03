// 画像の描画位置・サイズ計算ロジック（元 faceDraw 内の計算）
export const calculateImagePosition = (
    imgWidth: number,
    imgHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    let drawWidth, drawHeight, x, y;
  
    if (imgWidth / imgHeight > 1) {
      drawHeight = canvasHeight;
      drawWidth = imgWidth * (drawHeight / imgHeight);
      x = (canvasWidth - drawWidth) / 2;
      y = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = imgHeight * (drawWidth / imgWidth);
      x = 0;
      y = (canvasHeight - drawHeight) / 2;
    }
  
    return { x, y, width: drawWidth, height: drawHeight };
  };
  
  // グレースケール変換ロジック（将来実装用）
  export const convertToGrayscale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // ここにグレースケール処理を書く
  };
  