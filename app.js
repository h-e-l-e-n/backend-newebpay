import Express from 'express'
import v1Route from './routes/v1.js'

const app = Express()
app.use(Express.urlencoded({ extended: true })); // 處理 URL 編碼的表單數據
app.use(Express.json())
app.use("/", v1Route)
app.set('view engine', 'ejs')

const port = 3300
app.listen(port, () => {
    console.log(`${port} is on !!`);
    
})

export default app