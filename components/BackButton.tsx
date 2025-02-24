import Link from "next/link";

const BackButton = () => (
  <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
    <div className="p-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-500">
      <div className="bg-white rounded-full p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-violet-500 bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
  </Link>
);

export default BackButton;
