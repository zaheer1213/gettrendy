import React from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {
  const navigate = useNavigate()

  return (
    <Container className='d-flex justify-content-center align-items-center min-vh-100'>
      <Card
        className='text-center shadow p-4'
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className='mb-3' style={{ fontSize: '3rem', color: 'green' }}>
          ✅
        </div>
        <Card.Title>Payment Successful!</Card.Title>
        <Card.Text className='mb-4'>
          Thank you for your purchase! <br />
          We're thrilled you chose Get Trendy — your style, your way!
          <br />
        </Card.Text>
        <Row>
          <Col xs={12} className='mb-2'>
            <Button
              style={{background:"#E9272D"}}
              className='w-100'
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              variant='outline-secondary'
              className='w-100'
              onClick={() => navigate('/')}
            >
              Home
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default SuccessPage
