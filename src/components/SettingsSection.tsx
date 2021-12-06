import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Grid, ToggleButton, Typography } from '@mui/material'

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none',
  },
}), { name: 'SettingsSection' })

type Value = string | number | any[]

const parseValue = (value: Value): string | number => {
  return Array.isArray(value)
    ? value.join('x')
    : value
}
interface SettingsSectionProps {
  title: string;
  values: Value[];
  selectedValue: Value;
  onSelect: ((value: any) => void);
}

const SettingsSection = ({
  title,
  values = [],
  selectedValue,
  onSelect,
}: SettingsSectionProps) => {
  const classes = useStyles()

  const parsedSelectedValue = parseValue(selectedValue)

  return (
    <Grid container item direction="column">
      <Typography>{title}</Typography>
      <Grid container item alignItems="center" columnSpacing={2} wrap="nowrap">
        {values.map(value => {
          const parsedValue = parseValue(value)
          return (
            <Grid item key={parsedValue}>
              <ToggleButton
                className={classes.button}
                selected={parsedSelectedValue === parsedValue}
                value={value}
                onChange={() => onSelect(value)}
              >
                {parsedValue}
              </ToggleButton>
            </Grid>
          )
        })}
      </Grid>

    </Grid>
  )
}

export default SettingsSection
