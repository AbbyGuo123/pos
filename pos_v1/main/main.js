'use strict';

const {loadAllItems,loadPromotions} = require('../spec/fixtures');
function printReceipt(buyGoodsList) {
  let allGoodItemArray = loadAllItems();
  let promotion = loadPromotions();
  let codeAndNumArray = buildCodeAndNumArray(buyGoodsList);
  let recieptArray = buildReceiptArray(allGoodItemArray, codeAndNumArray);
  let noDiscountTotalPrice = getReceiptPreSum(recieptArray);
  recieptArray = getReceiptInfo(recieptArray, promotion);
  let discountTotalPrice = getReceiptPoSum(recieptArray);
  // let discountTotalPrice = posum;
  let totalPrice = noDiscountTotalPrice - discountTotalPrice;
  let receiptPrint = generateReciept(recieptArray, discountTotalPrice, totalPrice);

  console.log(receiptPrint);

}

//获取商品优惠总价
const getReceiptPoSum = (buyGoodsList)=>{
  let sum = 0.00;
  for (let buyGoodObject of buyGoodsList) {
    sum += buyGoodObject.sum;
  }
  return sum;
}

//获取商品数量
function buildCodeAndNumArray(buyGoodsList) {
  let codeAndNumArray = [];
  for(let buyGood of buyGoodsList){
    let codeAndNumObject = {code: buyGood, num: 1.00};
    let hasCodeFlag = false;
    if (buyGood.indexOf('-') !== -1) {
      let codeSplit = buyGood.split('-');
      codeAndNumObject.code = codeSplit[0];
      codeAndNumObject.num = parseFloat(codeSplit[1]);
    }
    for (let j = 0; j < codeAndNumArray.length; j++) {
      if (codeAndNumArray[j].code === codeAndNumObject.code) {
        hasCodeFlag = true;
        codeAndNumArray[j].num += codeAndNumObject.num;
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
function buildReceiptArray(allGoodItems, codeAndNumArray) {
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
/**
 * 計算商品原價
 * @param receiptArray 
 */
const getReceiptPreSum = (receiptArray)=> {
  let sum = 0.00;
  for (let recieptObject of receiptArray) {
    sum += recieptObject.price * recieptObject.num;
  }
  return sum;
}


//查找对应商品信息
const getReceiptInfo = (receiptArray, promotion) => {
  for(let promotionObject of promotion) {
    let sum = 0.00;
    for (let recieptObject of receiptArray) {
      let gitNum = recieptObject.num;
      let hasCodeflag = false;
      let barcodes = promotionObject.barcodes;
      for (let barcode of barcodes) {
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
  console.log(":");
  console.info(receiptArray);
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
  receiptPrint ='***<没钱赚商店>收据***\n' +
    content +
    '----------------------\n' +
    '总计：' + discountTotalPrice.toFixed(2) + '(元)\n' +
    '节省：' + totalPrice.toFixed(2) + '(元)\n' +
    '**********************'
  return receiptPrint;
}

module.exports ={printReceipt,buildCodeAndNumArray,buildReceiptArray,getReceiptPreSum,getReceiptInfo,generateReciept} ;