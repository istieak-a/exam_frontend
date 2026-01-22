function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About</h1>
        <p className="text-lg text-gray-600 mb-4">
          This application demonstrates modern React Router v6 implementation with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>createBrowserRouter API (latest approach)</li>
          <li>RouterProvider component</li>
          <li>Nested layouts with Outlet</li>
          <li>NavLink with active styling</li>
          <li>Error boundaries</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
