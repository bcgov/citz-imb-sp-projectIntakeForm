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
      {/* @ts-ignore */}
      <Dialog fullScreen open={dialogStatus} aria-labelledby="form-dialog-title">
        <DialogTitle style={{ color: "white!important" }} id="form-dialog-title">
          Project Intake Form
        </DialogTitle>
        {dialogStatus ? (
          <DialogContent>
            <FormFrame />
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
};

export default FormDialog;
