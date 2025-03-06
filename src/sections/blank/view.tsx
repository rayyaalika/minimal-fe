import axios, { endpoints } from 'src/utils/axios';
import { BASE_URL_SERVER } from 'src/auth/context/jwt/constant';
import { useState, useEffect, useCallback } from "react";
import Box from '@mui/material/Box';
import { varAlpha } from 'src/theme/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DashboardContent } from 'src/layouts/dashboard';
import { signOut } from 'src/auth/context/jwt';

type Props = {
  title?: string;
};

export function BlankView({ title = 'Blank' }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        }}
      />
    </DashboardContent>
  );
}

interface Product {
  id: number;
  kode: string;
  name: string;
  kategori: string;
  harga: number;
}

export function ProductView({ title = 'Blank' }: Props) {

  const [dataTable, setDataTable] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newData, setNewData] = useState({ nama: "", kategori: "", harga: 0 });
  const [updateData, setupdateData] = useState({ id: 0, nama: "", kategori: "", harga: 0 });

  const refreshToken = async () => {
    try {
      const response = await axios.get(BASE_URL_SERVER + endpoints.auth.refreshtoken);
      setToken(response.data.token);
    } catch (err) {
      setError(err.message || "Gagal memperbarui token");
      if (err.response?.status === 401) {
        await signOut();
      }
    }
  };

  const fetchData = useCallback(async () => {
    if (!token) return; 
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BASE_URL_SERVER + endpoints.products, {
        headers: {
          "token": `${token}`,
          "Content-Type": "application/json",
        },
      });

      setDataTable(response.data.data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");

      if (err.response?.status === 401) {
        await refreshToken();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleOpenAdd = () => {
    setNewData({ nama: "", kategori: "", harga: 0 });
    setOpenAdd(true);
  };

  const handleOpenUpdate = (id = 0, nama = "", kategori = "", harga = 0) => {
    setupdateData({ id, nama, kategori, harga });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (id = 0, nama = "", kategori = "", harga = 0) => {
    setupdateData({ id, nama, kategori, harga });
    setOpenDelete(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseUpdate = () => {
    setupdateData({ id: 0, nama: "", kategori: "", harga: 0 });
    setOpenUpdate(false);
  };

  const handleCloseDelete = () => {
    setupdateData({ id: 0, nama: "", kategori: "", harga: 0 });
    setOpenDelete(false);
  };

  const handleAddData = async () => {
    await refreshToken();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(BASE_URL_SERVER + endpoints.products,
        {
          "nama": `${newData.nama}`,
          "kategori": `${newData.kategori}`,
          "harga": newData.harga
        }, {
        headers: {
          "token": `${token}`,
          "Content-Type": "application/json",
        },
      });

      setOpenAdd(false);
      fetchData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    } 
  };

  const handleUpdateData = async () => {
    await refreshToken();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${BASE_URL_SERVER}${endpoints.products}/${updateData.id}`,
        {
          "nama": `${updateData.nama}`,
          "kategori": `${updateData.kategori}`,
          "harga": updateData.harga
        }, {
        headers: {
          "token": `${token}`,
          "Content-Type": "application/json",
        },
      });

      setupdateData({ id: 0, nama: "", kategori: "", harga: 0 });
      setOpenUpdate(false);
      fetchData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    } 
  };

  const handleDeleteData = async () => {
    await refreshToken();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`${BASE_URL_SERVER}${endpoints.products}/${updateData.id}`, {
        headers: {
          "token": `${token}`,
          "Content-Type": "application/json",
        },
      });

      setupdateData({ id: 0, nama: "", kategori: "", harga: 0 });
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    } 
  };

  
  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleOpenAdd}
          sx={{ my: 3 }}
        >
          Add Data
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : dataTable.length === 0 ? (
          <Typography textAlign="center" margin="20px">
            Data tidak tersedia
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kode Produk</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTable.map((row: Product) => (
                <TableRow key={row.id}>
                  <TableCell>{row.kode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.kategori}</TableCell>
                  <TableCell>Rp{row.harga.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenUpdate(row.id, row.name, row.kategori, row.harga)}>
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDelete(row.id, row.name, row.kategori, row.harga)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Tambah Data Produk</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Produk"
            fullWidth
            margin="dense"
            value={newData.nama}
            onChange={(e) => setNewData({ ...newData, nama: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Kategori</InputLabel>
            <Select
              value={newData.kategori}
              onChange={(e) => setNewData({ ...newData, kategori: e.target.value })}
            >
              <MenuItem value="">-- Pilih Kategori --</MenuItem>
              <MenuItem value="Makanan">Makanan</MenuItem>
              <MenuItem value="Minuman">Minuman</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Harga"
            fullWidth
            margin="dense"
            type="number"
            value={newData.harga}
            onChange={(e) => setNewData({ ...newData, harga: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="error">Cancel</Button>
          <Button onClick={handleAddData} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Ubah Data Produk</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Produk"
            fullWidth
            margin="dense"
            value={updateData.nama}
            onChange={(e) => setupdateData({ ...updateData, nama: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Kategori</InputLabel>
            <Select
              value={updateData.kategori}
              onChange={(e) => setupdateData({ ...updateData, kategori: e.target.value })}
            >
              <MenuItem value="Makanan">Makanan</MenuItem>
              <MenuItem value="Minuman">Minuman</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Harga"
            fullWidth
            margin="dense"
            type="number"
            value={updateData.harga}
            onChange={(e) => setupdateData({ ...updateData, harga: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} color="error">Cancel</Button>
          <Button onClick={handleUpdateData} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Apakah Anda Yakin?</DialogTitle>
        <DialogContent>
          <Typography>
            Data yang Anda hapus tidak dapat dipulihkan kembali, tetap lanjut?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="error">Batal</Button>
          <Button onClick={handleDeleteData} color="primary">Lanjut</Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
