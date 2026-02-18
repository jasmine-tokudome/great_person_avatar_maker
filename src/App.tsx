import { useState, useRef, useEffect, useCallback } from 'react';
import { ControlBar } from './components/ControlBar';
import { CanvasArea } from './components/CanvasArea';
import { calculateImagePosition, applyGrayscale } from './utils/imageHelpers';
import './App.css';

function App() {
  const [penColor, setPenColor] = useState('#000000');
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  
  const rakugakiRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルダイアログを開く関数
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 画像の描画とグレースケール適用
  const drawToCanvas = useCallback((img: HTMLImageElement | HTMLVideoElement) => {
    const canvas = faceRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y, width, height } = calculateImagePosition(
      img instanceof HTMLImageElement ? img.width : (img as HTMLVideoElement).videoWidth,
      img instanceof HTMLImageElement ? img.height : (img as HTMLVideoElement).videoHeight,
      canvas.width, canvas.height
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, width, height);
    applyGrayscale(ctx); // utilsへ移行
  }, []);

  // ファイル読み込み
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => drawToCanvas(img);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // カメラ・撮影の統合
  const toggleCamera = async () => {
    if (!isVideoMode) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsVideoMode(true);
      } catch (err) {
        alert("カメラを起動できません");
      }
    } else {
      // 撮影して停止
      if (videoRef.current) {
        drawToCanvas(videoRef.current);
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsVideoMode(false);
    }
  };

  // お絵かきロジック（簡略化）
  const handleDrawLine = (e: React.MouseEvent) => {
    if (!isDrawing || !isPaintMode || !rakugakiRef.current) return;
    const canvas = rakugakiRef.current;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      // 【重要】キャンバスの画面上の位置を取得
      const rect = canvas.getBoundingClientRect();
      // ブラウザ全体の座標(clientX)から、キャンバスの左端(rect.left)を引く
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // --- 消しゴム機能の分岐処理 ---
      if (isEraserMode) {
        // 重なった部分を透明にする
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20; // 消しゴムは太めが見やすい
      } else {
        // 通常の描画（上書き）
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 3;
      }
      // ----------------------------
  
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round'; // 角を滑らかにする
      ctx.beginPath();
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
  
      // 最後に記録する座標も計算後の値を使う
      lastPosition.current = { x: currentX, y: currentY };
    }
  };

  return (
    <div className="App">
      <ControlBar 
        penColor={penColor} setPenColor={setPenColor}
        onFileSelect={handleFileSelect}
        onCameraClick={toggleCamera}
        onPaintClick={() => setIsPaintMode(!isPaintMode)}
        isPaintMode={isPaintMode}
        isVideoMode={isVideoMode}
        fileInputRef={fileInputRef}
        isEraserMode={isEraserMode} 
        setIsEraserMode={setIsEraserMode}
      />
      <CanvasArea
        canvasRef={rakugakiRef}
        imageCanvasRef={faceRef}
        videoRef={videoRef}
        isVideoMode={isVideoMode}
        onFaceClick={handleTriggerFileInput}
        isEraserMode={isEraserMode}
        onDrawStart={(e) => {
    if(!isPaintMode || !rakugakiRef.current) return;
    
    // キャンバスの正確な位置を取得
    const rect = rakugakiRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    // 始点を計算後の座標で保存
    lastPosition.current = { x, y };
  }}
  onDrawLine={handleDrawLine} // こちらは前回の修正（clientX方式）を適用済みと想定
  onDrawEnd={() => setIsDrawing(false)}
/>
    </div>
  );
}
export default App;
