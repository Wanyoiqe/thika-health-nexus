
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  change,
  className
}) => {
  return (
    <Card className={cn("healthcare-card overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {change && (
          <div className={cn(
            "text-xs font-medium mt-1",
            change.positive ? "text-green-600" : "text-red-600"
          )}>
            {change.positive ? "↑" : "↓"} {change.value} from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
