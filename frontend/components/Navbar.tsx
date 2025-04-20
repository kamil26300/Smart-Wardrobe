"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Virtual Wardrobe", path: "/" },
    { name: "Selection", path: "/selection" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="w-full shadow-lg sticky top-0 bg-white z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-nowrap">SMART WARDROBE</h1>
        <div className="flex w-full justify-end gap-6">
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
      </div>
    </nav>
  );
};

export default Navbar;