import React from 'react'
import { topButtonStyle } from '../../styles/Pages'
import { Button, Container } from '@mui/material'

export default function TopPage() {
  return (
    <Container>
      <h1>WAT Quizzer</h1>
      <Button
        style={topButtonStyle}
        variant="contained"
        size="large"
        color="primary"
        href="/selectquiz"
      >
        Quizzer
      </Button>
      <Button
        style={topButtonStyle}
        variant="contained"
        size="large"
        color="secondary"
        href="/english/top"
      >
        English Quiz Bot
      </Button>
    </Container>
  )
}
