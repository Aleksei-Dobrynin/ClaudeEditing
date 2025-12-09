import React, { useState } from "react";
import './files.css';
import { API_URL } from "constants/config";

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  deleteMedia: (id: number) => void;
  media_files: any[];
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUpload, media_files, deleteMedia }) => {
  const [media, setMedia] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedMedia = [...media, ...newFiles];
      setMedia(updatedMedia);
      onUpload(updatedMedia); // Вызываем обновление при добавлении
    }
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
    onUpload(updatedMedia); // Вызываем обновление при удалении
  };

  const handleRemoveMediaFile = (id: number) => {
    deleteMedia(id);
  };

  const isVideo = (file: any) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
    const extension = file?.file_name?.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension);
  };

  return (
    <div className="media-uploader">
      <label className="upload-label">
        <input
          type="file"
          accept="video/*,image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="upload-button">Загрузка медиа</div>
      </label>

      <div className="video-list">
        {media.map((file, index) => (
          <div key={index} className="video-item">
            {file.type.startsWith('video') ? (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="video-preview"
              />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="video-preview"
              />
            )}
            <div
              className="remove-button"
              onClick={() => handleRemoveMedia(index)}
            >
              Remove
            </div>
          </div>
        ))}
        {media_files?.map((file, index) => (
          <div key={index} className="video-item">
            {isVideo(file) ? (
              <video
                src={`${API_URL}File/DownloadVideo?id=${file?.file_id}`}
                controls
                className="video-preview"
              />
            ) : (
              <img
                src={`${API_URL}File/DownloadVideo?id=${file?.file_id}`}
                alt="uploaded"
                className="video-preview"
              />
            )}
            <div
              className="remove-button"
              onClick={() => handleRemoveMediaFile(file.id)}
            >
              Remove
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;
