export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">IT Department API</h1>
      <p className="text-gray-600">Backend server is running on port 3001</p>
      <div className="mt-8 space-y-2 text-sm">
        <p><strong>API Endpoints:</strong></p>
        <ul className="list-disc list-inside">
          <li>GET /api/users - Get all users</li>
          <li>POST /api/users - Create new user</li>
          <li>GET /api/users/:id - Get user by ID</li>
          <li>PUT /api/users/:id - Update user</li>
          <li>DELETE /api/users/:id - Delete user</li>
          <li>GET /api/statistics - Get statistics</li>
        </ul>
      </div>
    </main>
  );
}
