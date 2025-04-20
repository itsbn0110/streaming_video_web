export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        Không có quyền truy cập
      </h1>
      <p className="text-white mb-4">
        Bạn không có quyền để truy cập trang này.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Quay lại
      </button>
    </div>
  );
};
