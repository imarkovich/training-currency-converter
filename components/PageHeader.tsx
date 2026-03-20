interface PageHeaderProps {
  title: string;
  subtitle: string;
  onRefreshRates: () => void;
  refreshing: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  onRefreshRates,
  refreshing,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <button
          onClick={onRefreshRates}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Rates'}
        </button>
      </div>
    </div>
  );
}
