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
/**
 * 根据不同类型获取总价
 * @param recieptArray
 * @param type （discount、nodiscount）
 */
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
      let index = isObjectInArray(recieptObject,promotionObject.barcodes)
      if (index!=-1) {
        gitNum = recieptObject.num-Math.floor(recieptObject.num/3);
      }
      recieptObject.sum = recieptObject.price * gitNum;
    }
  }
  return receiptArray;
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
    let index = isObjectInArray(codeAndNumObject,codeAndNumArray);
    if (index==-1) {
      codeAndNumArray.push(codeAndNumObject);
    }else{
      codeAndNumArray[index].num += codeAndNumObject.num;
    }
  }
  return codeAndNumArray;
}

//判断该对象的code是否在array里
const isObjectInArray = (object,array)=>{
  let index = -1;
  for (let i=0;i<array.length;i++) {
    let code = array[i].code!==undefined?array[i].code:array[i];
    if ( object.code === code) {
      index = i;
      break;
    }
  }
  return index;
}


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