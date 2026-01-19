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
  
  const rakugakiRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルダイアログを開く関数
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  useEffect(() => {
    // rakugaki (canvasRef) に何か描画していないか確認
    console.log('rakugakiRef:', rakugakiRef.current);
    console.log('faceRef:', faceRef.current);
  
    // 同じ ref を参照していないか
    console.log('同一か:', rakugakiRef.current === faceRef.current);
  }, []);  

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
    const ctx = rakugakiRef.current.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      lastPosition.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    }
  };

  return (
    <div className="App">
      <ControlBar 
        penColor={penColor} setPenColor={setPenColor}
        onFileSelect={handleFileSelect} onCameraClick={toggleCamera}
        onPaintClick={() => setIsPaintMode(!isPaintMode)}
        isPaintMode={isPaintMode} isVideoMode={isVideoMode}
      />
      <CanvasArea
        canvasRef={rakugakiRef} imageCanvasRef={faceRef} videoRef={videoRef}
        isVideoMode={isVideoMode} onDrawStart={(e) => {
          if(!isPaintMode) return;
          setIsDrawing(true);
          lastPosition.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        }}
        onDrawLine={handleDrawLine} onDrawEnd={() => setIsDrawing(false)}
      />
    </div>
  );
}
export default App;
