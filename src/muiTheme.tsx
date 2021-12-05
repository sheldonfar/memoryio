import { createTheme } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'

export default createTheme({
  palette: {
    primary: { main: '#397CD0' },
    secondary: indigo,
  },
  typography: {
    fontSize: 16,
  },
})
