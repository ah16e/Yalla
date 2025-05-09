// components/FullScreenLoader.jsx
const FullScreenLoader = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-semibold">Loading, please wait...</p>
      </div>
    );
  };
  
  export default FullScreenLoader;
  