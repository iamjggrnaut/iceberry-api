const Router = require('express')
const router = new Router()
const adminRouter = require('./adminRouter')
const orderRouter = require('./orderRouter')
const productRouter = require('./productRouter')
const paymentRouter = require('./paymentRouter');
const categoryRouter = require('./categoryRouter');


router.use('/admin', adminRouter)
router.use('/product', productRouter)
router.use('/order', orderRouter)
router.use('/payments', paymentRouter);
router.use('/category', categoryRouter);


module.exports = router