import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import botAvatar from "@assets/generated_images/friendly_ai_robot_avatar.png";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function NestBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm NestBot. I can help you find homes near specific schools, or check if a listing accepts pets. What are you looking for?"
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've updated your filters to include '3 bedrooms' and 'near playgrounds'. I found 3 new matches for you!"
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] shadow-2xl rounded-2xl overflow-hidden border border-border/50"
          >
            <Card className="h-[500px] flex flex-col bg-white border-0">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white p-1 overflow-hidden shadow-inner">
                    <img src={botAvatar} alt="NestBot" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">NestBot AI</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      Online & Ready
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white border border-border text-foreground rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-border flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about schools, safety..." 
                  className="rounded-full border-border focus-visible:ring-primary bg-slate-50"
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  className="rounded-full h-10 w-10 bg-secondary hover:bg-secondary/90 text-secondary-foreground shrink-0"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors border-2 border-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
