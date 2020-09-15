import { useState } from "react";

export function useDialogToggle() {
  const [dialogStatus, setDialogStatus] = useState<boolean | any>();

  const handleDialogClose = () => {
    setDialogStatus(false);
  };

  const handleDialogOpen = () => {
    setDialogStatus(true);
  };

  return [dialogStatus, handleDialogClose, handleDialogOpen];
}

export default useDialogToggle;

//Example use
// import useDialogToggle
// const [DialogStatus, handleDialogClose, handleDialogOpen] = useDialogToggle()

// DialogStatus = either true or false
