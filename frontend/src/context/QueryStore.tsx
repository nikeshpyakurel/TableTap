import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UrlParams = {
  restaurantId: string;
  tableId: string;
};

type UrlParamsStore = {
  params: UrlParams;
  setParams: (params: Partial<UrlParams>) => void;
  clearParams: () => void;
  addParamsToUrl: (path: string) => string;
};

export const useQueryStore = create<UrlParamsStore>()(
  persist(
    (set, get) => ({
      params: {
        restaurantId: '',
        tableId: '',
      },
      
      setParams: (newParams) =>
        set((state) => ({
          params: { ...state.params, ...newParams },
        })),
      
      clearParams: () =>
        set(() => ({
          params: { restaurantId: '', tableId: '' },
        })),
      
      addParamsToUrl: (path) => {
        const { params } = get();
        const searchParams = new URLSearchParams();
        
        if (params.restaurantId) {
          searchParams.set('restaurant', params.restaurantId);
        }
        if (params.tableId) {
          searchParams.set('table', params.tableId);
        }
        
        const queryString = searchParams.toString();
        return `${path}${queryString ? `?${queryString}` : ''}`;
      },
    }),
    {
      name: 'url-params-storage',
    }
  )
);

// Hook to initialize params from URL
export const useInitUrlParams = () => {
  const setParams = useQueryStore((state) => state.setParams);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const restaurant = searchParams.get('restaurant');
    const table = searchParams.get('table');

    if (restaurant || table) {
      setParams({
        restaurantId: restaurant || '',
        tableId: table || '',
      });
    }
  }, [setParams]);
};