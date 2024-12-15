import Express from 'express'
import v1Route from './routes/v1.js'

const app = Express()
app.use(Express.urlencoded({ extended: true })); // 處理 URL 編碼的表單數據
app.use(Express.json())
app.use("/", v1Route)
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3300; // 預設本地測試使用 3000
app.listen(PORT, () => {
    console.log(`${PORT} is on !!`);
    
})

export default app