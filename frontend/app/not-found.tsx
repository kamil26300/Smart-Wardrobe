"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-2">
      {/* Top Gradient Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 z-20" />
      <div className="w-full max-w-2xl px-4 text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4 animate-bounce">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* 404 Text with Animation */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-pulse">
          404
        </h1>

        {/* Error Messages */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-800">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button
              variant="default"
              className="space-x-2 min-w-[200px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              <HomeIcon size={16} />
              <span>Return Home</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            className="min-w-[200px]"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">
            If you believe this is a mistake or need assistance, please contact
            our support team or try these common solutions:
          </p>
          <ul className="text-sm text-gray-600 mt-2 text-left list-disc list-inside">
            <li>Check the URL for typos</li>
            <li>Clear your browser cache</li>
            <li>Check your internet connection</li>
          </ul>
        </div>
      </div>
      {/* Bottom Gradient Bar */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
    </div>
  );
}
