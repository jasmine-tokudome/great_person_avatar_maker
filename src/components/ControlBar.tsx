import React, { useRef } from 'react';

type Props = {
  penColor: string;
  setPenColor: (color: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraClick: () => void;
  onPaintClick: () => void;
  isPaintMode: boolean;
  isVideoMode: boolean;
};

export const ControlBar: React.FC<Props> = ({
  penColor,
  setPenColor,
  onFileSelect,
  onCameraClick,
  onPaintClick,
  isPaintMode,
  isVideoMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onChange={handleFileSelect}
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
