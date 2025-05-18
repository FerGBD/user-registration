import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Stack, 
  CircularProgress,
  useTheme
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

const validationSchema = yup.object({
  name: yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  email: yup.string()
    .email('Digite um e-mail válido')
    .required('E-mail é obrigatório')
    .max(100, 'Máximo 100 caracteres')
});

export default function UserForm({ 
  onSubmit, 
  initialData = {}, 
  buttonText = 'Salvar', 
  onCancel, 
  isLoading = false 
}) {
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      id: initialData.id || '',
      name: initialData.name || '',
      email: initialData.email || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const success = await onSubmit(values);
        if (success && !initialData.id) {
          resetForm();
        }
      } catch (error) {
        console.error('Erro no formulário:', error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true
  });

  return (
    <Box 
      component="form" 
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        position: 'relative'
      }}
    >
      {isLoading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          borderRadius: 2
        }}>
          <CircularProgress />
        </Box>
      )}

      <Stack spacing={3}>
        <TextField
          name="name"
          label="Nome Completo"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          disabled={isLoading}
          InputProps={{
            sx: { borderRadius: 1 }
          }}
        />

        <TextField
          name="email"
          label="E-mail"
          type="email"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
          disabled={isLoading || !!initialData.id}
          InputProps={{
            sx: { borderRadius: 1 }
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          pt: 1
        }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
            startIcon={
              formik.isSubmitting ? <CircularProgress size={20} /> : <Save />
            }
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 1
            }}
          >
            {buttonText}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              formik.resetForm();
              onCancel();
            }}
            disabled={formik.isSubmitting || isLoading}
            startIcon={<Cancel />}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 1
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}