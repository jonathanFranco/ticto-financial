import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { Summary } from "@/models/api.model";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import React, { cloneElement, isValidElement } from "react";

interface SummaryCardsProps {
  summary: Summary;
}

type CardSectionProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  valueColor?: string;
  bgColor?: string;
  titleColor?: string;
  iconColor?: string;
};

function CardSection({
  title,
  value,
  icon,
  valueColor,
  bgColor,
  titleColor,
  iconColor,
}: CardSectionProps) {
  return (
    <Card className={bgColor ? bgColor : "bg-white"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-sm font-medium ${
            titleColor ? titleColor : "text-muted-foreground"
          }`}
        >
          {title}
        </CardTitle>
        {isValidElement(icon)
          ? cloneElement(icon as React.ReactElement<any, any>, {
              className: `${(icon as any).props.className || ""} ${
                iconColor || ""
              }`.trim(),
            })
          : icon}
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold${
            valueColor ? ` ${valueColor}` : " text-zinc-700"
          }`}
        >
          {formatCurrency(value)}
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { income, expenses, balance } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardSection
        title="Entradas"
        value={income}
        icon={<ArrowDownCircle className="h-5 w-5" />}
        iconColor="text-emerald-400"
        titleColor="text-zinc-500"
        valueColor="text-zinc-700"
        bgColor="bg-white"
      />
      <CardSection
        title="Saídas"
        value={expenses}
        icon={<ArrowUpCircle className="h-5 w-5" />}
        iconColor="text-pink-400"
        titleColor="text-zinc-500"
        valueColor="text-zinc-700"
        bgColor="bg-white"
      />
      <CardSection
        title="Saldo Total"
        value={balance}
        icon={<DollarSign className="h-5 w-5" />}
        iconColor="text-white"
        titleColor="text-white"
        valueColor="text-white"
        bgColor={balance < 0 ? "bg-red-500" : "bg-emerald-400"}
      />
    </div>
  );
}
