import React, { createContext, useContext, useMemo, useState } from 'react';
import type { GetCategoryRateAPIRequestDto } from 'quizzer-lib';

export type GraphType = 'Bar' | 'Radar';
export type OrderType = 'Rate' | 'Name';

type AccuracyGraphFormState = {
  graph: GraphType;
  order: OrderType;
  getCategoryRateData: GetCategoryRateAPIRequestDto;
  setGraph: React.Dispatch<React.SetStateAction<GraphType>>;
  setOrder: React.Dispatch<React.SetStateAction<OrderType>>;
  setCategoryRateData: React.Dispatch<React.SetStateAction<GetCategoryRateAPIRequestDto>>;
};

const AccuracyGraphFormContext = createContext<AccuracyGraphFormState | null>(null);

export const AccuracyGraphFormProvider = ({
  children,
  defaultValue
}: {
  children: React.ReactNode;
  defaultValue: {
    graph?: GraphType;
    order?: OrderType;
    getCategoryRateData: GetCategoryRateAPIRequestDto;
  };
}) => {
  // TODO graph,orderは別々ではなくて一つの型にまとめたい
  const [graph, setGraph] = useState<GraphType>(defaultValue.graph ?? 'Bar');
  const [order, setOrder] = useState<OrderType>(defaultValue.order ?? 'Rate');
  const [getCategoryRateData, setCategoryRateData] = useState<GetCategoryRateAPIRequestDto>(
    defaultValue.getCategoryRateData
  );

  const value = useMemo(
    () => ({ graph, order, getCategoryRateData, setGraph, setOrder, setCategoryRateData }),
    [graph, order, getCategoryRateData]
  );

  return <AccuracyGraphFormContext.Provider value={value}>{children}</AccuracyGraphFormContext.Provider>;
};

export const useAccuracyGraphForm = () => {
  const ctx = useContext(AccuracyGraphFormContext);
  if (!ctx) throw new Error('useAccuracyGraphForm must be used within AccuracyGraphFormProvider');
  return ctx;
};
