"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

interface ImageUploadProps {
  title: string;
  subtitle: string;
  buttonText: string;
  images: Array<{ id: string; url: string }>;  // Updated to include image ID
  onUpload: (file: File) => void;
  onDelete: (imageId: string) => Promise<void>;
}

const ImageUpload = ({
  title,
  subtitle,
  buttonText,
  images,
  onUpload,
  onDelete,
}: ImageUploadProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      onUpload(file);
    }
  };

  const handleDeleteClick = (imageId: string) => {
    setSelectedImageId(imageId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedImageId) {
      await onDelete(selectedImageId);
      setDeleteDialogOpen(false);
      setSelectedImageId(null);
    }
  };

  const handleImageClick = (imageUrl: string, event: React.MouseEvent) => {
    // Prevent click from triggering when clicking delete button
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      setFullSizeImage(imageUrl);
    }
  };

  return (
    <div className="bg-gray-200 p-8 rounded-lg mb-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="relative min-h-[200px]">
        {images.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div 
                    className="relative h-[200px] sm:h-[350px] group cursor-pointer"
                    onClick={(e) => handleImageClick(image.url, e)}
                  >
                    <Image
                      src={image.url}
                      alt="Uploaded image"
                      fill
                      className="object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleDeleteClick(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500">No images uploaded yet</p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="default"
          onClick={() => document.getElementById(title)?.click()}
        >
          {buttonText}
        </Button>
        <input
          id={title}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Dialog 
        open={!!fullSizeImage} 
        onOpenChange={(open) => !open && setFullSizeImage(null)}
      >
        <DialogContent className="w-screen h-auto sm:max-w-[90vw] sm:max-h-[90vh] sm:w-fit sm:h-fit p-0 rounded-none">

          <DialogHeader className="hidden">
            <DialogTitle>Full Size Image</DialogTitle>
          </DialogHeader>
          {fullSizeImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-[70vh]">
                <Image
                  src={fullSizeImage}
                  alt="Full size image"
                  width={10000}
                  height={10000}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;