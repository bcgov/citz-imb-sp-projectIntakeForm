import { useState } from "react";

export function useDialogToggle() {
  const [dialogStatus, setDialogStatus] = useState<any>();

  const handleDialogClose: Function = (callback: any) => {
    setDialogStatus(false);
    if (callback) {
      callback();
    }
  };

  const handleDialogOpen: Function = () => {
    setDialogStatus(true);
  };

  return [dialogStatus, handleDialogClose, handleDialogOpen];
}

export default useDialogToggle;

//Example use
// import useDialogToggle
// const {dialogStatus, handleDialogClose, handleDialogOpen} = useDialogToggle()

// DialogStatus = either true or false
