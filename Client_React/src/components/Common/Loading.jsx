import { memo } from "react";
import { HashLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <HashLoader color="red" />;
    </div>
  );
};

export default memo(Loading);
