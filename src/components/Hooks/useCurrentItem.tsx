import { useState, useEffect } from "react";

export const useCurrentItem = () => {
  const [currentItem, setCurentItem] = useState<any>();

  const handleCurrentItem = (item: any) => {
    if (item === undefined) {
      return;
    } else {
      setCurentItem(item);
    }
  };

  useEffect(() => {
    if (currentItem === undefined) {
      console.log("currentItem :>> ", undefined);
    } else {
      console.log("currentItem :>> ", currentItem);
    }
  }, [currentItem]);

  return { currentItem, setCurentItem };
};

export default useCurrentItem;
