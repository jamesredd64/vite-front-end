import { useSidebar } from "../../context/SidebarContext";

const SidebarItem = ({ /* existing props */ }) => {
  const { toggleMobileSidebar } = useSidebar();

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) {  // Mobile breakpoint
      toggleMobileSidebar();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      to={to}
      className={/* existing classes */}
      onClick={handleClick}
    >
      {/* existing content */}
    </Link>
  );
};