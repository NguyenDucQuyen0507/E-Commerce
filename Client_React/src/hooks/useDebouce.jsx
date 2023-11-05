import React, { useEffect, useState } from "react";

const useDebouce = (value, ms) => {
  const [debouce, setDebouce] = useState("");
  useEffect(() => {
    const setTimeOutId = setTimeout(() => {
      setDebouce(value);
    }, ms);
    return () => {
      clearTimeout(setTimeOutId);
    };
  }, [value, ms]);
  return debouce;
};

export default useDebouce;
