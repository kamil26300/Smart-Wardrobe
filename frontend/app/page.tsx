"use client";

import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Define interfaces for our data types
interface WardrobeItem {
  id: string;
  url: string;
}

interface ApiResponse {
  id: string;
  image: string;
  image_url: string;
  item_type: 'TOP' | 'BOTTOM';
}

const FloatingActionButton = ({ tops, bottoms }: { tops: WardrobeItem[], bottoms: WardrobeItem[] }) => {
  const router = useRouter();

  const handleNavigateToSelection = () => {
    if (tops.length === 0 || bottoms.length === 0) {
      toast.error(
        tops.length === 0 && bottoms.length === 0
          ? "Please upload at least one top and one bottom"
          : tops.length === 0
          ? "Please upload at least one top"
          : "Please upload at least one bottom"
      );
      return;
    }

    router.push('/selection');
  };

  return (
    <Button
      onClick={handleNavigateToSelection}
      className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 group"
      size="lg"
    >
      <span className="mr-2">Go to Selection</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
};

export default function Home() {
  const [tops, setTops] = useState<WardrobeItem[]>([]);
  const [bottoms, setBottoms] = useState<WardrobeItem[]>([]);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  const handleTopUpload = async (files: FileList) => {
    setIsLoadingTop(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('item_type', 'TOP');
  
        const response = await fetch(`${API_BASE_URL}/api/upload/`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
  
        const data = await response.json();
        return {
          id: data.id,
          url: `${API_BASE_URL}${data.image_url}`,
        };
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw error;
      }
    });
  
    try {
      const newItems = await Promise.all(uploadPromises);
      setTops(prevTops => [...prevTops, ...newItems]);
      toast.success(`Successfully uploaded ${files.length} tops`);
    } catch (error) {
      toast.error('Some files failed to upload');
    } finally {
      setIsLoadingTop(false);
    }
  };
  
  const handleBottomUpload = async (files: FileList) => {
    setIsLoadingBottom(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('item_type', 'BOTTOM');
  
        const response = await fetch(`${API_BASE_URL}/api/upload/`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
  
        const data = await response.json();
        return {
          id: data.id,
          url: `${API_BASE_URL}${data.image_url}`,
        };
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw error;
      }
    });
  
    try {
      const newItems = await Promise.all(uploadPromises);
      setBottoms(prevBottoms => [...prevBottoms, ...newItems]);
      toast.success(`Successfully uploaded ${files.length} bottoms`);
    } catch (error) {
      toast.error('Some files failed to upload');
    } finally {
      setIsLoadingBottom(false);
    }
  };


  const handleDeleteImage = async (imageId: string) => {
    toast.promise(
      async () => {
        const response = await fetch(`${API_BASE_URL}/api/wardrobe-items/${imageId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        // Update state to remove deleted image
        setTops(prevTops => prevTops.filter(img => img.id !== imageId));
        setBottoms(prevBottoms => prevBottoms.filter(img => img.id !== imageId));
      },
      {
        loading: 'Deleting image...',
        success: 'Image deleted successfully!',
        error: 'Failed to delete image',
      }
    );
  };

  const fetchImages = async () => {
    setIsLoadingTop(true);
    setIsLoadingBottom(true);
  
    try {
      toast.loading('Fetching your wardrobe items...');
  
      const topsResponse = await fetch(`${API_BASE_URL}/api/wardrobe-items/?type=TOP`);
      const topsData: ApiResponse[] = await topsResponse.json();
      setTops(topsData.map((item) => ({
        id: item.id,
        url: `${API_BASE_URL}${item.image_url}`
      })));
  
      const bottomsResponse = await fetch(`${API_BASE_URL}/api/wardrobe-items/?type=BOTTOM`);
      const bottomsData: ApiResponse[] = await bottomsResponse.json();
      setBottoms(bottomsData.map((item) => ({
        id: item.id,
        url: `${API_BASE_URL}${item.image_url}`
      })));
  
      toast.success('Wardrobe items loaded successfully!');
    } catch (error) {
      toast.error('Failed to load wardrobe items');
    } finally {
      setIsLoadingTop(false); // ✅ unset loading
      setIsLoadingBottom(false); // ✅ unset loading
    }
  };
  

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Add clothes to your Virtual Wardrobe
      </h1>
      
      <ImageUpload
        title="STEP 1"
        subtitle="Upload your tops you wish to add in wardrobe"
        buttonText="Upload Tops"
        images={tops}
        onUpload={handleTopUpload}
        onDelete={handleDeleteImage}
        isLoading={isLoadingTop}
        />

      <ImageUpload
        title="STEP 2"
        subtitle="Upload your bottom you wish to add in wardrobe"
        buttonText="Upload Bottom Wear"
        images={bottoms}
        onUpload={handleBottomUpload}
        onDelete={handleDeleteImage}
        isLoading={isLoadingBottom}
      />
      <FloatingActionButton tops={tops} bottoms={bottoms} />
    </div>
  );
}