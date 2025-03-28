import { useTheme } from "../../context/ThemeContext";

export default function ThemeTogglerTwo() {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <svg
        className="hidden dark:block"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2.5C10.3315 2.5 10.6495 2.6317 10.8839 2.86612C11.1183 3.10054 11.25 3.41848 11.25 3.75V4.375C11.25 4.70652 11.1183 5.02446 10.8839 5.25888C10.6495 5.4933 10.3315 5.625 10 5.625C9.66848 5.625 9.35054 5.4933 9.11612 5.25888C8.8817 5.02446 8.75 4.70652 8.75 4.375V3.75C8.75 3.41848 8.8817 3.10054 9.11612 2.86612C9.35054 2.6317 9.66848 2.5 10 2.5Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 14.375C10.3315 14.375 10.6495 14.5067 10.8839 14.7411C11.1183 14.9755 11.25 15.2935 11.25 15.625V16.25C11.25 16.5815 11.1183 16.8995 10.8839 17.1339C10.6495 17.3683 10.3315 17.5 10 17.5C9.66848 17.5 9.35054 17.3683 9.11612 17.1339C8.8817 16.8995 8.75 16.5815 8.75 16.25V15.625C8.75 15.2935 8.8817 14.9755 9.11612 14.7411C9.35054 14.5067 9.66848 14.375 10 14.375Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.5 10C2.5 9.66848 2.6317 9.35054 2.86612 9.11612C3.10054 8.8817 3.41848 8.75 3.75 8.75H4.375C4.70652 8.75 5.02446 8.8817 5.25888 9.11612C5.4933 9.35054 5.625 9.66848 5.625 10C5.625 10.3315 5.4933 10.6495 5.25888 10.8839C5.02446 11.1183 4.70652 11.25 4.375 11.25H3.75C3.41848 11.25 3.10054 11.1183 2.86612 10.8839C2.6317 10.6495 2.5 10.3315 2.5 10Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.375 10C14.375 9.66848 14.5067 9.35054 14.7411 9.11612C14.9755 8.8817 15.2935 8.75 15.625 8.75H16.25C16.5815 8.75 16.8995 8.8817 17.1339 9.11612C17.3683 9.35054 17.5 9.66848 17.5 10C17.5 10.3315 17.3683 10.6495 17.1339 10.8839C16.8995 11.1183 16.5815 11.25 16.25 11.25H15.625C15.2935 11.25 14.9755 11.1183 14.7411 10.8839C14.5067 10.6495 14.375 10.3315 14.375 10Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.63573 4.63573C4.8701 4.40136 5.18799 4.26967 5.51947 4.26967C5.85095 4.26967 6.16884 4.40136 6.40321 4.63573L6.83759 5.07011C7.07196 5.30448 7.20365 5.62237 7.20365 5.95385C7.20365 6.28533 7.07196 6.60322 6.83759 6.83759C6.60322 7.07196 6.28533 7.20365 5.95385 7.20365C5.62237 7.20365 5.30448 7.07196 5.07011 6.83759L4.63573 6.40321C4.40136 6.16884 4.26967 5.85095 4.26967 5.51947C4.26967 5.18799 4.40136 4.8701 4.63573 4.63573Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1624 13.1624C13.3967 12.928 13.7146 12.7963 14.0461 12.7963C14.3776 12.7963 14.6955 12.928 14.9299 13.1624L15.3642 13.5967C15.5986 13.8311 15.7303 14.149 15.7303 14.4805C15.7303 14.812 15.5986 15.1299 15.3642 15.3642C15.1299 15.5986 14.812 15.7303 14.4805 15.7303C14.149 15.7303 13.8311 15.5986 13.5967 15.3642L13.1624 14.9299C12.928 14.6955 12.7963 14.3776 12.7963 14.0461C12.7963 13.7146 12.928 13.3967 13.1624 13.1624Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="dark:hidden"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2.5C10.3315 2.5 10.6495 2.6317 10.8839 2.86612C11.1183 3.10054 11.25 3.41848 11.25 3.75V4.375C11.25 4.70652 11.1183 5.02446 10.8839 5.25888C10.6495 5.4933 10.3315 5.625 10 5.625C9.66848 5.625 9.35054 5.4933 9.11612 5.25888C8.8817 5.02446 8.75 4.70652 8.75 4.375V3.75C8.75 3.41848 8.8817 3.10054 9.11612 2.86612C9.35054 2.6317 9.66848 2.5 10 2.5ZM3.0625 9.375C3.0625 8.68464 3.43464 8.3125 4.125 8.3125H4.6875C5.37786 8.3125 5.75 8.68464 5.75 9.375C5.75 10.0654 5.37786 10.4375 4.6875 10.4375H4.125C3.43464 10.4375 3.0625 10.0654 3.0625 9.375ZM14.25 9.375C14.25 8.68464 14.6221 8.3125 15.3125 8.3125H15.875C16.5654 8.3125 16.9375 8.68464 16.9375 9.375C16.9375 10.0654 16.5654 10.4375 15.875 10.4375H15.3125C14.6221 10.4375 14.25 10.0654 14.25 9.375ZM10 14.375C10.3315 14.375 10.6495 14.5067 10.8839 14.7411C11.1183 14.9755 11.25 15.2935 11.25 15.625V16.25C11.25 16.5815 11.1183 16.8995 10.8839 17.1339C10.6495 17.3683 10.3315 17.5 10 17.5C9.66848 17.5 9.35054 17.3683 9.11612 17.1339C8.8817 16.8995 8.75 16.5815 8.75 16.25V15.625C8.75 15.2935 8.8817 14.9755 9.11612 14.7411C9.35054 14.5067 9.66848 14.375 10 14.375ZM4.63573 4.63573C4.8701 4.40136 5.18799 4.26967 5.51947 4.26967C5.85095 4.26967 6.16884 4.40136 6.40321 4.63573L6.83759 5.07011C7.07196 5.30448 7.20365 5.62237 7.20365 5.95385C7.20365 6.28533 7.07196 6.60322 6.83759 6.83759C6.60322 7.07196 6.28533 7.20365 5.95385 7.20365C5.62237 7.20365 5.30448 7.07196 5.07011 6.83759L4.63573 6.40321C4.40136 6.16884 4.26967 5.85095 4.26967 5.51947C4.26967 5.18799 4.40136 4.8701 4.63573 4.63573Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1624 13.1624C13.3967 12.928 13.7146 12.7963 14.0461 12.7963C14.3776 12.7963 14.6955 12.928 14.9299 13.1624L15.3642 13.5967C15.5986 13.8311 15.7303 14.149 15.7303 14.4805C15.7303 14.812 15.5986 15.1299 15.3642 15.3642C15.1299 15.5986 14.812 15.7303 14.4805 15.7303C14.149 15.7303 13.8311 15.5986 13.5967 15.3642L13.1624 14.9299C12.928 14.6955 12.7963 14.3776 12.7963 14.0461C12.7963 13.7146 12.928 13.3967 13.1624 13.1624Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
