import { WifiLoader } from "react-awesome-loaders";
 const WifiLoaderComponent = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
      <WifiLoader
        background={"transparent"}
        desktopSize={"150px"}
        mobileSize={"150px"}
        text={"Wifi Loader"}
        backColor="#E8F2FC"
        frontColor="#4645F6"
      />
        <span className="text-brand-500 dark:text-brand-400 font-semibold animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default WifiLoaderComponent;

