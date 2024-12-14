export function ToggleSwitch({ dataSource, setDataSource }) {
  return (
    <div className="flex items-center mb-4">
      <button
        onClick={() => setDataSource('companies')}
        className={`px-4 py-2 rounded-l ${
          dataSource === 'companies' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        Companies
      </button>
      <button
        onClick={() => setDataSource('users')}
        className={`px-4 py-2 ${
          dataSource === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        Users
      </button>
      <button
        onClick={() => setDataSource('clerk')}
        className={`px-4 py-2 rounded-r ${
          dataSource === 'clerk' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        Clerk Users
      </button>
    </div>
  );
}