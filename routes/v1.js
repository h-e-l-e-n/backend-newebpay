import Express from 'express'
import * as PaymentController from '../controllers/payment_controller.js'

const v1Route = Express.Router()
v1Route.get('/', (req, res) => {
    res.send('Welcome to the API')
    // 或
    // res.render('index')
  })
v1Route.get('/payment', PaymentController.Payment)
v1Route.post('/createOrder', PaymentController.CreateOrder)
v1Route.get('/check/:id', PaymentController.CheckDetail)
v1Route.post('/newebpay_return', PaymentController.PaymentDone)

export default v1Route