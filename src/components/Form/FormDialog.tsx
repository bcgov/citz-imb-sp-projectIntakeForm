import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import React, { useEffect, FC } from "react";
import { FormFrame } from "Components";

interface FormDialogProps {
  dialogStatus: boolean;
}

export const FormDialog: FC<FormDialogProps> = ({ dialogStatus }) => {
  return (
    <div>
      <Dialog fullScreen open={dialogStatus} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <FormFrame />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;
