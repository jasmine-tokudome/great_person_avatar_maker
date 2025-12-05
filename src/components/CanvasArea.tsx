import React from 'react';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>; // お絵かき用
  imageCanvasRef: React.RefObject<HTMLCanvasElement>; // 画像表示用
  videoRef: React.RefObject<HTMLVideoElement>; // カメラ用
  isVideoMode: boolean;
  // お絵かきイベント用
  onDrawStart: (e: React.MouseEvent) => void;
  onDrawLine: (e: React.MouseEvent) => void;
  onDrawEnd: () => void;
};

export const CanvasArea: React.FC<Props> = ({
  canvasRef,
  imageCanvasRef,
  videoRef,
  isVideoMode,
  onDrawStart,
  onDrawLine,
  onDrawEnd,
}) => {
  return (
    <div className="canvas-wrapper" style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid #ccc' }}>
      
      {/* 背景画像用キャンバス (#face) */}
      <canvas
        ref={imageCanvasRef}
        width={500}
        height={500}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />

      {/* カメラ映像 (#video) - 画像の上に重ねる場合 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={isVideoMode ? '' : 'hide'}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, display: isVideoMode ? 'block' : 'none', width: '100%', height: '100%' }}
      />

      {/* お絵かき用キャンバス (#rakugaki) - 最前面 */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={onDrawStart}
        onMouseMove={onDrawLine}
        onMouseUp={onDrawEnd}
        onMouseLeave={onDrawEnd}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}
      />
    </div>
  );
};
