import Express from 'express'
import * as PaymentController from '../controllers/payment_controller.js'

const v1Route = Express.Router()

v1Route.get('/payment', PaymentController.Payment)
v1Route.post('/createOrder', PaymentController.CreateOrder)
v1Route.get('/check/:id', PaymentController.CheckDetail)
v1Route.post('/newebpay_return', PaymentController.PaymentDone)
v1Route.post('/newebpay_notify', PaymentController.PaymentNotify)

export default v1Route