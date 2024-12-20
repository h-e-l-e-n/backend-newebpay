import 'dotenv/config'
import crypto from 'crypto'

const orders = {};
const userDetail = null
const {
    MerchantID,
    HASHKEY,
    HASHIV,
    Version,
    PayGateWay,
    NotifyUrl,
    ReturnUrl,
} = process.env;
const RespondType = 'JSON';

export const Payment = (req, res) => {
    res.render('payment.ejs', { title: 'JoiPay'})
}

export const CreateOrder = (req, res) => {
    const data = req.body
    console.log('送出的資料:',data);

      // 使用 Unix Timestamp 作為訂單編號（金流也需要加入時間戳記）
    const TimeStamp = Math.round(new Date().getTime() / 1000);
    const order = {
    ...data,
    TimeStamp,
    Amt: parseInt(data.Amount),
    MerchantOrderNo: TimeStamp,
    };
    
    const aesEncrypt = createSesEncrypt(order)

    const shaEncrypt = createShaEncrypt(aesEncrypt)
    order.aesEncrypt = aesEncrypt;
    order.shaEncrypt = shaEncrypt;

    orders[TimeStamp] = order
    
    res.redirect(`/check/${TimeStamp}`)
}

export const CheckDetail = (req, res) => {
    const { id } = req.params;
    const order = orders[id]
    console.log('check:',order);

    res.render('check.ejs', {
        title: 'JoiCheck',
        PayGateWay,
        Version,
        order,
        MerchantID,
        NotifyUrl,
        ReturnUrl,
    })
}

export const PaymentNotify = async(req, res, next) => {
    const response = req.body;
    const data = createSesDecrypt(response.TradeInfo);
    console.log('解密後的資料', data);
    
    try {
      // 使用 session 儲存資訊
    req.session.userDetail = {
        orderNumber: data.Result.MerchantOrderNo,
        amount: data.Result.Amt
    };
    return res.end();
    } catch(err) {
    console.error(err);
    return res.status(500).end();
    }
}


//交易成功
export const PaymentDone = (req, res, next) => {
  const response = req.body;
  console.log('paymentDone:',response);
    
  res.render('success.ejs', {title: '交易完成' });
  };
  
//回傳的參數名稱不可改
function genDataChain(order) {
    return `MerchantID=${MerchantID}&TimeStamp=${
    order.TimeStamp
    }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
    order.MerchantOrderNo
    }&Amt=${order.Amount}&NotifyURL=${encodeURIComponent(
    NotifyUrl,
    )}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.ItemDesc,
    )}&Email=${encodeURIComponent(order.Email)}`;
}

// 使用 aes 對信用卡號等重要交易資訊行加密
function createSesEncrypt(TradeInfo) {
    // encrypt是加密器,enc才是加密過後的字串
    const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV);
    // update開始加密，final完成加密，genDataChain將物件轉換成適合加密的格式
    const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
    return enc + encrypt.final('hex');
}

  // p.20,使用 sha256 加密，將aes加密字串產生檢查碼，並轉換為大寫，hash轉換過的文字無法再轉回
function createShaEncrypt(aesEncrypt) {
    const hash = crypto.createHash('sha256');
    const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

    return hash.update(plainText).digest('hex').toUpperCase();
}

  // 將 aes 解密
function createSesDecrypt(TradeInfo) {
    const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return JSON.parse(result);
}