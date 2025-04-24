"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface WardrobeItem {
  id: string;
  url: string;
  item_type: "TOP" | "BOTTOM";
}

interface FinalSelection {
  id: number;
  top_id: number;
  bottom_id: number;
  top_image: string;
  bottom_image: string;
}

export default function SelectionPage() {
  const [selectedTops, setSelectedTops] = useState<Set<string>>(new Set());
  const [selectedBottoms, setSelectedBottoms] = useState<Set<string>>(
    new Set()
  );
  const [tops, setTops] = useState<WardrobeItem[]>([]);
  const [bottoms, setBottoms] = useState<WardrobeItem[]>([]);
  const [selections, setSelections] = useState<FinalSelection[]>([]);
  const [selectionsLoading, setSelectionsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleTopSelect = (id: string) => {
    setSelectedTops((prev) => {
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
    setSelectedBottoms((prev) => {
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
      setIsLoading(true);
      try {
        // Fetch tops
        const topsResponse = await fetch(
          `${BASE_URL}/api/wardrobe-items/?type=TOP`
        );
        const topsData = await topsResponse.json();
        setTops(
          topsData.map((item: any) => ({
            id: item.id,
            url: BASE_URL + item.image_url,
            item_type: "TOP",
          }))
        );

        // Fetch bottoms
        const bottomsResponse = await fetch(
          `${BASE_URL}/api/wardrobe-items/?type=BOTTOM`
        );
        const bottomsData = await bottomsResponse.json();
        setBottoms(
          bottomsData.map((item: any) => ({
            id: item.id,
            url: BASE_URL + item.image_url,
            item_type: "BOTTOM",
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load wardrobe items");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSelections = async () => {
      setSelectionsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/final-selections/`);
        if (!response.ok) throw new Error("Failed to fetch selections");
        const data = await response.json();
        setSelections(data);
      } catch (error) {
        console.error("Error fetching selections:", error);
        toast.error("Failed to load selections");
      } finally {
        setSelectionsLoading(false);
      }
    };

    fetchSelections();
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
      <section className="pt-8 border-t" id="recommendations">
        <h2 className="text-3xl font-bold text-center mb-8">
          Recommended Outfits
        </h2>
        {selectionsLoading ? (
          <Loading />
        ) : (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-9/10 mx-auto"
          >
            <CarouselContent>
              {selections.map((selection) => (
                <CarouselItem
                  key={selection.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="py-4">
                    <div className="bg-white rounded-xl shadow-xl p-4 space-y-4 hover:shadow-xl transition-shadow">
                      {/* Top Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image
                          src={selection.top_image}
                          alt="Top item"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Plus Sign */}
                      <div className="flex justify-center">
                        <div className="bg-purple-100 rounded-full p-2">
                          <Plus className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>

                      {/* Bottom Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <Image
                          src={selection.bottom_image}
                          alt="Bottom item"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </section>
      <Button
        onClick={() => {
          const recommendationsSection =
            document.getElementById("recommendations");
          if (recommendationsSection) {
            recommendationsSection.scrollIntoView({
              behavior: "smooth",
            });
          }
        }}
        className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 group"
        size="lg"
      >
        <span className="mr-2">See Recommendations</span>
        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
      </Button>
    </div>
  );
}
