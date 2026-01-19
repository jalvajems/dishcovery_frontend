import { useCallback, useEffect, useState } from "react";

type FilterConfig = {
  key: string;
  defaultValue: any;
};

type UseAdminTableConfig<T> = {
  fetchApi: (
    page: number,
    limit: number,
    search: string,
    filters: Record<string, any>
  ) => Promise<any>;
  filters: FilterConfig[];
};

export function useAdminTable<T>({ fetchApi, filters }: UseAdminTableConfig<T>) {
  const [data, setData] = useState<T[]>([]);
  const [searchInput, setSearchInput] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const [filterValues, setFilterValues] = useState(() => {
  const obj: Record<string, any> = {};
  (filters || []).forEach((f) => (obj[f.key] = f.defaultValue));
  return obj;
});


  const updateFilter = (key: string, value: any) => {
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
  const res = await fetchApi(currentPage, limit, searchQuery, filterValues);
  setData(res.data.data);
  setTotalPages(res.data.totalPages);
}, [currentPage, limit, searchQuery, filterValues]);


  useEffect(() => {
    getData();
  }, [getData,currentPage, searchQuery, filterValues]);

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
    refetch:getData
  };
}
