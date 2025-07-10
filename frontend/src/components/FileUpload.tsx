import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { UploadedFile, Language } from '../types';
import { useTranslation } from '../utils/translations';
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from '../utils/constants';

interface FileUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  acceptedTypes: 'documents' | 'images';
  multiple?: boolean;
  language: Language;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  acceptedTypes,
  multiple = false,
  language
}) => {
  const t = useTranslation(language);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList) => {
    setError(null);
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        return;
      }

      // Check file type
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FILE_TYPES[acceptedTypes].includes(extension)) {
        setError(`File type ${extension} is not supported`);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      };

      newFiles.push(uploadedFile);
    });

    if (newFiles.length > 0) {
      const updatedFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
      setUploadedFiles(updatedFiles);
      onFilesUpload(updatedFiles);
    }
  }, [acceptedTypes, multiple, uploadedFiles, onFilesUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUpload(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-500"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          onChange={handleChange}
          accept={SUPPORTED_FILE_TYPES[acceptedTypes].join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">{t('dragDropFiles')}</p>
        <p className="text-sm text-gray-500">
          {t('supportedFormats')} {SUPPORTED_FILE_TYPES[acceptedTypes].join(', ')}
        </p>
        <p className="text-sm text-gray-500">
          {t('maxFileSize')} {MAX_FILE_SIZE / 1024 / 1024}MB
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
            >
              <File className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{file.name}</p>
                <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;