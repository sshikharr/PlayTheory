/**
 * Dashboard component
 * Main container for displaying company and user data
 * Uses custom hooks for data management
 */

import { useClerk } from '@clerk/clerk-react';
import { CompanyTable } from '../components/CompanyTable';
import { FilterForm } from '../components/FilterForm';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { useDataFetching } from '../hooks/useDataFetching';

export default function Dashboard() {
  // Authentication
  const { signOut } = useClerk();

  // Custom hook for data management
  const {
    filters,
    setFilters,
    page,
    setPage,
    data,
    isLoading,
    error,
    dataSource,
    setDataSource
  } = useDataFetching();

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      {/* Data source selection */}
      <ToggleSwitch dataSource={dataSource} setDataSource={setDataSource} />

      {/* Filters - companies only */}
      <div className="mb-4">
        {dataSource === 'companies' && <FilterForm onSubmit={setFilters} />}
      </div>

      {/* Performance metrics */}
      {data?.executionTime && (
        <div className="mb-2">
          Query time: {data.executionTime}ms
        </div>
      )}

      {/* Data display */}
      <CompanyTable 
        data={data?.data || []}
        onPageChange={setPage}
        isCompany={dataSource === 'companies'}
        totalPages={data?.pagination.totalPages || 1}
        currentPage={data?.pagination.page || 1}
      />

      {/* Status indicators */}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}