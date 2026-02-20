import { useCallback, useEffect, useState } from "react";

type FilterValue = string | number | boolean;

type FilterConfig = {
  key: string;
  defaultValue: FilterValue;
};

interface ApiResponse<T> {
  data: {
    data: T[];
    totalPages: number;
    currentPage?: number;
    total?: number;
  };
}

type UseAdminTableConfig<T> = {
  fetchApi: (
    page: number,
    limit: number,
    search: string,
    filters: Record<string, FilterValue>
  ) => Promise<{ data: ApiResponse<T>['data'] } | { data: { data: T[]; totalPages: number } }>; // Adjusting to match likely axios response structure or generic structure
  filters: FilterConfig[];
};

export function useAdminTable<T>({ fetchApi, filters }: UseAdminTableConfig<T>) {
  const [data, setData] = useState<T[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const [filterValues, setFilterValues] = useState<Record<string, FilterValue>>(() => {
    const obj: Record<string, FilterValue> = {};
    (filters || []).forEach((f) => (obj[f.key] = f.defaultValue));
    return obj;
  });


  const updateFilter = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const getData = useCallback(async () => {
    try {
      const res = await fetchApi(currentPage, limit, searchQuery, filterValues);

      if (res?.data) {
        setData(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch table data", error);
    }
  }, [currentPage, limit, searchQuery, filterValues, fetchApi]);


  useEffect(() => {
    getData();
  }, [getData, currentPage, searchQuery, filterValues]);

  return {
    data,
    totalPages,
    currentPage,
    setCurrentPage,
    searchInput,
    setSearchInput,
    searchQuery,
    filters: filterValues,
    updateFilter,
    refetch: getData
  };
}
