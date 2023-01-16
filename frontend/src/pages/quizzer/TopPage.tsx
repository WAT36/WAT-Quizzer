import React from 'react'
import { Button, Container } from '@material-ui/core'
import { topButtonStyle } from '../../styles/Pages'

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
