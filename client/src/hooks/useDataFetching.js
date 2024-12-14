/**
 * Custom hook to manage data fetching, loading states, and pagination
 * Reusable across components that need similar data fetching logic
 */

import { useState, useEffect } from 'react';
import { fetchDataFromEndpoint } from '../services/api';

export const useDataFetching = (initialSource = 'companies') => {
  // State management
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(initialSource);

  // Fetch data based on current state
  const fetchData = async () => {
    const params = new URLSearchParams({
      ...filters,
      page: page.toString(),
      limit: '5'
    });

    try {
      setIsLoading(true);
      setError(null);

      // Map data source to endpoint
      const endpoint = {
        companies: 'companies',
        users: 'users',
        clerk: 'users/clerk'
      }[dataSource];

      const responseData = await fetchDataFromEndpoint(endpoint, params);
      setData(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [filters, page, dataSource]);

  // Reset state when data source changes
  useEffect(() => {
    setFilters({});
    setPage(1);
  }, [dataSource]);

  return {
    filters,
    setFilters,
    page,
    setPage,
    data,
    isLoading,
    error,
    dataSource,
    setDataSource
  };
};