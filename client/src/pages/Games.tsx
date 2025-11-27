import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { GAMES } from "@/data/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Games() {
  const [search, setSearch] = useState("");
  
  const filteredGames = GAMES.filter(game => 
    game.title.toLowerCase().includes(search.toLowerCase()) || 
    game.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">All Games</h1>
          <p className="text-muted-foreground">
            Play browser-based mini games for free. No download required.
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search games..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Link key={game.id} href={game.path}>
              <Card className="h-full hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-3 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <game.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{game.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{game.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {filteredGames.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No games found matching "{search}"
          </div>
        )}

        <AdPlaceholder className="mt-12 h-[100px]" label="Footer Ad" />
      </div>
    </Layout>
  );
}
