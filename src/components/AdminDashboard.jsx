import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Input,
  TextField,
  Stack,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [editedValues, setEditedValues] = useState({});
  const [selectChecked, setSelectChecked] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const apiEndpoint = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const updateSelectedState = (userId, isChecked) => {
    if (isChecked) {
      setSelectedRows(prevSelected => [...prevSelected, userId]);
    } else {
      setSelectedRows(prevSelected => prevSelected.filter(id => id !== userId));
    }
  };

  const selectAllRows = (isChecked) => {
    setSelectChecked(!selectChecked);
    if (isChecked) {
      setSelectedRows(displayedUsers.map(user => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const deleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
    setSelectChecked(false);
  };

  const handlePageChange = (page) => {
    if (page <= totalPages && page >= 1) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  const handleSearch = () => {
    let searchData = searchInput.trim();
    if (searchData.length === 0) {
      setUsers(data);
      setCurrentPage(1);
      setSelectedRows([]);
      return;
    }
    const filteredUsers = data.filter((user) => {
      if (
        user.name.toLowerCase().includes(searchData.toLowerCase()) ||
        user.email.toLowerCase().includes(searchData.toLowerCase()) ||
        user.role.toLowerCase().includes(searchData.toLowerCase()) ||
        user.id === searchData
      ) {
        return user;
      }
      else
        return null;

    });
    setUsers(filteredUsers);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleEdit = (userId) => {
    setEditedValues({ ...editedValues, [userId]: true });
  };
  const handleEditChange = (userId, field, value) => {
    setUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };
  const handleSave = (userId) => {
    setEditedValues({ ...editedValues, [userId]: false });
  };

  return (
    <div className='admin-dashboard'>
      <div className='search-box'>
        <Stack direction="row" justifyContent="flex-end" spacing={2} >
          <TextField
            size="small"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            label="Search"
          />
          <Button variant="contained" onClick={handleSearch}>
            Search &nbsp;<SearchIcon />
          </Button>
        </Stack>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectChecked}
                  onChange={(e) => selectAllRows(e.target.checked)}
                />
              </TableCell>

              <TableCell>
                <Typography variant="button">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="button">Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="button">Role</Typography>
              </TableCell>
              <TableCell align='right' style={{ paddingRight: "8em" }}>
                <Typography variant="button">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map(user => (
              <TableRow key={user.id} className={selectedRows.includes(user.id) ? 'selected' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(user.id) ? true : false}
                    onChange={(e) => updateSelectedState(user.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  {editedValues[user.id] ? (
                    <Input
                      type="text"
                      value={user.name}
                      onChange={(e) => handleEditChange(user.id, 'name', e.target.value)}
                      variant="outlined"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
                  {editedValues[user.id] ? (
                    <Input
                      type="text"
                      value={user.email}
                      onChange={(e) => handleEditChange(user.id, 'email', e.target.value)}
                      variant="outlined"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editedValues[user.id] ? (
                    <Input
                      type="text"
                      value={user.role}
                      onChange={(e) => handleEditChange(user.id, 'role', e.target.value)}
                      variant="outlined"
                    />
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell align='right'>
                  <Stack justifyContent="flex-end" direction="row" spacing={2}>
                    {editedValues[user.id] ? (
                      <Button
                        className='save'
                        variant="contained"
                        style={{ backgroundColor: '#eceff1' }}
                        onClick={() => handleSave(user.id)
                        }
                      >
                        <SaveIcon
                          color="primary"
                        />
                      </Button>
                    ) : (
                      <Button
                        className='edit'
                        variant="contained"
                        style={{ backgroundColor: '#eceff1' }}
                        onClick={() => handleEdit(user.id)
                        }
                      >
                        <EditIcon
                          style={{ color: '#000' }}
                        />
                      </Button>
                    )}
                    <Button
                      className='delete'
                      variant="contained"
                      style={{ backgroundColor: '#eceff1' }}
                      onClick={() => setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id))
                      }
                    >
                      <DeleteOutlineIcon
                        color="error"
                      />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='pagination'>
        <Stack direction="column">
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              style={{ backgroundColor: '#eceff1', color: '#000' }}
              variant="contained"
              onClick={() => handlePageChange(1)}
            >
              First Page
            </Button>
            <Button
              style={{ backgroundColor: '#eceff1', color: '#000' }}
              variant="contained"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous Page
            </Button>
            <Typography
              variant="button"
            >
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              style={{ backgroundColor: '#eceff1', color: '#000' }}
              variant="contained"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next Page
            </Button>
            <Button
              style={{ backgroundColor: '#eceff1', color: '#000' }}
              variant="contained"
              onClick={() => handlePageChange(totalPages)}
            >
              Last Page
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="flex-first">
            <Button
              style={{ backgroundColor: '#eceff1', color: '#c62828' }}
              variant="contained"
              onClick={deleteSelected}
            >
              Delete Selected
              <DeleteOutlineIcon />
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default AdminDashboard;
