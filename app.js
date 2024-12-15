import Express from 'express'
import v1Route from './routes/v1.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Express()

// 中介軟體
app.use(Express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(Express.json())
app.use(Express.static(path.join(__dirname, 'public')));

// 設定 header
app.use((req, res, next) => {
  res.setHeader('Accept-Ranges', 'none');
  next();
});

// 路由
app.use("/", v1Route)

// 處理未定義路由的中介軟體
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// 僅在本地開發時啟動伺服器
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3300;
  app.listen(PORT, () => {
    console.log(`${PORT} is on !!`);
  });
}

export default app