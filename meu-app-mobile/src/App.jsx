import { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Typography, 
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Brightness4, Brightness7, Sort, Add } from '@mui/icons-material';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import db from './db';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  // Estados
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  // Tema
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
    },
  });

  // Carrega usuários
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const savedUsers = await db.users.toArray();
        setUsers(savedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Função para adicionar usuário
  const addUser = async (user) => {
    setIsLoading(true);
    try {
      // Verificação otimizada
      const exists = await db.users
        .where('email')
        .equalsIgnoreCase(user.email)
        .count();
      
      if (exists > 0) {
        throw new Error('Este e-mail já está cadastrado');
      }

      // Transação segura
      const id = await db.transaction('rw', db.users, async () => {
        return await db.users.add({
          name: user.name.trim(),
          email: user.email.toLowerCase().trim()
        });
      });

      setUsers(prev => [...prev, { id, ...user }]);
      toast.success('Usuário cadastrado com sucesso!');
      return true;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error(error.message.includes('já está') 
        ? error.message 
        : 'Erro ao cadastrar usuário');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar usuário
  const updateUser = async (user) => {
    setIsLoading(true);
    try {
      // Verifica se o email foi alterado
      if (user.email !== currentUser.email) {
        const exists = await db.users
          .where('email')
          .equalsIgnoreCase(user.email)
          .count();
        
        if (exists > 0) {
          throw new Error('Este e-mail já pertence a outro usuário');
        }
      }

      await db.users.update(user.id, {
        name: user.name.trim(),
        email: user.email.toLowerCase().trim()
      });

      setUsers(users.map(u => u.id === user.id ? user : u));
      toast.success('Usuário atualizado!');
      return true;
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar usuário
  const deleteUser = async (id) => {
    setIsLoading(true);
    try {
      await db.users.delete(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuário removido!');
    } catch (error) {
      console.error("Erro ao remover:", error);
      toast.error('Erro ao remover usuário');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtro e ordenação
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Cabeçalho */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" component="h1">
            Cadastro de Usuários
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={`Alternar para tema ${darkMode ? 'claro' : 'escuro'}`}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title={`Ordenar ${sortConfig.direction === 'asc' ? 'Z-A' : 'A-Z'}`}>
              <IconButton 
                onClick={() => setSortConfig({ 
                  key: 'name', 
                  direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' 
                })} 
                color="inherit"
              >
                <Sort />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Barra de busca e botão */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            label="Buscar usuários"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => {
              setCurrentUser(null);
              setOpenForm(true);
            }}
            disabled={isLoading}
            sx={{ minWidth: 150 }}
          >
            Novo Usuário
          </Button>
        </Box>

        {/* Formulário */}
        {(openForm || currentUser) && (
          <UserForm
            onSubmit={currentUser ? updateUser : addUser}
            initialData={currentUser || {}}
            onCancel={() => {
              setCurrentUser(null);
              setOpenForm(false);
            }}
            buttonText={currentUser ? "Atualizar" : "Cadastrar"}
            isLoading={isLoading}
          />
        )}

        {/* Lista de usuários */}
        <UserList 
          users={sortedUsers} 
          onEdit={(user) => {
            setCurrentUser(user);
            setOpenForm(true);
          }} 
          onDelete={setUserToDelete}
          isLoading={isLoading}
        />

        {/* Diálogo de confirmação */}
        <Dialog open={!!userToDelete} onClose={() => setUserToDelete(null)}>
          <DialogTitle>Confirmar exclusão?</DialogTitle>
          <DialogActions>
            <Button 
              onClick={() => setUserToDelete(null)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                deleteUser(userToDelete);
                setUserToDelete(null);
              }} 
              color="error"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </ThemeProvider>
  );
}