import { createTheme } from '@mui/material/styles'
import { indigo } from '@mui/material/colors'

export default createTheme({
  palette: {
    primary: { main: '#397CD0' },
    secondary: indigo,
  },
  typography: {
    fontSize: 16,
    body1: {
      color: '#304859',
      fontSize: 24,
      fontWeight: 700,
    },
    body2: {
      color: '#7191a5',
      fontSize: 15,
      fontWeight: 700,
    },
  },
})
