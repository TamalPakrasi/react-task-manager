import { FileQuestion } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-dvh flex-center flex-col gap-1">
      <FileQuestion size={80} className="text-gray-400 mb-4" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">Page not found</p>
    </div>
  );
}

export default NotFound;
