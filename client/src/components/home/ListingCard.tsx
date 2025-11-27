import { Listing } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, BedDouble, Bath, Ruler, School, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white h-full flex flex-col">
        <div className="relative h-56 overflow-hidden group">
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:text-red-500 transition-colors shadow-sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {listing.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium text-primary shadow-sm border-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-foreground line-clamp-1">{listing.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {listing.address}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">${listing.price}</div>
              <div className="text-xs text-muted-foreground">/month</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-grow">
          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-primary/70" />
              <span className="font-medium text-foreground">{listing.beds}</span> Bd
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-primary/70" />
              <span className="font-medium text-foreground">{listing.baths}</span> Ba
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-primary/70" />
              <span className="font-medium text-foreground">{listing.sqft}</span> sqft
            </div>
          </div>

          {/* Family Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <School className="h-4 w-4 text-secondary" />
              <span className="text-foreground font-medium truncate" title={listing.schoolDistrict}>{listing.schoolDistrict}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-foreground">Safety Rating: <span className="font-bold">{listing.rating}/5.0</span></span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 bg-slate-50/50 mt-auto border-t border-border/30">
          <Button className="w-full mt-4 rounded-xl font-semibold shadow-sm hover:shadow-md">
            Check Availability
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
