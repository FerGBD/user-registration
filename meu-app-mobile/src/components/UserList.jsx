import { 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    Typography,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    useTheme,
    Box
  } from '@mui/material';
  import { Delete, Edit } from '@mui/icons-material';
  
  export default function UserList({ users, onEdit, onDelete, isLoading }) {
    const theme = useTheme();
  
    if (isLoading && users.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 4 
        }}>
          <CircularProgress />
        </Box>
      );
    }
  
    if (users.length === 0) {
      return (
        <Typography 
          sx={{ 
            py: 2,
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}
        >
          Nenhum usuário encontrado
        </Typography>
      );
    }
  
    return (
      <List sx={{ 
        width: '100%',
        bgcolor: 'background.paper',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s'
      }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Box sx={{ display: 'flex' }}>
                <IconButton 
                  edge="end" 
                  onClick={() => onEdit(user)}
                  disabled={isLoading}
                  sx={{ mr: 1 }}
                >
                  <Edit color="primary" />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => onDelete(user.id)}
                  disabled={isLoading}
                >
                  <Delete color="error" />
                </IconButton>
              </Box>
            }
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography 
                  variant="subtitle1"
                  sx={{ fontWeight: 'medium' }}
                >
                  {user.name}
                </Typography>
              }
              secondary={
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    wordBreak: 'break-word'
                  }}
                >
                  {user.email}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  }