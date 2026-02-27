import React, { useRef } from 'react';

type Props = {
  penColor: string;
  setPenColor: (color: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraClick: () => void;
  onPaintClick: () => void;
  isPaintMode: boolean;
  isVideoMode: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isEraserMode: boolean;
  setIsEraserMode: (value: boolean) => void;
  isStampMode: boolean;
  stampIndex: number;
  onStampClick: () => void;
};

export const ControlBar: React.FC<Props> = ({
  penColor,
  setPenColor,
  onFileSelect,
  onCameraClick,
  onPaintClick,
  isPaintMode,
  isVideoMode,
  fileInputRef,
  isEraserMode,
  isStampMode,
  stampIndex,
  onStampClick,
  setIsEraserMode,
}) => {
  
  const clickFace = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="control-bar">
      {/* ファイル選択 */}
      <button onClick={clickFace}>ファイル</button>
      <input
        type="file"
        id="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        style={{ display: 'none' }}
      />

      {/* カメラ切り替え */}
      <button 
        id="camera" 
        className={isVideoMode ? 'on' : ''} 
        onClick={onCameraClick}
      >
        カメラ
      </button>

      {/* お絵かきモード切り替え */}
      <button 
        id="paint" 
        className={isPaintMode ? 'on' : ''} 
        onClick={onPaintClick}
      >
        ペイント
      </button>

      <button 
        className={isStampMode ? 'on' : ''} 
        onClick={onStampClick}
      >
        {/* Viteではpublicの参照が速いため動的なラベル変更もスムーズ */}
        スタンプ {isStampMode ? `(${stampIndex})` : ''}
      </button>

      {/* 消しゴム切り替えボタン */}
      <button 
        id="eraser" 
        className={isEraserMode ? 'on' : ''} 
        onClick={() => setIsEraserMode(!isEraserMode)}
      >
        消しゴム
      </button>

      {/* 色選択 */}
      <input
        type="color"
        id="color"
        value={penColor}
        onChange={(e) => setPenColor(e.target.value)}
      />
    </div>
  );
};
