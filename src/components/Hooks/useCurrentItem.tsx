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
    } else {
    }
  }, [currentItem]);

  return { currentItem, setCurentItem };
};

export default useCurrentItem;
