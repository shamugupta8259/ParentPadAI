import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { TOOLS } from "@/data/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Tools() {
  const [search, setSearch] = useState("");
  
  const filteredTools = TOOLS.filter(tool => 
    tool.title.toLowerCase().includes(search.toLowerCase()) || 
    tool.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { id: "all", label: "All Tools" },
    { id: "tool-text", label: "Text" },
    { id: "tool-dev", label: "Developer" },
    { id: "tool-image", label: "Image" },
    { id: "tool-calc", label: "Calculators" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Online Tools</h1>
          <p className="text-muted-foreground">
            Free online tools for developers, students, and content creators.
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tools..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="flex flex-wrap h-auto justify-start gap-2 bg-transparent p-0">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTools
                  .filter(t => cat.id === "all" || t.category === cat.id)
                  .map((tool) => (
                    <Link key={tool.id} href={tool.path}>
                      <Card className="h-full hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                        <CardHeader>
                          <div className="mb-3 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
                            <tool.icon className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <AdPlaceholder className="mt-12 h-[100px]" label="Footer Ad" />
      </div>
    </Layout>
  );
}
