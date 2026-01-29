import React, { useEffect, useRef } from 'react';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isVideoMode: boolean;
  onDrawStart: (e: React.MouseEvent) => void;
  onDrawLine: (e: React.MouseEvent) => void;
  onDrawEnd: () => void;
  onFaceClick: () => void; // 追加：ファイル選択トリガー用
};

export const CanvasArea: React.FC<Props> = ({
  canvasRef,
  imageCanvasRef,
  videoRef,
  isVideoMode,
  onDrawStart,
  onDrawLine,
  onDrawEnd,
  onFaceClick,
}) => {
  const infoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = infoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 設定 ---
    const birthText = "(1838〜1871)";
    const profileText = "佐藤清救(さとう きよすく)は、明治時代の日本において鉄道網の発展に大きく寄与した技師である。1838年、松前藩の商家に生まれた清救は、幼少期から機械に強い興味を持ち、明治維新後の西洋技術の流入期にその才能を発揮した。政府の奨学金を受けてイギリスに留学した清救はロンドン大学で機械工学を学び、帰国後は内務省土木局に入省し日本初の国産鉄道建設プロジェクトに携わることとなった。彼はその開業を見届ける前に亡くなったが、生前に切望していた「駅舎内の売店設置」は後進らの尽力によって無事達成された。";

    // クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. 生没年の描画
    ctx.font = "bold 18px 'ＭＳ 明朝', serif";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(birthText, canvas.width / 2, 30);

    // 2. プロフィールの描画 (自動改行)
    const fontSize = 16;
    const lineHeight = 26;
    const maxWidth = canvas.width - 40;
    let x = 20;
    let y = 70;

    ctx.font = `${fontSize}px 'ＭＳ 明朝', serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    let currentLine = "";
    for (let i = 0; i < profileText.length; i++) {
        let char = profileText[i];
        let testLine = currentLine + char;
        if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(currentLine, x, y);
            currentLine = char;
            y += lineHeight;
        } else {
            currentLine = testLine;
        }
    }
    ctx.fillText(currentLine, x, y);

  }, []); // 初回マウント時に描画
  
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

      {/* 4. 生没年・プロフィール用 Canvas (今回追加) */}
      <canvas
        ref={infoCanvasRef}
        width={500}
        height={300}
        style={{ marginTop: '10px', border: '1px solid #ccc' }}
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
