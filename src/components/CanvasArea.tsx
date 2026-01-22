export const CanvasArea: React.FC<Props> = ({
  canvasRef,
  imageCanvasRef,
  videoRef,
  isVideoMode,
  onDrawStart,
  onDrawLine,
  onDrawEnd,
  onFaceClick
}) => {
  return (
    // 枠組み。App.cssの #main 等と整合性を取る
    <div className="canvas-container" style={{ position: 'relative', width: '500px', height: '500px', margin: '0 auto' }}>
      
      {/* 背景画像用キャンバス */}
      <canvas
        id="face"
        ref={imageCanvasRef}
        onClick={onFaceClick}
        width={500}
        height={500}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />

      {/* カメラ映像 */}
      <video
        id="video"
        ref={videoRef}
        autoPlay
        playsInline
        className={isVideoMode ? '' : 'hide'}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 2, 
          width: '100%', 
          height: '100%',
          objectFit: 'cover' // 映像の歪みを防止
        }}
      />

      {/* お絵かき用キャンバス（最前面） */}
      <canvas
        id="rakugaki"
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
