import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFormats?: string;
  maxSize?: number; // en MB
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  acceptedFormats = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError("");

    // Vérifier la taille
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`Le fichier est trop volumineux (max ${maxSize} MB)`);
      return false;
    }

    // Vérifier le format
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = acceptedFormats.split(",").map((ext) => ext.trim().toLowerCase());
    
    if (!acceptedExtensions.includes(fileExtension)) {
      setError(`Format non accepté. Formats autorisés : ${acceptedFormats}`);
      return false;
    }

    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setError("");
      onFileSelect(null);
      return;
    }

    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-gray-300 hover:border-primary hover:bg-gray-50",
            error && "border-destructive"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/20" : "bg-gray-100"
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8 transition-colors",
                  isDragging ? "text-primary" : "text-gray-400"
                )}
              />
            </div>

            <div>
              <p className="text-base font-medium text-foreground mb-1">
                {isDragging
                  ? "Déposez le fichier ici"
                  : "Glissez-déposez votre fichier ici"}
              </p>
              <p className="text-sm text-muted-foreground">
                ou{" "}
                <span className="text-primary font-medium hover:underline">
                  cliquez pour parcourir
                </span>
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Formats acceptés : {acceptedFormats.replace(/\./g, "").toUpperCase()} (max {maxSize} MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-primary/20 bg-primary/5 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
