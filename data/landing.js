import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

export const statsData = [
  { value: "50K+", label: "Active Users" },
  { value: "₹ 2B+", label: "Finances Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User Rating" },
];

export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description: "Get detailed insights into your finances with smart, data-driven analytics",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description: "Extract transaction data automatically from receipts using intelligent scanning technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent spending recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and track all your finances in one place",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Spending Categories",
    description: "Automatically categorize expenses across all areas of your financial life",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description: "Get automated financial insights and personalized recommendations to improve your habits",
  },
];

export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description: "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Finances",
    description: "Automatically categorize and track your income and expenses in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description: "Receive smart insights and recommendations to optimize your spending and savings",
  },
];

export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "/images/avatar2.png",
    quote:
      "This finance app has transformed how I manage my money. The smart insights have helped me cut unnecessary expenses and save more every month.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "/images/avatar1.png",
    quote:
      "The automated tracking and analysis features save me so much time. I can now focus on growing my savings without worrying about the details.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "/images/avatar3.png",
    quote:
      "I recommend this app to all my clients. The smart recommendations and spending breakdowns make it an essential tool for anyone serious about their finances.",
  },
];
