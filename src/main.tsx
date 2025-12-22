// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const App = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const rakugakiRef = useRef<HTMLCanvasElement | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const paintRef = useRef<HTMLButtonElement | null>(null);
  const cameraRef = useRef<HTMLButtonElement | null>(null);
  const faceRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [penColor, setPenColor] = useState<string>('rgb(0, 0, 0)');
  const mouseOnRef = useRef<boolean>(false);
  const prevPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const ranugakiModeRef = useRef<boolean>(false);
  const videoModeRef = useRef<boolean>(false);

  // 画像をクリックしたときの処理
  const clickFace = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }

  // 画像を読み込む
  const loadLocalImage = (e: Event) => {
    const fileDate = e.target.files[0];
    if (fileDate.type.match("image.*")){
      const reader = new FileReader();
      reader.onload = function(){
        faceDraw(reader.result);
        fileDate.value = "";
      }
      reader.readAsDataURL(fileDate);
    }
  };

  // 画像を書き出す
  const faceDraw = (data: string) => {
    const face = faceRef.current;
    if (!face) return;

    const ctx = face.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    ctx.clearRect(0, 0, face.width, face.height);
    img.src = data;
    img.onload = () => {
      let height: number;
      let width: number;
      let x: number;
      let y: number;

      if (img.width / img.height > 1) {
        height = face.height;
        width = img.width * (height / img.height);
        x = (face.width - width) / 2;
        y = 0;
      } else {
        width = face.width;
        height = img.height * (width / img.width);
        x = 0;
        y = (face.height - height) / 2;
      }
      ctx.drawImage(img, x, y, width, height);
      // グレースケールに変換（必要なら grayscale(ctx) を呼ぶ）
      grayscale(ctx)
    };
  };

  // グレースケールに変換
  const grayscale = (ctx: CanvasRenderingContext2D) => {
    // TODO: 実装
  };

  // カメラボタンクリック時の処理
  const clickCamera = () => {
    const camera = cameraRef.current;
    const video = videoRef.current;
    if (!camera || !video) return;

    const nextVideoMode = !videoModeRef.current;
    videoModeRef.current = nextVideoMode;

    camera.classList.toggle('on');
    video.classList.toggle('hide');

    if (nextVideoMode) {
      loadVideo();
    } else {
      takePhoto();
    }
  };

  // カメラを起動する
  const loadVideo = () => {
    // TODO: 実装（getUserMedia など）
  };

  // カメラで撮影した画像を表示する
  const takePhoto = () => {
    // TODO: 実装（video から canvas に描画して faceDraw を呼ぶなど）
  };

  // ペイントボタンクリック時の処理
  const clickPaint = () => {
    const paint = paintRef.current;
    const rakugaki = rakugakiRef.current;
    if (!paint || !rakugaki) return;

    const nextMode = !ranugakiModeRef.current;
    ranugakiModeRef.current = nextMode;

    paint.classList.toggle('on');
    // お絵かき領域／パレット切り替えの DOM 操作をここに
  };

  // 画面サイズ変更時の処理
  const resize = () => {
    const rakugaki = rakugakiRef.current;
    if (!rakugaki) return;
    rakugaki.width = rakugaki.offsetWidth;
    rakugaki.height = rakugaki.offsetHeight;
  };

  // ペンの書き始め
  const drawStart = (e: MouseEvent) => {
    mouseOnRef.current = true;
    const rakugaki = rakugakiRef.current;
    if (!rakugaki) return;

    const rect = rakugaki.getBoundingClientRect();
    prevPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // ペンの書き途中
  const drawLine = (e: MouseEvent) => {
    if (!mouseOnRef.current) return;
    const rakugaki = rakugakiRef.current;
    if (!rakugaki) return;

    const ctx = rakugaki.getContext('2d');
    if (!ctx) return;

    const rect = rakugaki.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(prevPointRef.current.x, prevPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    prevPointRef.current = { x, y };
  };

  // ペンの書き終わり
  const drawEnd = () => {
    mouseOnRef.current = false;
  };

  // ペンの色変更
  const colorChange = (e: Event) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;
    setPenColor(target.value);
  };

  // イベントリスナ登録・クリーンアップ
  useEffect(() => {
    const file = fileRef.current;
    const rakugaki = rakugakiRef.current;
    const color = colorRef.current;
    const paint = paintRef.current;
    const camera = cameraRef.current;
    const face = faceRef.current;

    face?.addEventListener('click', clickFace);
    camera?.addEventListener('click', clickCamera);
    paint?.addEventListener('click', clickPaint);
    file?.addEventListener('change', loadLocalImage as EventListener);
    color?.addEventListener('change', colorChange as EventListener);
    rakugaki?.addEventListener('mousedown', drawStart as EventListener);
    rakugaki?.addEventListener('mousemove', drawLine as EventListener);
    rakugaki?.addEventListener('mouseup', drawEnd as EventListener);
    rakugaki?.addEventListener('mouseleave', drawEnd as EventListener);
    window.addEventListener('resize', resize);

    // クリーンアップ
    return () => {
      face?.removeEventListener('click', clickFace);
      camera?.removeEventListener('click', clickCamera);
      paint?.removeEventListener('click', clickPaint);
      file?.removeEventListener('change', loadLocalImage as EventListener);
      color?.removeEventListener('change', colorChange as EventListener);
      rakugaki?.removeEventListener('mousedown', drawStart as EventListener);
      rakugaki?.removeEventListener('mousemove', drawLine as EventListener);
      rakugaki?.removeEventListener('mouseup', drawEnd as EventListener);
      rakugaki?.removeEventListener('mouseleave', drawEnd as EventListener);
      window.removeEventListener('resize', resize);
    };
  }, [penColor]); // penColor を依存に入れると線の色変更が反映される

  return (
    <div className="app">
      {/* 元の HTML 構造に合わせて ID を付与 */}
      <input id="file" type="file" ref={fileRef} />
      <button id="paint" ref={paintRef}>Paint</button>
      <button id="camera" ref={cameraRef}>Camera</button>
      {/* <input id="color" type="color" ref={colorRef} />
      anvas id="face" ref={faceRef} />
      <video id="video" ref={videoRef} className="hide" />
      anvas id="rakugaki" ref={rakugakiRef} /> */}
    </div>
  );
};
}

export default App;
