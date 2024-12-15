import Express from 'express'
import v1Route from './routes/v1.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = Express()
app.use(Express.urlencoded({ extended: true })); // 處理 URL 編碼的表單數據
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(Express.json())
app.use("/", v1Route)
app.use(Express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Accept-Ranges', 'none');
    next();
});


const PORT = process.env.PORT || 3300; // 預設本地測試使用 3000
app.listen(PORT, () => {
    console.log(`${PORT} is on !!`);
    
})

export default app