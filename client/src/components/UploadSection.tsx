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
    <div className="mb-10 w-full max-w-3xl mx-auto">
      <div className="card flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Info */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-8 md:w-2/5 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">Analyze Your Food</h3>
          <p className="mb-6 opacity-90">
            Our AI instantly analyzes your food photos to provide detailed nutrition insights.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Detailed nutrition scores</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Health rating assessment</span>
            </li>
            <li className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm">Dietary recommendations</span>
            </li>
          </ul>
        </div>
        
        {/* Right side - Upload */}
        <div className="p-8 md:w-3/5 flex flex-col justify-center items-center">
          <div 
            className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 
              ${dragOver 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-slate-200 hover:border-primary/70 hover:bg-slate-50'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 text-primary animate-float`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Upload Food Image</h3>
                <p className="text-slate-500 mt-2">Drag & drop your image here or click to browse</p>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-500 text-xs">
                  Supported formats: JPG, PNG, JPEG
                </span>
              </div>
              <button 
                type="button"
                className="btn-primary mt-2 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
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
      </div>
    </div>
  );
};

export default UploadSection;
