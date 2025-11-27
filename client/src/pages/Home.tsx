import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ListingCard } from "@/components/home/ListingCard";
import { NestBot } from "@/components/ai/NestBot";
import { MOCK_LISTINGS, POPULAR_SEARCHES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <Hero />
      
      <main className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-xl shadow-lg border border-border/50 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <span className="text-sm font-bold text-muted-foreground whitespace-nowrap mr-2">Quick Filters:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Button 
                key={term} 
                variant="outline" 
                size="sm" 
                className="rounded-full text-xs sm:text-sm whitespace-nowrap hover:border-primary hover:text-primary bg-slate-50"
              >
                {term}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
            <Button variant="outline" className="flex-1 lg:flex-none gap-2">
              <MapIcon className="h-4 w-4" />
              Map View
            </Button>
            <Button variant="outline" className="flex-1 lg:flex-none gap-2 border-dashed">
              <SlidersHorizontal className="h-4 w-4" />
              All Filters
            </Button>
          </div>
        </motion.div>

        {/* Listings Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Homes for You</h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing 3 matches based on your family profile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_LISTINGS.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <NestBot />
    </div>
  );
}
