function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Exam App
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This is a modern React application with React Router v6 setup using the latest patterns.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-gray-700">
            Navigate through the app using the navigation bar above to explore different pages.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
