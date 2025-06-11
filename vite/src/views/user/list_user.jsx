import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete, Search, Cancel as CancelIcon, Add as AddIcon } from '@mui/icons-material'; // Import Add icon
import UserForm from './User_f'; // Assuming UserForm.jsx is in the same directory

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch users from API or local storage
    // Replace this with your actual data fetching logic
    const fetchUsers = async () => {
      // Example using a mock API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDelete = (user) => {
    // Implement delete logic (e.g., API call)
    console.log('Delete user:', user.id);
    // After successful deletion, update the users state
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const handleOpenModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Function to update user list after editing/adding a user
  const updateUserList = (updatedUser) => {
    if (isEditing) {
      // Update existing user
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } else {
      // Add new user
      setUsers([...users, updatedUser]);
    }
  };

  return (
    <Container>
      <h2>lista de usuarios </h2>
      <TextField
        label="Search by Email"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
          <Button
      variant="contained"
      color="primary"
      onClick={handleOpenModal}
      startIcon={<AddIcon />}
      sx={{ ml: 2 }} 
    >
    </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <UserForm
            initialValues={selectedUser}
            onSubmit={updateUserList}
            onCancel={handleCloseModal}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListUsers;