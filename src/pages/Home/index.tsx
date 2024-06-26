import { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useInsertPlates } from "../../hooks/useInsertPlates";
import { usePlates } from "../../hooks/usePlates";
import { Toast } from "../../components/Toast";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const { plates, isLoading, fetchPlates } = usePlates();
  const [isUpdated, setIsUpdated] = useState(false);
  const { insertPlate, isLoadingPlate } = useInsertPlates();
  const [toastOpen, setToastOpen] = useState({
    success: false,
    open: false,
    message: "",
  });

  const isMobile = useMediaQuery("(max-width: 1130px)");

  useEffect(() => {
    if (!isUpdated) {
      fetchPlates();
      setIsUpdated(true);
    }
  }, [isUpdated, fetchPlates]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPlate("");
  };

  const handleAddPlate = async () => {
    setToastOpen({
      message: "",
      success: false,
      open: false,
    });
    const response = await insertPlate(newPlate);
    setToastOpen({
      message: response?.text as string,
      success: response?.success as boolean,
      open: true,
    });
    if (response?.success) {
      setIsUpdated(false);
      handleClose();
      return;
    }
  };

  return (
    <Stack width={"100%"} sx={{ padding: isMobile ? 2 : 3 }}>
      {toastOpen.open && (
        <Toast
          isOpen={toastOpen.open}
          type={toastOpen.success ? "success" : "error"}
          message={toastOpen.message}
        />
      )}
      <Stack gap={2}>
        <Typography
          fontSize={isMobile ? 20 : 24}
          fontWeight={700}
          textAlign="center"
        >
          List of cars
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          fullWidth={isMobile}
          sx={{
            maxWidth: isMobile ? "100%" : "170px",
            alignSelf: "flex-end",
          }}
        >
          Add new plate
        </Button>
      </Stack>
      <Stack mt={2}>
        <TableContainer sx={{ width: "100%" }} component={Paper}>
          {isLoading ? (
            <Stack sx={{ padding: 3, alignItems: "center" }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Table
              sx={{ minWidth: isMobile ? "100%" : 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Car Plate</TableCell>
                  <TableCell align="right">Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plates.map((plate) => {
                  const lastUpdate = new Date(plate.last_update);
                  const formattedDate = lastUpdate.toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });
                  return (
                    <TableRow
                      key={plate.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {plate.plate_number}
                      </TableCell>
                      <TableCell align="right">{formattedDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Stack>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add New Plate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Car Plate"
            fullWidth
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddPlate}
            color="primary"
            disabled={!newPlate.trim() || isLoadingPlate}
          >
            {isLoadingPlate ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
