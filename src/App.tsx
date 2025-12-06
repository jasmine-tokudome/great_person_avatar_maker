import { useState, useRef, useEffect } from 'react';
import { ControlBar } from './components/ControlBar';
import { CanvasArea } from './components/CanvasArea';
import { calculateImagePosition } from './utils/imageHelpers';
import './App.css';

function App() {
  // --- State (状態管理) ---
  const [penColor, setPenColor] = useState('rgb(0, 0, 0)');
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // --- Refs (DOM参照) ---
  const rakugakiRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 座標保持用
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // --- Functions (ロジック) ---

  // 画像読み込み処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !faceRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = faceRef.current!;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // utilsに切り出した計算関数を使用
          const { x, y, width, height } = calculateImagePosition(
            img.width, img.height, canvas.width, canvas.height
          );
          ctx.drawImage(img, x, y, width, height);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // お絵かき開始
  const handleDrawStart = (e: React.MouseEvent) => {
    if (!isPaintMode) return;
    setIsDrawing(true);
    lastPosition.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  // お絵かき中
  const handleDrawLine = (e: React.MouseEvent) => {
    if (!isDrawing || !isPaintMode || !rakugakiRef.current) return;
    
    const ctx = rakugakiRef.current.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2; // 線の太さ
      ctx.beginPath();
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      lastPosition.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    }
  };

  // カメラ起動処理（簡易版）
  const toggleCamera = async () => {
    const nextMode = !isVideoMode;
    setIsVideoMode(nextMode);

    if (nextMode && videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("カメラの起動に失敗しました", err);
        setIsVideoMode(false);
      }
    } else if (!nextMode && videoRef.current) {
      // カメラ停止処理（ストリームの停止）
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      
      // ここで本来は takePhoto() のように映像をCanvasに転写する処理が入ります
    }
  };

  // リサイズ処理（useEffectで監視）
  useEffect(() => {
    const handleResize = () => {
       // Canvasサイズ調整ロジック
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App">
      <ControlBar 
        penColor={penColor}
        setPenColor={setPenColor}
        onFileSelect={handleFileSelect}
        onCameraClick={toggleCamera}
        onPaintClick={() => setIsPaintMode(!isPaintMode)}
        isPaintMode={isPaintMode}
        isVideoMode={isVideoMode}
      />
      <CanvasArea
        canvasRef={rakugakiRef}
        imageCanvasRef={faceRef}
        videoRef={videoRef}
        isVideoMode={isVideoMode}
        onDrawStart={handleDrawStart}
        onDrawLine={handleDrawLine}
        onDrawEnd={() => setIsDrawing(false)}
      />
    </div>
  );
}

export default App;
