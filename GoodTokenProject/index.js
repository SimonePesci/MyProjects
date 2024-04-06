const Web3 = require('web3');
const SafeToken = require('./build/contracts/SafeToken.json');
const crypto = require('crypto');
const fs = require('fs');


let web3;
let id;
let deployedNetwork;
let contract;

const owner = '0xE5e7776c5A33c523591C6740ce6C574e02025e97';


  const init = async () => {
    web3 = new Web3('HTTP://127.0.0.1:7545');
    
    id = await web3.eth.net.getId();
    deployedNetwork = SafeToken.networks[id];
    contract = new web3.eth.Contract(
      SafeToken.abi,
      deployedNetwork.address,  {
        from: owner
      }
    );

  }



  async function issueTokens(etherToDeposit, buyerAddress){ // 1 ether => 1000 token


    web3 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3.eth.net.getId();
    deployedNetwork = SafeToken.networks[id];
    contract = new web3.eth.Contract(
      SafeToken.abi,
      deployedNetwork.address,  {
        from: '0xE5e7776c5A33c523591C6740ce6C574e02025e97'
      }
    );

    web3.eth.getBalance(owner, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Owner ETH balance")
      }
    });

    web3.eth.getBalance(buyerAddress, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Buyer ETH balance before deposit")
      }
    });




    if(etherToDeposit != 0.015 && etherToDeposit != 0.0075 && etherToDeposit != 0.00375)
      return console.error('Not an available amount, choose between 0.015 , 0.0075 or 0.00375 ether to issue a token stock')

    let purchaseCode = randomString(64 , '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    let stockID = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    let nowDate = Date.now();
    

    let hashValues;

    


    if(etherToDeposit == 0.015){

      await contract.methods.approveTransfer(buyerAddress , 1000).send({
        from: owner,
        gas: 400000,
        gasPrice: 1000
      })

      hashValues = makeTokensHashes(buyerAddress, stockID , 1000 , nowDate , nowDate + 300000);

      await contract.methods.issue1000Tokens(purchaseCode , stockID, nowDate , nowDate + 300000).send({
        from: buyerAddress,
        value: (etherToDeposit * (10 ** 18)),
        gas: 400000,
        gasPrice: 1000
        
      })
    }

    else if(etherToDeposit == 0.0075){

      await contract.methods.approveTransfer(buyerAddress, 500).send({
        from: owner,
        gas: 400000,
        gasPrice: 1000
      })

      hashValues = makeTokensHashes(buyerAddress, stockID , 500 , nowDate , nowDate + 300000);

      await contract.methods.issue500Tokens(purchaseCode , stockID, nowDate , nowDate + 300000).send({
        from: buyerAddress,
        value: (etherToDeposit * (10 ** 18)),
        gas: 300000,
        gasPrice: 1000
        
      })
    }
    
    else if(etherToDeposit == 0.00375){

      await contract.methods.approveTransfer(buyerAddress, 250).send({
        from: owner,
        gas: 400000,
        gasPrice: 1000
      })

      hashValues = makeTokensHashes(buyerAddress, stockID , 250 , nowDate , nowDate + 300000);

      await contract.methods.issue250Tokens(purchaseCode , stockID, nowDate , nowDate + 300000).send({
        from: buyerAddress,
        value: (etherToDeposit * (10 ** 18)),
        gas: 400000,
        gasPrice: 1000
        
      })
    }

    let values = await contract.methods.getPayment(purchaseCode).call();

    

    console.log('\n Your data is listed below \n\n');


    console.log('\n' + purchaseCode + ' <=== PurchaseCode');  
    console.log('' + values[0] + ' <=== BuyerAddress');
    console.log('' + values[1] + ' <=== StockID');
    console.log('' + values[2] + ' <=== StockSize');
    console.log('' + values[3] + ' <=== Purchase Time');
    console.log('' + values[4] + ' <=== Expiration Time');
    console.log('' + hashValues[0] + ' <=== h_0');
    console.log('' + global_H_0 + ' <=== H_0\n');
  


    global_purchaseCode = purchaseCode;
    global_h_0 = hashValues[0];
    global_stockID = values[1];

    // Store data in Purchase.json File //

    data = fs.readFileSync('Purchases.json');
    let obj = JSON.parse(data);
    obj["purchases"].push({purchaseCode: purchaseCode , stockID: values[1], stockSize: parseInt(values[2]) , remainingAmount: parseInt(values[2]) , lastKnownH: hashValues[1] , startDate: nowDate, endDate: nowDate + 300000, BuyerAddress: values[0] , h_0: hashValues[0], Rest_Given: false});  
    data = JSON.stringify(obj , null , 2);
    fs.writeFileSync("Purchases.json", data);

    

    web3.eth.getBalance(buyerAddress, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Buyer ETH balance after deposit");
      }
    })
    


  } // END issueToken function




  async function tokenTransaction(stockID, buyerAddress , amount , h , H){

    web3 = new Web3('HTTP://127.0.0.1:7545');
    
    id = await web3.eth.net.getId();
    deployedNetwork = SafeToken.networks[id];
    contract = new web3.eth.Contract(
      SafeToken.abi,
      deployedNetwork.address,  {
        from: '0xE5e7776c5A33c523591C6740ce6C574e02025e97'
      }
    );

    let validStock = false;

    let purchaseInfoIndex;

    let tempStockID;
    let tempStockSize;
    let tempStartDate;
    let tempEndDate;
    let tempLastKnownH;
    let tempRemainingAmount;
    let stored_h_0;

    // READ FROM Purchases.json
  
    let data = fs.readFileSync('Purchases.json');
    let obj = JSON.parse(data);
    data = JSON.stringify(obj , null , 2);
    checkRead = fs.readFileSync('Purchases.json');
    let objRead = JSON.parse(checkRead);
    for (let i = 0; i < objRead["purchases"].length; i++) {
        
        if(objRead["purchases"][i].stockID == stockID){
          purchaseInfoIndex = i;

          tempStockID = obj["purchases"][i].stockID;
          tempStockSize = obj["purchases"][i].stockSize;
          tempStartDate = obj["purchases"][i].startDate;
          tempEndDate = obj["purchases"][i].endDate;
          tempLastKnownH = obj["purchases"][i].lastKnownH;
          tempRemainingAmount = obj["purchases"][i].remainingAmount;
          stored_h_0 = obj["purchases"][i].h_0;
          
          // STOCK FOUND => VALID STOCK
          validStock = true;
        }
            
        
    }

    if(tempEndDate < Date.now())
      return console.error('Stock is expired, wait for rest...')
      
    if(!validStock )
      return console.error('Not a valid stock, try again');


    
    if(tempRemainingAmount < amount)
      return console.error('NOT SUFFICIENT FUNDS');
    
  
    index = tempRemainingAmount - amount;
    hToIndex = hashToN(h , index, buyerAddress, tempStockID , tempStockSize , tempStartDate ,tempEndDate);
    hStoredToIndex = hashToN(stored_h_0 , index, buyerAddress, tempStockID , tempStockSize , tempStartDate ,tempEndDate);
  
    // CHECKS IF BUYER HAS TOKENS (Hashes need to correspond)
    
    for (let i = index; i < tempRemainingAmount ; i++) {
      if(hToIndex == hStoredToIndex ){
        
        hToIndex = crypto.createHash('sha256').update(i + '' + buyerAddress + '' + tempStockID + '' + tempStockSize + '' + tempStartDate + '' + tempEndDate + '' + hToIndex).digest('hex');
        hStoredToIndex = crypto.createHash('sha256').update(i + '' + buyerAddress + '' + tempStockID + '' + tempStockSize + '' + tempStartDate + '' + tempEndDate + '' + hStoredToIndex).digest('hex');
      }else{
        return console.error('Token hashes do not correspond!');
      }
      
    }
  
    // RELEASE A BUY RECEIPT , VALIDATING THE LAST GIVEN HASH

    H_Receipt = hashToN(H , index, buyerAddress, tempStockID , tempStockSize , tempStartDate ,tempEndDate); // the new lastKnownH 
  
    console.log('Validating purchase...');
  
    if( validateReceipt(H_Receipt, index , tempRemainingAmount , buyerAddress, tempStockID , tempStockSize , tempStartDate ,tempEndDate , purchaseInfoIndex , tempLastKnownH)){ // indexToFind
      console.log('Your receipt is valid');

      data = fs.readFileSync('Purchases.json');
      let obj = JSON.parse(data);
      obj["purchases"][purchaseInfoIndex].remainingAmount = index;
      data = JSON.stringify(obj , null , 2);
      fs.writeFileSync("Purchases.json", data);

      console.log('Transaction completed: tokens in your wallet ==> ' + obj["purchases"][purchaseInfoIndex].remainingAmount );

    }else{
      return console.error('Your receipt is not valid');
    }   
    
  
  }

  function validateReceipt(StringToHash , index , indexLastKnownH , BuyerAddress, stockID , stockSize , StartDate, EndDate, purchaseInfoIndex, tempLastKnownH){
    let H = StringToHash ;
    let NewLastKnownH ;
    let changed = false;
  
    if(index == 0){
      index = 1;
      changed = true;
    }
  
    for (let i = index ; i <= indexLastKnownH ; i++) {
      H = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + H).digest('hex');
      if(changed)
        NewLastKnownH = StringToHash;
      else if(i == index)
        NewLastKnownH = H;
      
    }
    
   
    
    if( H == tempLastKnownH ){   // receipt validation

      data = fs.readFileSync('Purchases.json');
      let obj = JSON.parse(data);
      obj["purchases"][purchaseInfoIndex].lastKnownH = NewLastKnownH;
      data = JSON.stringify(obj , null , 2);
      fs.writeFileSync("Purchases.json", data);
      return true;
    }
    else 
      return false;
  
  }


  init();





  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

  // build h_0 and H_N   ||  gives buyer h_0 and H_0

  function makeTokensHashes(BuyerAddress , stockID ,  stockSize , StartDate , EndDate){

    
    let h_0 = randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    let H_0 = randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    

    global_H_0 = H_0;
    

    let H = new Array(stockSize + 1);
    H[0] = H_0;


    for(let i = 1; i < H.length; i++){

      H[i] = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + H[i-1]).digest('hex');
      
      
  
    }
    
    let H_N = H[H.length - 1];
    
    let hHvalues = [h_0, H_N];
  
    return (hHvalues);
  }


  function hashToN (StringToHash , index , BuyerAddress, stockID , stockSize , StartDate, EndDate){
    let h = StringToHash;
    
    for(let i = 1; i < index; i++){
      h = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + h).digest('hex');
     
  
    }
  
    return h;
  }


module.exports.tokenTransaction = tokenTransaction;
module.exports.issueTokens = issueTokens;

