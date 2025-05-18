import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileImageEditor = ({ adventurer, onSave }) => {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return canvas.toDataURL('image/jpeg');
    } catch (e) {
      console.error('Error cropping image:', e);
      return null;
    }
  };

  const handleSave = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg();
      if (croppedImage) {
        onSave(croppedImage);
        setImage(null);
        setIsEditing(false);
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medieval mb-4 flex items-center">
        <ImageIcon size={20} className="mr-2 text-primary-400" />
        <span>Profile Image</span>
      </h3>

      {!isEditing ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-500 bg-opacity-10'
              : 'border-dark-600 hover:border-primary-500 hover:bg-dark-750'
          }`}
        >
          <input {...getInputProps()} />
          
          {adventurer.avatarUrl ? (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-dark-600">
                <img
                  src={adventurer.avatarUrl}
                  alt={adventurer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm text-dark-400">
                Drop a new image here or click to change
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload size={32} className="mx-auto text-dark-500" />
              <div>
                <p className="text-dark-300 mb-2">
                  Drop an image here or click to upload
                </p>
                <p className="text-xs text-dark-500">
                  Supports: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative h-[400px] bg-dark-900 rounded-lg overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex-1 space-y-2">
              <span className="text-sm text-dark-400">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setImage(null);
                setIsEditing(false);
              }}
              className="btn btn-outline-danger"
            >
              <X size={16} className="mr-2" />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <Check size={16} className="mr-2" />
              <span>Save Image</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileImageEditor;