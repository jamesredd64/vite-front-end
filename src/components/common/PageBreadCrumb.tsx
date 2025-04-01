interface PageBreadcrumbProps {
  pageTitle: string;
  onNavigate: (path: string) => void;
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ pageTitle, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault(); // Prevent default navigation
    console.log('PageBreadcrumb click handler', { path });
    onNavigate(path);
  };

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <a
              href="/dashboard"
              onClick={(e) => handleClick(e, '/dashboard')}
              className="font-medium"
            >
              Dashboard
            </a>
          </li>
          {/* Add other navigation items as needed */}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
