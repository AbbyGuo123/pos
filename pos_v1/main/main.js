'use strict';

const {loadAllItems,loadPromotions} = require('../spec/fixtures');
function printReceipt(buyGoodsList) {
  let allGoodItemArray = loadAllItems();
  let promotion = loadPromotions();
  let codeAndNumArray = buildCodeAndNumArray(buyGoodsList);
  let recieptArray = buildReceiptArray(allGoodItemArray, codeAndNumArray);
  recieptArray = getReceiptInfo(recieptArray, promotion);
  let totalPrice = getTotalSum(recieptArray,'noDiscount')- getTotalSum(recieptArray,'discount');
  let receiptPrint = generateReciept(recieptArray, getTotalSum(recieptArray,'discount'), totalPrice);

  console.log(receiptPrint);

}

const getTotalSum =  (receiptArray,type)=> {
  let sum = 0.00;
  for (let recieptObject of receiptArray) {
    if(type==='discount')
    sum += recieptObject.sum;
    else
    sum += recieptObject.price * recieptObject.num;
    
  }
  return sum;
}


//获取商品数量
const buildCodeAndNumArray = (buyGoodsList) => {
  let codeAndNumArray = [];
  for(let buyGood of buyGoodsList){
    let codeAndNumObject = {code: buyGood, num: 1.00};
    let hasCodeFlag = false;
    if (buyGood.indexOf('-') !== -1) {
      let codeSplit = buyGood.split('-');
      codeAndNumObject.code = codeSplit[0];
      codeAndNumObject.num = parseFloat(codeSplit[1]);
    }
    for (let codeAndNum of codeAndNumArray) {
      if (codeAndNum.code === codeAndNumObject.code) {
        hasCodeFlag = true;
        codeAndNum.num += codeAndNumObject.num;
        break;
      }
    }
    if (!hasCodeFlag) {
      codeAndNumArray.push(codeAndNumObject);
    }
  }
  return codeAndNumArray;
}

//获得各商品信息
const buildReceiptArray = (allGoodItems, codeAndNumArray)=> {
  let receiptArray = [];
  for (let goodItem of allGoodItems) {
    for (let codeAndNumObject of  codeAndNumArray) {
      if (goodItem.barcode !== codeAndNumObject.code) continue;
      const {name, unit, price} = goodItem;
      const {code, num} = codeAndNumObject;
      receiptArray.push({code, name, unit, price, num})
    }
  }
  return receiptArray;
}



//查找对应商品信息
const getReceiptInfo = (receiptArray, promotion) => {
  for(let promotionObject of promotion) {
    let sum = 0.00;
    for (let recieptObject of receiptArray) {
      let gitNum = recieptObject.num;
      let hasCodeflag = false;
      for (let barcode of promotionObject.barcodes) {
        if (barcode === recieptObject.code) {
          hasCodeflag = true;
          break;
        }
      }
      if (hasCodeflag) {
        gitNum = recieptObject.num-1;
      }
      recieptObject.sum = recieptObject.price * gitNum;
    }
  }
  return receiptArray;
}



//组装打印数据
/**
 * 组装打印数据
 * @param recieptArray
 * @param discountTotalPrice
 * @param totalPrice
 * @returns {string|*}
 */
const generateReciept = (recieptArray, discountTotalPrice, totalPrice) => {
  let receiptPrint,content='';
  for (let receiptObject of recieptArray) {
    content += '名称：' + receiptObject.name + '，数量：' + receiptObject.num + receiptObject.unit + '，单价：' +
    receiptObject.price.toFixed(2) + '(元)，小计：' + receiptObject.sum.toFixed(2) + '(元)\n'
  }
  receiptPrint ='***<没钱赚商店>收据***\n' + content +'----------------------\n' +'总计：' + 
  discountTotalPrice.toFixed(2) + '(元)\n' +'节省：' + totalPrice.toFixed(2) + '(元)\n' +'**********************'
  return receiptPrint;
}

module.exports ={printReceipt,buildCodeAndNumArray,buildReceiptArray,getReceiptInfo,generateReciept} ;