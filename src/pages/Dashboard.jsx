function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Statistics</h3>
            <p className="text-gray-600">Your app statistics will appear here</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
            <p className="text-gray-600">Your recent activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
