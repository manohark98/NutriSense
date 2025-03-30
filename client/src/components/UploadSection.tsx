import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onUpload: (file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        onUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or JPEG image.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        onUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or JPEG image.",
          variant: "destructive"
        });
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return validTypes.includes(file.type);
  };

  return (
    <div className="mb-10">
      <div 
        className={`border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:border-primary-500 transition-colors duration-300 ease-in-out ${dragOver ? 'bg-primary-50 border-primary-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <i className="ri-upload-cloud-2-line text-5xl text-neutral-400"></i>
          <div>
            <h3 className="text-lg font-medium text-neutral-700">Upload Food Image</h3>
            <p className="text-neutral-500 text-sm mt-1">Drag & drop your image here or click to browse</p>
          </div>
          <div>
            <span className="text-xs text-neutral-400">Supported formats: JPG, PNG, JPEG</span>
          </div>
          <button 
            type="button"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-300 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            <i className="ri-image-add-line mr-2"></i>
            Browse Files
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/jpg" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadSection;
