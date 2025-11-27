import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";

// --- Age Calculator ---
export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{ years: number, months: number, days: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();

    // Simplified diff logic
    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;
    const days = differenceInDays(now, birth) % 30; // Approximation for UI simplicity

    setResult({ years, months, days });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label>Date of Birth</Label>
        <Input 
          type="date" 
          value={birthDate} 
          onChange={(e) => setBirthDate(e.target.value)} 
        />
      </div>
      <Button className="w-full" onClick={calculate}>Calculate Age</Button>

      {result && (
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold mb-2">{result.years}</div>
            <div className="text-sm opacity-80 mb-4">YEARS OLD</div>
            
            <div className="flex justify-center gap-6 text-sm border-t border-white/20 pt-4">
              <div>
                <div className="font-bold text-lg">{result.months}</div>
                <div className="opacity-70">Months</div>
              </div>
              <div>
                <div className="font-bold text-lg">{result.days}</div>
                <div className="opacity-70">Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- Percentage Calculator ---
export function PercentageCalculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [mode, setMode] = useState<'percentOf' | 'percentChange'>('percentOf');

  const calculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    if (isNaN(n1) || isNaN(n2)) return;

    if (mode === 'percentOf') {
      // What is X% of Y?
      setResult((n1 / 100) * n2);
    } else {
      // X is what % of Y?
      setResult((n1 / n2) * 100);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="space-y-4">
        <Label>Calculation Type</Label>
        <div className="flex gap-2">
          <Button 
            variant={mode === 'percentOf' ? 'default' : 'outline'}
            onClick={() => setMode('percentOf')}
          >
            % of Number
          </Button>
          <Button 
            variant={mode === 'percentChange' ? 'default' : 'outline'}
            onClick={() => setMode('percentChange')}
          >
            Number is % of
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-lg">
        {mode === 'percentOf' ? (
          <>
            <span>What is</span>
            <Input 
              type="number" 
              className="w-24 text-center" 
              value={num1} 
              onChange={(e) => setNum1(e.target.value)}
            />
            <span>% of</span>
            <Input 
              type="number" 
              className="w-24 text-center" 
              value={num2} 
              onChange={(e) => setNum2(e.target.value)}
            />
          </>
        ) : (
          <>
            <Input 
              type="number" 
              className="w-24 text-center" 
              value={num1} 
              onChange={(e) => setNum1(e.target.value)}
            />
            <span>is what % of</span>
            <Input 
              type="number" 
              className="w-24 text-center" 
              value={num2} 
              onChange={(e) => setNum2(e.target.value)}
            />
          </>
        )}
      </div>

      <Button className="w-full" onClick={calculate}>Calculate</Button>

      {result !== null && (
        <div className="text-center p-6 bg-muted rounded-xl">
          <div className="text-sm text-muted-foreground mb-2">Result</div>
          <div className="text-4xl font-bold text-primary">
            {result.toFixed(2)}{mode === 'percentChange' ? '%' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
