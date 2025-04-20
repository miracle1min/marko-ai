import { useState } from "react";
import { 
  DollarSign, Calculator, BarChart, Percent, TrendingUp, 
  ArrowRight, RefreshCcw, Download, Info, BarChart2, 
  ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "IDR") => {
  if (!amount && amount !== 0) return "-";
  
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency, 
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to format percent
const formatPercent = (value: number) => {
  if (!value && value !== 0) return "-";
  return `${value.toFixed(2)}%`;
};

interface CalculationResult {
  value: number | null;
  formula?: string;
  description?: string;
}

type CalculatorType = 
  | "roi" 
  | "breakeven" 
  | "profit-margin" 
  | "markup"
  | "discount"
  | "loan"
  | "compound-interest"
  | "depreciation";

export default function FinancialCalculator() {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("roi");
  const { toast } = useToast();
  
  // ROI Calculator
  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: "" as string | number,
    finalValue: "" as string | number,
    timeInYears: "1" as string | number,
  });
  const [roiResult, setRoiResult] = useState<CalculationResult>({ value: null });
  
  // Break-Even Calculator
  const [breakEvenInputs, setBreakEvenInputs] = useState({
    fixedCosts: "" as string | number,
    sellingPricePerUnit: "" as string | number,
    variableCostPerUnit: "" as string | number,
  });
  const [breakEvenResult, setBreakEvenResult] = useState<CalculationResult>({ value: null });
  
  // Profit Margin Calculator
  const [marginInputs, setMarginInputs] = useState({
    revenue: "" as string | number,
    cost: "" as string | number,
  });
  const [marginResult, setMarginResult] = useState<CalculationResult>({ value: null });
  
  // Markup Calculator
  const [markupInputs, setMarkupInputs] = useState({
    cost: "" as string | number,
    markupPercent: "" as string | number,
  });
  const [markupResult, setMarkupResult] = useState<CalculationResult>({ value: null });
  
  // Discount Calculator
  const [discountInputs, setDiscountInputs] = useState({
    originalPrice: "" as string | number,
    discountPercent: "" as string | number,
  });
  const [discountResult, setDiscountResult] = useState<CalculationResult>({ value: null });
  
  // Loan Calculator
  const [loanInputs, setLoanInputs] = useState({
    loanAmount: "" as string | number,
    interestRate: "" as string | number,
    loanTermYears: "" as string | number,
    paymentFrequency: "monthly" as "monthly" | "quarterly" | "yearly",
  });
  const [loanResult, setLoanResult] = useState<CalculationResult>({ value: null });
  const [loanSchedule, setLoanSchedule] = useState<any[]>([]);
  
  // Compound Interest Calculator
  const [compoundInputs, setCompoundInputs] = useState({
    principal: "" as string | number,
    annualInterestRate: "" as string | number,
    timeYears: "" as string | number,
    compoundFrequency: "12" as string | number, // 12 = monthly
    additionalContribution: "0" as string | number,
    contributionFrequency: "monthly" as "monthly" | "quarterly" | "yearly",
  });
  const [compoundResult, setCompoundResult] = useState<CalculationResult>({ value: null });
  
  // Depreciation Calculator
  const [depreciationInputs, setDepreciationInputs] = useState({
    assetCost: "" as string | number,
    salvageValue: "0" as string | number,
    usefulLifeYears: "" as string | number,
    method: "straight-line" as "straight-line" | "double-declining" | "sum-of-years",
  });
  const [depreciationResult, setDepreciationResult] = useState<CalculationResult>({ value: null });
  const [depreciationSchedule, setDepreciationSchedule] = useState<any[]>([]);
  
  // Handle ROI calculation
  const calculateROI = () => {
    try {
      const initialInvestment = Number(roiInputs.initialInvestment);
      const finalValue = Number(roiInputs.finalValue);
      const timeInYears = Number(roiInputs.timeInYears);
      
      if (isNaN(initialInvestment) || isNaN(finalValue) || isNaN(timeInYears) || initialInvestment <= 0 || timeInYears <= 0) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar",
          variant: "destructive",
        });
        return;
      }
      
      const totalReturn = finalValue - initialInvestment;
      const roi = (totalReturn / initialInvestment) * 100;
      const annualizedRoi = ((Math.pow((finalValue / initialInvestment), (1 / timeInYears))) - 1) * 100;
      
      setRoiResult({
        value: annualizedRoi,
        formula: `ROI = ((${formatCurrency(finalValue)} / ${formatCurrency(initialInvestment)})^(1/${timeInYears}) - 1) × 100%`,
        description: `Investasi awal sebesar ${formatCurrency(initialInvestment)} menghasilkan nilai akhir ${formatCurrency(finalValue)} dalam ${timeInYears} tahun, menghasilkan ROI tahunan sebesar ${formatPercent(annualizedRoi)}.`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `ROI Tahunan: ${formatPercent(annualizedRoi)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung ROI",
        variant: "destructive",
      });
    }
  };
  
  // Handle Break-Even calculation
  const calculateBreakEven = () => {
    try {
      const fixedCosts = Number(breakEvenInputs.fixedCosts);
      const sellingPricePerUnit = Number(breakEvenInputs.sellingPricePerUnit);
      const variableCostPerUnit = Number(breakEvenInputs.variableCostPerUnit);
      
      if (isNaN(fixedCosts) || isNaN(sellingPricePerUnit) || isNaN(variableCostPerUnit) || 
          fixedCosts < 0 || sellingPricePerUnit <= 0 || variableCostPerUnit < 0 ||
          sellingPricePerUnit <= variableCostPerUnit) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar dan harga jual > biaya variabel",
          variant: "destructive",
        });
        return;
      }
      
      const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
      const breakEvenPoint = fixedCosts / contributionMargin;
      
      setBreakEvenResult({
        value: breakEvenPoint,
        formula: `BEP = ${formatCurrency(fixedCosts)} / (${formatCurrency(sellingPricePerUnit)} - ${formatCurrency(variableCostPerUnit)})`,
        description: `Dengan biaya tetap ${formatCurrency(fixedCosts)}, harga jual per unit ${formatCurrency(sellingPricePerUnit)}, dan biaya variabel per unit ${formatCurrency(variableCostPerUnit)}, bisnis perlu menjual ${Math.ceil(breakEvenPoint)} unit untuk mencapai titik impas (Break-Even Point).`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Break-Even Point: ${Math.ceil(breakEvenPoint)} unit`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung titik impas",
        variant: "destructive",
      });
    }
  };
  
  // Handle Profit Margin calculation
  const calculateMargin = () => {
    try {
      const revenue = Number(marginInputs.revenue);
      const cost = Number(marginInputs.cost);
      
      if (isNaN(revenue) || isNaN(cost) || revenue <= 0 || cost < 0 || cost > revenue) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar dan pendapatan > biaya",
          variant: "destructive",
        });
        return;
      }
      
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      
      setMarginResult({
        value: margin,
        formula: `Margin = ((${formatCurrency(revenue)} - ${formatCurrency(cost)}) / ${formatCurrency(revenue)}) × 100%`,
        description: `Dengan pendapatan ${formatCurrency(revenue)} dan biaya ${formatCurrency(cost)}, profit margin adalah ${formatPercent(margin)}.`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Profit Margin: ${formatPercent(margin)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung margin",
        variant: "destructive",
      });
    }
  };
  
  // Handle Markup calculation
  const calculateMarkup = () => {
    try {
      const cost = Number(markupInputs.cost);
      const markupPercent = Number(markupInputs.markupPercent);
      
      if (isNaN(cost) || isNaN(markupPercent) || cost <= 0 || markupPercent < 0) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar",
          variant: "destructive",
        });
        return;
      }
      
      const markup = cost * (markupPercent / 100);
      const sellingPrice = cost + markup;
      
      setMarkupResult({
        value: sellingPrice,
        formula: `Harga Jual = ${formatCurrency(cost)} + (${formatCurrency(cost)} × ${markupPercent}%)`,
        description: `Dengan biaya ${formatCurrency(cost)} dan markup ${markupPercent}%, harga jual yang direkomendasikan adalah ${formatCurrency(sellingPrice)}.`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Harga Jual: ${formatCurrency(sellingPrice)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung markup",
        variant: "destructive",
      });
    }
  };
  
  // Handle Discount calculation
  const calculateDiscount = () => {
    try {
      const originalPrice = Number(discountInputs.originalPrice);
      const discountPercent = Number(discountInputs.discountPercent);
      
      if (isNaN(originalPrice) || isNaN(discountPercent) || originalPrice <= 0 || discountPercent < 0 || discountPercent > 100) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar",
          variant: "destructive",
        });
        return;
      }
      
      const discountAmount = originalPrice * (discountPercent / 100);
      const finalPrice = originalPrice - discountAmount;
      
      setDiscountResult({
        value: finalPrice,
        formula: `Harga Akhir = ${formatCurrency(originalPrice)} - (${formatCurrency(originalPrice)} × ${discountPercent}%)`,
        description: `Dengan harga asli ${formatCurrency(originalPrice)} dan diskon ${discountPercent}%, harga akhir adalah ${formatCurrency(finalPrice)}.`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Harga Setelah Diskon: ${formatCurrency(finalPrice)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung diskon",
        variant: "destructive",
      });
    }
  };
  
  // Handle Loan calculation
  const calculateLoan = () => {
    try {
      const loanAmount = Number(loanInputs.loanAmount);
      const interestRate = Number(loanInputs.interestRate);
      const loanTermYears = Number(loanInputs.loanTermYears);
      const paymentFrequency = loanInputs.paymentFrequency;
      
      if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTermYears) || 
          loanAmount <= 0 || interestRate <= 0 || loanTermYears <= 0) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate payments per year based on frequency
      let paymentsPerYear = 12;
      if (paymentFrequency === 'quarterly') paymentsPerYear = 4;
      if (paymentFrequency === 'yearly') paymentsPerYear = 1;
      
      const totalPayments = loanTermYears * paymentsPerYear;
      const interestRatePerPeriod = (interestRate / 100) / paymentsPerYear;
      
      // Calculate payment using the formula for periodic payments
      const payment = loanAmount * (
        interestRatePerPeriod * Math.pow(1 + interestRatePerPeriod, totalPayments)
      ) / (
        Math.pow(1 + interestRatePerPeriod, totalPayments) - 1
      );
      
      setLoanResult({
        value: payment,
        formula: `PMT = ${formatCurrency(loanAmount)} × [r(1+r)^n] / [(1+r)^n - 1]`,
        description: `Dengan pinjaman ${formatCurrency(loanAmount)}, suku bunga ${interestRate}% per tahun, dan jangka waktu ${loanTermYears} tahun, pembayaran ${paymentFrequency === 'monthly' ? 'bulanan' : paymentFrequency === 'quarterly' ? 'kuartalan' : 'tahunan'} adalah ${formatCurrency(payment)}.`
      });
      
      // Generate amortization schedule
      const schedule = [];
      let remainingBalance = loanAmount;
      let totalInterestPaid = 0;
      
      for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = remainingBalance * interestRatePerPeriod;
        const principalPayment = payment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterestPaid += interestPayment;
        
        schedule.push({
          period: i,
          payment: payment,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          totalInterestPaid: totalInterestPaid,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
      
      setLoanSchedule(schedule);
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Pembayaran ${paymentFrequency === 'monthly' ? 'Bulanan' : paymentFrequency === 'quarterly' ? 'Kuartalan' : 'Tahunan'}: ${formatCurrency(payment)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung pinjaman",
        variant: "destructive",
      });
    }
  };
  
  // Handle Compound Interest calculation
  const calculateCompoundInterest = () => {
    try {
      const principal = Number(compoundInputs.principal);
      const annualInterestRate = Number(compoundInputs.annualInterestRate);
      const timeYears = Number(compoundInputs.timeYears);
      const compoundFrequency = Number(compoundInputs.compoundFrequency);
      const additionalContribution = Number(compoundInputs.additionalContribution || 0);
      const contributionFrequency = compoundInputs.contributionFrequency;
      
      if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(timeYears) || isNaN(compoundFrequency) ||
          principal <= 0 || annualInterestRate < 0 || timeYears <= 0 || compoundFrequency <= 0) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar",
          variant: "destructive",
        });
        return;
      }
      
      // Convert annual rate to per period rate
      const ratePerPeriod = (annualInterestRate / 100) / compoundFrequency;
      const totalPeriods = timeYears * compoundFrequency;
      
      // Calculate contributions per compounding period
      let contributionsPerPeriod = 0;
      if (additionalContribution > 0) {
        if (contributionFrequency === 'monthly' && compoundFrequency === 12) {
          contributionsPerPeriod = additionalContribution;
        } else if (contributionFrequency === 'monthly' && compoundFrequency === 4) {
          contributionsPerPeriod = additionalContribution * 3;
        } else if (contributionFrequency === 'monthly' && compoundFrequency === 1) {
          contributionsPerPeriod = additionalContribution * 12;
        } else if (contributionFrequency === 'quarterly' && compoundFrequency === 12) {
          contributionsPerPeriod = additionalContribution / 3;
        } else if (contributionFrequency === 'quarterly' && compoundFrequency === 4) {
          contributionsPerPeriod = additionalContribution;
        } else if (contributionFrequency === 'quarterly' && compoundFrequency === 1) {
          contributionsPerPeriod = additionalContribution * 4;
        } else if (contributionFrequency === 'yearly' && compoundFrequency === 12) {
          contributionsPerPeriod = additionalContribution / 12;
        } else if (contributionFrequency === 'yearly' && compoundFrequency === 4) {
          contributionsPerPeriod = additionalContribution / 4;
        } else if (contributionFrequency === 'yearly' && compoundFrequency === 1) {
          contributionsPerPeriod = additionalContribution;
        }
      }
      
      // Calculate future value with regular contributions
      let futureValue;
      if (contributionsPerPeriod > 0) {
        // Future value with regular contributions
        futureValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods) + 
                    contributionsPerPeriod * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
      } else {
        // Simple compound interest without additional contributions
        futureValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
      }
      
      setCompoundResult({
        value: futureValue,
        formula: contributionsPerPeriod > 0 
          ? `FV = P(1+r)^n + PMT[(1+r)^n - 1]/r`
          : `FV = P(1+r)^n`,
        description: `Dengan investasi awal ${formatCurrency(principal)}, suku bunga ${annualInterestRate}% per tahun (dicompound ${compoundFrequency === 12 ? 'bulanan' : compoundFrequency === 4 ? 'kuartalan' : 'tahunan'}), dan jangka waktu ${timeYears} tahun${additionalContribution > 0 ? ` plus kontribusi ${formatCurrency(additionalContribution)} per ${contributionFrequency === 'monthly' ? 'bulan' : contributionFrequency === 'quarterly' ? 'kuartal' : 'tahun'}` : ''}, nilai akhir investasi adalah ${formatCurrency(futureValue)}.`
      });
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Nilai Akhir Investasi: ${formatCurrency(futureValue)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung bunga majemuk",
        variant: "destructive",
      });
    }
  };
  
  // Handle Depreciation calculation
  const calculateDepreciation = () => {
    try {
      const assetCost = Number(depreciationInputs.assetCost);
      const salvageValue = Number(depreciationInputs.salvageValue);
      const usefulLifeYears = Number(depreciationInputs.usefulLifeYears);
      const method = depreciationInputs.method;
      
      if (isNaN(assetCost) || isNaN(salvageValue) || isNaN(usefulLifeYears) || 
          assetCost <= 0 || salvageValue < 0 || usefulLifeYears <= 0 || 
          salvageValue >= assetCost) {
        toast({
          title: "Input tidak valid",
          description: "Pastikan semua angka diisi dengan benar dan nilai sisa < biaya aset",
          variant: "destructive",
        });
        return;
      }
      
      let depreciableAmount = assetCost - salvageValue;
      let schedule = [];
      let totalDepreciation = 0;
      let firstYearDepreciation = 0;
      
      if (method === "straight-line") {
        // Straight-line method
        const annualDepreciation = depreciableAmount / usefulLifeYears;
        firstYearDepreciation = annualDepreciation;
        
        for (let year = 1; year <= usefulLifeYears; year++) {
          totalDepreciation += annualDepreciation;
          schedule.push({
            year,
            depreciation: annualDepreciation,
            totalDepreciation,
            remainingValue: assetCost - totalDepreciation
          });
        }
        
        setDepreciationResult({
          value: annualDepreciation,
          formula: `Depresiasi Tahunan = (${formatCurrency(assetCost)} - ${formatCurrency(salvageValue)}) / ${usefulLifeYears}`,
          description: `Dengan metode straight-line, aset senilai ${formatCurrency(assetCost)} dengan nilai sisa ${formatCurrency(salvageValue)} dan masa pakai ${usefulLifeYears} tahun, akan terdepresiasi ${formatCurrency(annualDepreciation)} per tahun.`
        });
      } else if (method === "double-declining") {
        // Double-declining balance method
        const straightLineRate = 1 / usefulLifeYears;
        const doubleRate = straightLineRate * 2;
        let bookValue = assetCost;
        
        for (let year = 1; year <= usefulLifeYears; year++) {
          let annualDepreciation = bookValue * doubleRate;
          
          // Check if we're approaching salvage value
          if (bookValue - annualDepreciation < salvageValue) {
            annualDepreciation = bookValue - salvageValue;
          }
          
          // Store first year depreciation
          if (year === 1) {
            firstYearDepreciation = annualDepreciation;
          }
          
          bookValue -= annualDepreciation;
          totalDepreciation += annualDepreciation;
          
          schedule.push({
            year,
            depreciation: annualDepreciation,
            totalDepreciation,
            remainingValue: bookValue
          });
          
          // If book value reaches salvage value, stop calculating
          if (bookValue <= salvageValue) break;
        }
        
        setDepreciationResult({
          value: firstYearDepreciation,
          formula: `Depresiasi Tahun 1 = ${formatCurrency(assetCost)} × (2 / ${usefulLifeYears})`,
          description: `Dengan metode double-declining balance, aset senilai ${formatCurrency(assetCost)} dengan masa pakai ${usefulLifeYears} tahun, akan terdepresiasi ${formatCurrency(firstYearDepreciation)} pada tahun pertama.`
        });
      } else if (method === "sum-of-years") {
        // Sum-of-years-digits method
        const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
        let bookValue = assetCost;
        
        for (let year = 1; year <= usefulLifeYears; year++) {
          const factor = (usefulLifeYears - year + 1) / sumOfYears;
          const annualDepreciation = depreciableAmount * factor;
          
          // Store first year depreciation
          if (year === 1) {
            firstYearDepreciation = annualDepreciation;
          }
          
          bookValue -= annualDepreciation;
          totalDepreciation += annualDepreciation;
          
          schedule.push({
            year,
            depreciation: annualDepreciation,
            totalDepreciation,
            remainingValue: bookValue
          });
        }
        
        setDepreciationResult({
          value: firstYearDepreciation,
          formula: `Depresiasi Tahun 1 = (${formatCurrency(assetCost)} - ${formatCurrency(salvageValue)}) × (${usefulLifeYears} / ${sumOfYears})`,
          description: `Dengan metode sum-of-years-digits, aset senilai ${formatCurrency(assetCost)} dengan nilai sisa ${formatCurrency(salvageValue)} dan masa pakai ${usefulLifeYears} tahun, akan terdepresiasi ${formatCurrency(firstYearDepreciation)} pada tahun pertama.`
        });
      }
      
      setDepreciationSchedule(schedule);
      
      toast({
        title: "Perhitungan Berhasil",
        description: `Depresiasi Tahun Pertama: ${formatCurrency(firstYearDepreciation)}`,
      });
    } catch (error) {
      toast({
        title: "Gagal menghitung",
        description: "Terjadi kesalahan saat menghitung depresiasi",
        variant: "destructive",
      });
    }
  };
  
  // Reset all form inputs for the current calculator
  const resetForm = () => {
    switch (calculatorType) {
      case "roi":
        setRoiInputs({
          initialInvestment: "",
          finalValue: "",
          timeInYears: "1",
        });
        setRoiResult({ value: null });
        break;
      case "breakeven":
        setBreakEvenInputs({
          fixedCosts: "",
          sellingPricePerUnit: "",
          variableCostPerUnit: "",
        });
        setBreakEvenResult({ value: null });
        break;
      case "profit-margin":
        setMarginInputs({
          revenue: "",
          cost: "",
        });
        setMarginResult({ value: null });
        break;
      case "markup":
        setMarkupInputs({
          cost: "",
          markupPercent: "",
        });
        setMarkupResult({ value: null });
        break;
      case "discount":
        setDiscountInputs({
          originalPrice: "",
          discountPercent: "",
        });
        setDiscountResult({ value: null });
        break;
      case "loan":
        setLoanInputs({
          loanAmount: "",
          interestRate: "",
          loanTermYears: "",
          paymentFrequency: "monthly",
        });
        setLoanResult({ value: null });
        setLoanSchedule([]);
        break;
      case "compound-interest":
        setCompoundInputs({
          principal: "",
          annualInterestRate: "",
          timeYears: "",
          compoundFrequency: "12",
          additionalContribution: "0",
          contributionFrequency: "monthly",
        });
        setCompoundResult({ value: null });
        break;
      case "depreciation":
        setDepreciationInputs({
          assetCost: "",
          salvageValue: "0",
          usefulLifeYears: "",
          method: "straight-line",
        });
        setDepreciationResult({ value: null });
        setDepreciationSchedule([]);
        break;
    }
    
    toast({
      title: "Form Direset",
      description: "Semua nilai telah dikosongkan",
    });
  };
  
  // Calculate button click handler based on calculator type
  const handleCalculate = () => {
    switch (calculatorType) {
      case "roi":
        calculateROI();
        break;
      case "breakeven":
        calculateBreakEven();
        break;
      case "profit-margin":
        calculateMargin();
        break;
      case "markup":
        calculateMarkup();
        break;
      case "discount":
        calculateDiscount();
        break;
      case "loan":
        calculateLoan();
        break;
      case "compound-interest":
        calculateCompoundInterest();
        break;
      case "depreciation":
        calculateDepreciation();
        break;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6 dark:bg-slate-900">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Financial Calculator", path: "/tools/financial-calculator", isActive: true }
        ]} 
      />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2 flex items-center justify-center">
          <DollarSign className="text-green-600 mr-2" /> 
          Financial Calculator
        </h1>
        <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
          Tool gratis untuk menghitung berbagai metrik keuangan bisnis seperti ROI, Break Even Point, Margin, dan lainnya.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with calculator options */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Calculator className="mr-2 text-green-600" />
                Pilih Kalkulator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <Button 
                  variant={calculatorType === "roi" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "roi" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("roi")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Return on Investment (ROI)
                </Button>
                <Button 
                  variant={calculatorType === "breakeven" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "breakeven" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("breakeven")}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Break-Even Analysis
                </Button>
                <Button 
                  variant={calculatorType === "profit-margin" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "profit-margin" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("profit-margin")}
                >
                  <Percent className="mr-2 h-4 w-4" />
                  Profit Margin
                </Button>
                <Button 
                  variant={calculatorType === "markup" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "markup" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("markup")}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Price Markup
                </Button>
                <Button 
                  variant={calculatorType === "discount" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "discount" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("discount")}
                >
                  <Percent className="mr-2 h-4 w-4" />
                  Discount Calculator
                </Button>
                <Button 
                  variant={calculatorType === "loan" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "loan" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("loan")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Loan Calculator
                </Button>
                <Button 
                  variant={calculatorType === "compound-interest" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "compound-interest" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("compound-interest")}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Compound Interest
                </Button>
                <Button 
                  variant={calculatorType === "depreciation" ? "default" : "ghost"} 
                  className={`justify-start rounded-none ${calculatorType === "depreciation" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                  onClick={() => setCalculatorType("depreciation")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Depreciation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side with calculator forms and results */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {calculatorType === "roi" && "Return on Investment (ROI) Calculator"}
                {calculatorType === "breakeven" && "Break-Even Point Calculator"}
                {calculatorType === "profit-margin" && "Profit Margin Calculator"}
                {calculatorType === "markup" && "Price Markup Calculator"}
                {calculatorType === "discount" && "Discount Calculator"}
                {calculatorType === "loan" && "Loan Amortization Calculator"}
                {calculatorType === "compound-interest" && "Compound Interest Calculator"}
                {calculatorType === "depreciation" && "Depreciation Calculator"}
              </CardTitle>
              <CardDescription>
                {calculatorType === "roi" && "Hitung imbal hasil investasi Anda dengan mempertimbangkan nilai awal, akhir, dan durasi investasi."}
                {calculatorType === "breakeven" && "Hitung berapa unit yang harus dijual untuk mencapai titik impas."}
                {calculatorType === "profit-margin" && "Hitung persentase profit margin dari pendapatan dan biaya."}
                {calculatorType === "markup" && "Hitung harga jual berdasarkan biaya produk dan persentase markup."}
                {calculatorType === "discount" && "Hitung harga setelah diskon berdasarkan persentase diskon."}
                {calculatorType === "loan" && "Hitung angsuran pinjaman dan buat jadwal pembayaran."}
                {calculatorType === "compound-interest" && "Hitung pertumbuhan investasi dengan bunga majemuk."}
                {calculatorType === "depreciation" && "Hitung depresiasi aset tetap dengan berbagai metode."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* ROI Calculator Form */}
              {calculatorType === "roi" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initialInvestment">
                        Investasi Awal (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jumlah uang yang diinvestasikan pada awal periode.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="initialInvestment"
                        type="number"
                        placeholder="100,000,000"
                        value={roiInputs.initialInvestment}
                        onChange={(e) => setRoiInputs({...roiInputs, initialInvestment: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="finalValue">
                        Nilai Akhir (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nilai akhir investasi setelah periode tertentu.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="finalValue"
                        type="number"
                        placeholder="150,000,000"
                        value={roiInputs.finalValue}
                        onChange={(e) => setRoiInputs({...roiInputs, finalValue: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="timeInYears">
                      Jangka Waktu (Tahun)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Durasi investasi dalam tahun. Digunakan untuk menghitung ROI tahunan.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="timeInYears"
                      type="number"
                      placeholder="5"
                      value={roiInputs.timeInYears}
                      onChange={(e) => setRoiInputs({...roiInputs, timeInYears: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              {/* Break-Even Calculator Form */}
              {calculatorType === "breakeven" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">
                      Biaya Tetap (Rp)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total biaya tetap yang tidak berubah meskipun volume produksi berubah.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="fixedCosts"
                      type="number"
                      placeholder="5,000,000"
                      value={breakEvenInputs.fixedCosts}
                      onChange={(e) => setBreakEvenInputs({...breakEvenInputs, fixedCosts: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sellingPricePerUnit">
                        Harga Jual per Unit (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Harga jual satu unit produk atau layanan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="sellingPricePerUnit"
                        type="number"
                        placeholder="100,000"
                        value={breakEvenInputs.sellingPricePerUnit}
                        onChange={(e) => setBreakEvenInputs({...breakEvenInputs, sellingPricePerUnit: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variableCostPerUnit">
                        Biaya Variabel per Unit (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Biaya yang berubah tergantung pada jumlah unit yang diproduksi.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="variableCostPerUnit"
                        type="number"
                        placeholder="60,000"
                        value={breakEvenInputs.variableCostPerUnit}
                        onChange={(e) => setBreakEvenInputs({...breakEvenInputs, variableCostPerUnit: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profit Margin Calculator Form */}
              {calculatorType === "profit-margin" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="revenue">
                        Pendapatan (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total pendapatan dari penjualan produk atau layanan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="revenue"
                        type="number"
                        placeholder="10,000,000"
                        value={marginInputs.revenue}
                        onChange={(e) => setMarginInputs({...marginInputs, revenue: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">
                        Biaya (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total biaya yang dikeluarkan untuk menghasilkan pendapatan tersebut.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="7,000,000"
                        value={marginInputs.cost}
                        onChange={(e) => setMarginInputs({...marginInputs, cost: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Markup Calculator Form */}
              {calculatorType === "markup" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cost">
                        Biaya Produk (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Biaya yang dikeluarkan untuk produk atau layanan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="75,000"
                        value={markupInputs.cost}
                        onChange={(e) => setMarkupInputs({...markupInputs, cost: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="markupPercent">
                        Markup (%)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Persentase markup yang ingin ditambahkan ke biaya produk.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="markupPercent"
                        type="number"
                        placeholder="30"
                        value={markupInputs.markupPercent}
                        onChange={(e) => setMarkupInputs({...markupInputs, markupPercent: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Discount Calculator Form */}
              {calculatorType === "discount" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">
                        Harga Asli (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Harga awal produk sebelum diskon.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="100,000"
                        value={discountInputs.originalPrice}
                        onChange={(e) => setDiscountInputs({...discountInputs, originalPrice: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountPercent">
                        Diskon (%)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Persentase diskon yang diterapkan pada harga asli.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="discountPercent"
                        type="number"
                        placeholder="20"
                        value={discountInputs.discountPercent}
                        onChange={(e) => setDiscountInputs({...discountInputs, discountPercent: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Loan Calculator Form */}
              {calculatorType === "loan" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">
                        Jumlah Pinjaman (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jumlah total pinjaman yang diambil.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="100,000,000"
                        value={loanInputs.loanAmount}
                        onChange={(e) => setLoanInputs({...loanInputs, loanAmount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">
                        Suku Bunga (% per tahun)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Suku bunga tahunan yang dikenakan pada pinjaman.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="interestRate"
                        type="number"
                        placeholder="10"
                        value={loanInputs.interestRate}
                        onChange={(e) => setLoanInputs({...loanInputs, interestRate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="loanTermYears">
                        Jangka Waktu (Tahun)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Durasi pinjaman dalam tahun.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="loanTermYears"
                        type="number"
                        placeholder="5"
                        value={loanInputs.loanTermYears}
                        onChange={(e) => setLoanInputs({...loanInputs, loanTermYears: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">
                        Frekuensi Pembayaran
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seberapa sering pembayaran dilakukan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select
                        value={loanInputs.paymentFrequency}
                        onValueChange={(value) => setLoanInputs({...loanInputs, paymentFrequency: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                          <SelectItem value="quarterly">Kuartalan</SelectItem>
                          <SelectItem value="yearly">Tahunan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Compound Interest Calculator Form */}
              {calculatorType === "compound-interest" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="principal">
                        Nilai Awal (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jumlah investasi awal.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="principal"
                        type="number"
                        placeholder="10,000,000"
                        value={compoundInputs.principal}
                        onChange={(e) => setCompoundInputs({...compoundInputs, principal: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualInterestRate">
                        Suku Bunga (% per tahun)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Suku bunga tahunan yang diperoleh dari investasi.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="annualInterestRate"
                        type="number"
                        placeholder="8"
                        value={compoundInputs.annualInterestRate}
                        onChange={(e) => setCompoundInputs({...compoundInputs, annualInterestRate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timeYears">
                        Jangka Waktu (Tahun)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Berapa lama investasi akan berlangsung.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="timeYears"
                        type="number"
                        placeholder="10"
                        value={compoundInputs.timeYears}
                        onChange={(e) => setCompoundInputs({...compoundInputs, timeYears: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compoundFrequency">
                        Frekuensi Compound
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seberapa sering bunga dicompound dalam setahun.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select
                        value={String(compoundInputs.compoundFrequency)}
                        onValueChange={(value) => setCompoundInputs({...compoundInputs, compoundFrequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">Bulanan</SelectItem>
                          <SelectItem value="4">Kuartalan</SelectItem>
                          <SelectItem value="1">Tahunan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="additionalContribution">
                        Kontribusi Tambahan (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Jumlah tambahan yang diinvestasikan secara berkala.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="additionalContribution"
                        type="number"
                        placeholder="500,000"
                        value={compoundInputs.additionalContribution}
                        onChange={(e) => setCompoundInputs({...compoundInputs, additionalContribution: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contributionFrequency">
                        Frekuensi Kontribusi
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seberapa sering kontribusi tambahan dilakukan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select
                        value={compoundInputs.contributionFrequency}
                        onValueChange={(value) => setCompoundInputs({...compoundInputs, contributionFrequency: value as any})}
                        disabled={Number(compoundInputs.additionalContribution) <= 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                          <SelectItem value="quarterly">Kuartalan</SelectItem>
                          <SelectItem value="yearly">Tahunan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Depreciation Calculator Form */}
              {calculatorType === "depreciation" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="assetCost">
                        Biaya Aset (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Harga pembelian atau biaya aset awal.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="assetCost"
                        type="number"
                        placeholder="100,000,000"
                        value={depreciationInputs.assetCost}
                        onChange={(e) => setDepreciationInputs({...depreciationInputs, assetCost: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salvageValue">
                        Nilai Sisa (Rp)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Perkiraan nilai aset setelah masa pakainya berakhir.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="salvageValue"
                        type="number"
                        placeholder="10,000,000"
                        value={depreciationInputs.salvageValue}
                        onChange={(e) => setDepreciationInputs({...depreciationInputs, salvageValue: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="usefulLifeYears">
                        Masa Pakai (Tahun)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Berapa lama aset diperkirakan akan digunakan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="usefulLifeYears"
                        type="number"
                        placeholder="5"
                        value={depreciationInputs.usefulLifeYears}
                        onChange={(e) => setDepreciationInputs({...depreciationInputs, usefulLifeYears: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="method">
                        Metode Depresiasi
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 inline-block ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Metode perhitungan depresiasi yang digunakan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Select
                        value={depreciationInputs.method}
                        onValueChange={(value) => setDepreciationInputs({...depreciationInputs, method: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih metode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="straight-line">Straight-Line (Garis Lurus)</SelectItem>
                          <SelectItem value="double-declining">Double-Declining Balance</SelectItem>
                          <SelectItem value="sum-of-years">Sum-of-Years-Digits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Calculator Buttons (common for all calculator types) */}
              <div className="flex flex-wrap justify-end gap-4 mt-6">
                <Button variant="outline" onClick={resetForm}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCalculate}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Hitung
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results Card for ROI Calculator */}
          {calculatorType === "roi" && roiResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">ROI Tahunan</h3>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatPercent(roiResult.value)}</p>
                  </div>
                  
                  {roiResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {roiResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {roiResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{roiResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Break-Even Calculator */}
          {calculatorType === "breakeven" && breakEvenResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Break-Even Point</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">Break-Even Point</h3>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{Math.ceil(breakEvenResult.value)} unit</p>
                    {breakEvenInputs.sellingPricePerUnit && (
                      <p className="text-blue-600 dark:text-blue-500 mt-2">
                        Nilai dalam Rupiah: {formatCurrency(Math.ceil(breakEvenResult.value) * Number(breakEvenInputs.sellingPricePerUnit))}
                      </p>
                    )}
                  </div>
                  
                  {breakEvenResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {breakEvenResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {breakEvenResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{breakEvenResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Profit Margin Calculator */}
          {calculatorType === "profit-margin" && marginResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">Profit Margin</h3>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatPercent(marginResult.value)}</p>
                    {marginInputs.revenue && marginInputs.cost && (
                      <p className="text-green-600 dark:text-green-500 mt-2">
                        Profit: {formatCurrency(Number(marginInputs.revenue) - Number(marginInputs.cost))}
                      </p>
                    )}
                  </div>
                  
                  {marginResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {marginResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {marginResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{marginResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Markup Calculator */}
          {calculatorType === "markup" && markupResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Markup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">Harga Jual</h3>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(markupResult.value)}</p>
                    {markupInputs.cost && markupInputs.markupPercent && (
                      <p className="text-blue-600 dark:text-blue-500 mt-2">
                        Markup: {formatCurrency((Number(markupInputs.cost) * Number(markupInputs.markupPercent)) / 100)}
                      </p>
                    )}
                  </div>
                  
                  {markupResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {markupResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {markupResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{markupResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Discount Calculator */}
          {calculatorType === "discount" && discountResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Diskon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">Harga Setelah Diskon</h3>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(discountResult.value)}</p>
                    {discountInputs.originalPrice && discountInputs.discountPercent && (
                      <p className="text-green-600 dark:text-green-500 mt-2">
                        Jumlah Diskon: {formatCurrency((Number(discountInputs.originalPrice) * Number(discountInputs.discountPercent)) / 100)}
                      </p>
                    )}
                  </div>
                  
                  {discountResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {discountResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {discountResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{discountResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Loan Calculator */}
          {calculatorType === "loan" && loanResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Pinjaman</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">
                      Pembayaran {loanInputs.paymentFrequency === 'monthly' ? 'Bulanan' : loanInputs.paymentFrequency === 'quarterly' ? 'Kuartalan' : 'Tahunan'}
                    </h3>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(loanResult.value)}</p>
                    {loanInputs.loanAmount && loanInputs.interestRate && loanInputs.loanTermYears && (
                      <p className="text-blue-600 dark:text-blue-500 mt-2">
                        Total Pembayaran: {formatCurrency(loanResult.value * (Number(loanInputs.loanTermYears) * (loanInputs.paymentFrequency === 'monthly' ? 12 : loanInputs.paymentFrequency === 'quarterly' ? 4 : 1)))}
                      </p>
                    )}
                  </div>
                  
                  {loanResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {loanResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {loanResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{loanResult.description}</p>
                    </div>
                  )}
                  
                  {loanSchedule.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Jadwal Pembayaran (Amortization Schedule)</h3>
                      <div className="overflow-x-auto">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="schedule">
                            <AccordionTrigger>
                              Lihat Jadwal Pembayaran ({loanSchedule.length} periode)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Periode</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pembayaran</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pokok</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bunga</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sisa Pinjaman</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {loanSchedule.map((period, index) => (
                                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{period.period}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.payment)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.principalPayment)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.interestPayment)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.remainingBalance)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Compound Interest Calculator */}
          {calculatorType === "compound-interest" && compoundResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Bunga Majemuk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">Nilai Akhir Investasi</h3>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(compoundResult.value)}</p>
                    {compoundInputs.principal && (
                      <p className="text-green-600 dark:text-green-500 mt-2">
                        Keuntungan Total: {formatCurrency(compoundResult.value - Number(compoundInputs.principal))}
                      </p>
                    )}
                  </div>
                  
                  {compoundResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {compoundResult.formula}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        P = Principal, r = Rate per period, n = Total periods, PMT = Periodic payment
                      </p>
                    </div>
                  )}
                  
                  {compoundResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{compoundResult.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Results Card for Depreciation Calculator */}
          {calculatorType === "depreciation" && depreciationResult.value !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Hasil Perhitungan Depresiasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-1">
                      Depresiasi Tahun Pertama
                    </h3>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(depreciationResult.value)}</p>
                    {depreciationInputs.assetCost && depreciationInputs.salvageValue && (
                      <p className="text-blue-600 dark:text-blue-500 mt-2">
                        Total Depresiasi: {formatCurrency(Number(depreciationInputs.assetCost) - Number(depreciationInputs.salvageValue))}
                      </p>
                    )}
                  </div>
                  
                  {depreciationResult.formula && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Formula Perhitungan:</h3>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 font-mono text-sm overflow-x-auto">
                        {depreciationResult.formula}
                      </div>
                    </div>
                  )}
                  
                  {depreciationResult.description && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mt-4">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Analisis</h3>
                      <p className="text-blue-700 dark:text-blue-400">{depreciationResult.description}</p>
                    </div>
                  )}
                  
                  {depreciationSchedule.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Jadwal Depresiasi</h3>
                      <div className="overflow-x-auto">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="schedule">
                            <AccordionTrigger>
                              Lihat Jadwal Depresiasi ({depreciationSchedule.length} tahun)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tahun</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Depresiasi</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Depresiasi Kumulatif</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nilai Buku</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {depreciationSchedule.map((period, index) => (
                                      <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{period.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.depreciation)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.totalDepreciation)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(period.remainingValue)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}