"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Virtual Wardrobe", path: "/" },
  { name: "Selection", path: "/selection" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full shadow-lg sticky top-0 bg-white z-20 px-16">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-nowrap">SMART WARDROBE</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full justify-end gap-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-center ${
                pathname === item.path
                  ? "text-black border-b-2 border-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[200px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg py-2 px-4 rounded-md transition-colors duration-200",
                      pathname === item.path
                        ? "text-black font-semibold bg-gray-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
