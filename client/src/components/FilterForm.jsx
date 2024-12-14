import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function FilterForm({ onSubmit }) {
  const [filters, setFilters] = useState({
    industry: '',
    location: ''
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Industry"
        value={filters.industry}
        onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
      />
      <Input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
      />
      <Button type="submit">Filter</Button>
    </form>
  );
}