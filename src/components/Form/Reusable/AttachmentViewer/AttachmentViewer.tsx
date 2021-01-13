import React, { useContext, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { DeleteAttachments, FormTypeContext } from "Components";
import { FilterSharp } from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
interface AttachmentViewerProps {
  attachments: any;
  currentItemId: any;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments, currentItemId }) => {
  const [files, setFiles] = useState<any>([...attachments]);

  let formType = useContext(FormTypeContext);

  const preventDefault = (event: any) => event.preventDefault();
  const generateDOM = () => {
    if (files.length > 0) {
      return (
        <Paper>
          <Typography variant="h6">Attachments</Typography>
          <List dense={true}>
            {files.map((attachment: any) => {
              return (
                <ListItem>
                  <ListItemText
                    primary={
                      <Link href={attachment?.ServerRelativeUrl} variant="body2">
                        {attachment?.FileName}
                      </Link>
                    }
                  />
                  <ListItemSecondaryAction>
                    {formType === "Edit" ? (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={async () => {
                          if (window.confirm("Are you sure you would like to delete attachment " + attachment.FileName + "?")) {
                            try {
                              await DeleteAttachments(attachment.FileName, currentItemId, "Submitted Projects");
                              setFiles(() => {
                                let tempFiles = [];
                                for (let i = 0; i < files.length; i++) {
                                  if (files[i].FileName !== attachment.FileName) {
                                    tempFiles.push(files[i]);
                                  }
                                }
                                return tempFiles;
                              });
                              alert("Success! attachment was deleted");
                            } catch (error) {}
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      );
    } else {
      return <div>No Attachments</div>;
    }
  };
  return (
    <>
      <Grid item xs={8} md={8}>
        {generateDOM()}
      </Grid>
    </>
  );
};

export default AttachmentViewer;
