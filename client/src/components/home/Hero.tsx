import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/happy_family_in_housing_complex_park.png";

export function Hero() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center text-center px-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Happy family in park" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full space-y-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Find a Home Where <br className="hidden md:block" />
            <span className="text-secondary">Your Family Thrives</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md max-w-2xl mx-auto">
            Affordable housing with the amenities busy parents need—safe neighborhoods, good schools, and room to grow.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-3 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2"
        >
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="City, Neighborhood, or School District" 
              className="pl-10 border-0 shadow-none text-lg h-12 focus-visible:ring-0 bg-transparent"
            />
          </div>
          <div className="w-px bg-border hidden md:block mx-2" />
          <Button size="lg" className="h-12 px-8 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all">
            <Search className="mr-2 h-5 w-5" />
            Search Homes
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-8 text-white/80 text-sm font-medium"
        >
          <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">🛡️ Verified Listings</span>
          <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">🏫 School Data Integrated</span>
          <span className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">💰 Income-Restricted Options</span>
        </motion.div>
      </div>
    </div>
  );
}
