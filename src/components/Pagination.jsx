const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Generate page numbers to display
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* First Page */}
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 1 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Last Page */}
      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;