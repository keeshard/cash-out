// app/_not-found/page.tsx
"use client";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-500">
        Sorry, the page you were looking for does not exist.
      </p>
    </div>
  );
}
