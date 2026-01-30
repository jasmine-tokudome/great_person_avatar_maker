import React, { useEffect, useRef } from 'react';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isVideoMode: boolean;
  onDrawStart: (e: React.MouseEvent) => void;
  onDrawLine: (e: React.MouseEvent) => void;
  onDrawEnd: () => void;
  onFaceClick: () => void;
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
    const drawInfo = () => {
      const canvas = infoCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const birthText = "(1838〜1871)";
      const profileText = "佐藤清救(さとう きよすく)は、明治時代の日本において鉄道網の発展に大きく寄与した技師である。1838年、松前藩の商家に生まれた清救は、幼少期から機械に強い興味を持ち、明治維新後の西洋技術の流入期にその才能を発揮した。政府の奨学金を受けてイギリスに留学した清救はロンドン大学で機械工学を学び、帰国後は内務省土木局に入省し日本初の国産鉄道建設プロジェクトに携わることとなった。彼はその開業を見届ける前に亡くなったが、生前に切望していた「駅舎内の売店設置」は後進らの尽力によって無事達成された。";

      // クリア処理
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fontFace = "bold 18px 'ＭＳ 明朝', serif";
      const bodyFont = "16px 'ＭＳ 明朝', serif";

      // 1. 生没年の描画
      ctx.font = fontFace;
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText(birthText, canvas.width / 2, 40);

      // 2. プロフィールの描画
      const lineHeight = 26;
      const maxWidth = canvas.width - 40;
      let x = 20;
      let y = 80;

      ctx.font = bodyFont;
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
    };

    // フォントの読み込みを待ってから実行（描画漏れ防止）
    if (document.fonts) {
      document.fonts.ready.then(drawInfo);
    } else {
      drawInfo();
    }
  }, []);

  return (
    <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      
      {/* 操作・表示エリア（500x500） */}
      <div className="canvas-container" style={{ position: 'relative', width: '500px', height: '500px' }}>
        <canvas
          id="face"
          ref={imageCanvasRef}
          onClick={onFaceClick}
          width={500}
          height={500}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />

        <video
          id="video"
          ref={videoRef}
          autoPlay
          playsInline
          className={isVideoMode ? '' : 'hide'}
          style={{ 
            position: 'absolute', top: 0, left: 0, zIndex: 2, 
            width: '100%', height: '100%', objectFit: 'cover' 
          }}
        />

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

      {/* 情報表示エリア（装飾なし） */}
      <div className="info-area">
        <canvas
          ref={infoCanvasRef}
          width={500}
          height={300}
          style={{ display: 'block' }} // 余計な装飾（border, background）を削除
        />
      </div>
    </div>
  );
};
