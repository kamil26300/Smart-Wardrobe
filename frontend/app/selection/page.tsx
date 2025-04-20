"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";

interface WardrobeItem {
  id: string;
  url: string;
  item_type: 'TOP' | 'BOTTOM';
}

interface Outfit {
  id: string;
  top: WardrobeItem;
  bottom: WardrobeItem;
  match_strength: number;
}

export default function SelectionPage() {
  const [selectedTops, setSelectedTops] = useState<Set<string>>(new Set());
  const [selectedBottoms, setSelectedBottoms] = useState<Set<string>>(new Set());
  const [tops, setTops] = useState<WardrobeItem[]>([]);
  const [bottoms, setBottoms] = useState<WardrobeItem[]>([]);
  const [recommendedOutfits, setRecommendedOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTopSelect = (id: string) => {
    setSelectedTops(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id); // Deselect if already selected
      } else {
        newSelection.add(id); // Select if not already selected
      }
      return newSelection;
    });
  };

  const handleBottomSelect = (id: string) => {
    setSelectedBottoms(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id); // Deselect if already selected
      } else {
        newSelection.add(id); // Select if not already selected
      }
      return newSelection;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tops
        const topsResponse = await fetch('http://localhost:8000/api/wardrobe-items/?type=TOP');
        const topsData = await topsResponse.json();
        setTops(topsData.map((item: any) => ({
          id: item.id,
          url: `http://localhost:8000${item.image_url}`,
          item_type: 'TOP'
        })));

        // Fetch bottoms
        const bottomsResponse = await fetch('http://localhost:8000/api/wardrobe-items/?type=BOTTOM');
        const bottomsData = await bottomsResponse.json();
        setBottoms(bottomsData.map((item: any) => ({
          id: item.id,
          url: `http://localhost:8000${item.image_url}`,
          item_type: 'BOTTOM'
        })));

        // Fetch recommended outfits
        const outfitsResponse = await fetch('http://localhost:8000/api/recommended-outfits/');
        const outfitsData = await outfitsResponse.json();
        setRecommendedOutfits(outfitsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load wardrobe items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Tops Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select the tops</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tops.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative h-[250px] border-2 rounded-md cursor-pointer transition-all duration-200",
                selectedTops.has(item.id)
                  ? "border-purple-500 shadow-lg scale-105"
                  : "border-gray-200 hover:border-purple-300"
              )}
              onClick={() => handleTopSelect(item.id)}
            >
              <Image
                src={item.url}
                alt="Top item"
                fill
                className="object-cover rounded-md p-1"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Bottoms Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select the bottom</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {bottoms.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative h-[250px] border-2 rounded-md cursor-pointer transition-all duration-200",
                selectedBottoms.has(item.id)
                  ? "border-purple-500 shadow-lg scale-105"
                  : "border-gray-200 hover:border-purple-300"
              )}
              onClick={() => handleBottomSelect(item.id)}
            >
              <Image
                src={item.url}
                alt="Bottom item"
                fill
                className="object-cover rounded-md p-1"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Outfits Section */}
      <section className="pt-8 border-t">
        <h2 className="text-3xl font-bold text-center mb-8">
          Recommended Outfits
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {recommendedOutfits.map((outfit, index) => (
            <div
              key={outfit.id}
              className="bg-gray-100 p-6 rounded-lg space-y-4"
            >
              <h3 className="text-xl font-semibold text-center">
                Outfit-{index + 1}
              </h3>
              <div className="space-y-2">
                {/* Top Item */}
                <div className="relative w-full h-[200px]">
                  <Image
                    src={outfit.top.url}
                    alt="Top item"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Plus Sign */}
                <div className="flex justify-center">
                  <span className="text-2xl font-bold text-gray-500">+</span>
                </div>

                {/* Bottom Item */}
                <div className="relative w-full h-[200px]">
                  <Image
                    src={outfit.bottom.url}
                    alt="Bottom item"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
