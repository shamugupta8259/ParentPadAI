import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { GAMES, TOOLS } from "@/data/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, Flame } from "lucide-react";

export default function Home() {
  const featuredGames = GAMES.filter(g => g.isPopular).slice(0, 4);
  const featuredTools = TOOLS.filter(t => t.isPopular).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 text-center bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Play Games. <span className="text-primary/80">Fix Data.</span> <br className="hidden sm:inline" />
            All in One Place.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A collection of addictive mini-games and essential online tools for developers, writers, and students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/games">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                Play Games
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                Use Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Ad Space */}
        <AdPlaceholder className="h-[120px] w-full max-w-4xl mx-auto" label="Top Banner Ad" />

        {/* Featured Games */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <Flame className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Trending Games</h2>
            </div>
            <Link href="/games">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <Link key={game.id} href={game.path}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-muted/60">
                  <CardHeader>
                    <div className="mb-2 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
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
        </section>

        {/* Featured Tools */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Star className="h-6 w-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Popular Tools</h2>
            </div>
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => (
              <Link key={tool.id} href={tool.path}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-muted/60">
                  <CardHeader>
                    <div className="mb-2 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Ad Space */}
        <AdPlaceholder className="h-[250px] w-full max-w-3xl mx-auto" label="Large Rectangle Ad" />
      </div>
    </Layout>
  );
}
