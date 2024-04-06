const Web3 = require('web3');
const GoodToken = require('./build/contracts/GoodToken.json');
const crypto = require('crypto');



let Purchases = new Array();

const init = async () => {
  const web3 = new Web3('HTTP://127.0.0.1:7545');
  
  const id = await web3.eth.net.getId();
  const deployedNetwork = GoodToken.networks[id];
  const contract = new web3.eth.Contract(
    GoodToken.abi,
    deployedNetwork.address,  {
      from: '0xE5e7776c5A33c523591C6740ce6C574e02025e97'
    }
  );

  //---------------------------------------------------- //
  //---------------------------------------------------- //

    // Permits to deposit ether inside the contract //

    let PurchaseCode = randomString(12 , '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' );
    let stockID = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

  await contract.methods.deposit().send({
    from: '0x361c4504Ef0E1a964034f50D13e33eF6ee021551',
    value: 1000000000000000000 
  }).then(await contract.methods.transfer('0x361c4504Ef0E1a964034f50D13e33eF6ee021551' , web3.utils.toWei('0' , 'ether')).send({from:'0xE5e7776c5A33c523591C6740ce6C574e02025e97'})
  .then(await contract.methods.addPayment(PurchaseCode, '0x361c4504Ef0E1a964034f50D13e33eF6ee021551', stockID , web3.utils.fromWei('10000000000000000000' , 'ether'), Date.now() , Date.now() + 20000).send({
    from:'0xE5e7776c5A33c523591C6740ce6C574e02025e97',
    gas: 470000,
    gasPrice: 0
  
    })));

    console.log('Your PurchaseCode is ' + PurchaseCode +'\n');

  
  let values = await contract.methods.getPayment(PurchaseCode).call()

  
  console.log('you should get --> ' + values[0] + ' <--- BuyerAddress');
  console.log('you should get --> ' + values[1] + ' <--- StockID');
  console.log('you should get --> ' + values[2] + ' <--- StockSize');
  console.log('you should get --> ' + values[3] + ' <--- Purchase Time');
  console.log('you should get --> ' + values[4] + ' <--- Expiration Time');
  

  //FIXME
  Hashes = makeProofs();
  console.log(Hashes[0] + '<--- h_0 \n'+ Hashes[1] + '<--- H_0' );
  let Hash = buildProofs(Hashes[0], Hashes[1], values[0], values[1], parseInt(values[2]), values[3], values[4]);

  await contract.methods.addInfos(PurchaseCode, Hashes[0], Hash[1]).send({
      from:'0x361c4504Ef0E1a964034f50D13e33eF6ee021551',
      gas: 470000,
      gasPrice: 0
    
      })
  //---------------------------------------------------- //
  //---------------------------------------------------- //

    // Permits to withdraw ether to requesting account //

  
  await contract.methods.withdraw('3000000000000000000').send({
    from: '0xE5e7776c5A33c523591C6740ce6C574e02025e97',
  });
  

  //---------------------------------------------------- //
  //---------------------------------------------------- //

  let PurchaseInfo = {stockID:values[1], stockSize: parseInt(values[2]),  remainingAmount: parseInt(values[2]), lastKnownH: Hash[1], EndDate: Date.now() + 20000, BuyerAddress: values[0]};
  
  Purchases.push(PurchaseInfo);
  console.log(Purchases[0]);

  await transaction(values[1], 3, Hashes[0], Hashes[1]);
  
  await transaction(values[1], 3, Hashes[0], Hashes[1]);

  await transaction(values[1], 4 , Hashes[0], Hashes[1]);



    // Checking ether amount inside contract //

  const result = await contract.methods.checkAssets().call();
  
  console.log('\n' + result + '<------ ETHER STORED ');

  //---------------------------------------------------- //
  //---------------------------------------------------- //

  

  console.log(await contract.methods.totalSupply().call() + '<------ TOKENS TOTAL SUPPLY \n ');

  //---------------------------------------------------- // 

  console.log(await contract.methods.balanceOf('0xE5e7776c5A33c523591C6740ce6C574e02025e97').call() + '<------ Account0 STARTING BALANCE ' );
  console.log(await contract.methods.balanceOf('0x361c4504Ef0E1a964034f50D13e33eF6ee021551').call() + '<------ Account1 STARTING BALANCE \n' );

  //---------------------------------------------------- //
  // transfer 1000 tokens to Account1 ------------------ //

  await contract.methods.transfer('0x361c4504Ef0E1a964034f50D13e33eF6ee021551' , web3.utils.toWei('100000' , 'ether')).send({from:'0xE5e7776c5A33c523591C6740ce6C574e02025e97'});
  
  //---------------------------------------------------- //

  console.log(await contract.methods.balanceOf('0xE5e7776c5A33c523591C6740ce6C574e02025e97').call() + '<------ Account0 NEW BALANCE ' );
  console.log(await contract.methods.balanceOf('0x361c4504Ef0E1a964034f50D13e33eF6ee021551').call() + '<------ Account1 NEW BALANCE \n' );
  
  //---------------------------------------------------- //

  await contract.methods.transfer('0xE5e7776c5A33c523591C6740ce6C574e02025e97', web3.utils.toWei('100000' , 'ether')).send({from: '0x361c4504Ef0E1a964034f50D13e33eF6ee021551'});

  //---------------------------------------------------- //

  console.log(await contract.methods.balanceOf('0xE5e7776c5A33c523591C6740ce6C574e02025e97').call() + '<------ Account0 ENDING BALANCE' );
  console.log(await contract.methods.balanceOf('0x361c4504Ef0E1a964034f50D13e33eF6ee021551').call() + '<------ Account1 ENDING BALANCE' );



//---------------------------------------------------- //
//Build a random string ('LENGHT' characters) -------------- //

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

//---------------------------------------------------- //
//---------------------------------------------------- //

//---------------------------------------------------- //
//Build h[] and H[] for buyer ------------------------ //

function makeProofs() {
  let h_0 = randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  let H_0 = randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  console.log(h_0 + '<--- h_0 \n'+ H_0 + '<--- H_0' );
  let hHvalues = [h_0, H_0];
  
  return (hHvalues);
}

function buildProofs(h_0 , H_0 , BuyerAddress, stockID , stockSize , StartDate, EndDate){

  let h = new Array(stockSize + 1);
  let H = new Array(stockSize + 1);

  h[0] = h_0;
  H[0] = H_0;
  

  console.log('\nh_0' + ' hash is ' + h[0]);
  for(let i = 1; i < h.length; i++){
    h[i] = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + h[i-1]).digest('hex');
    console.log('h_' + i + ' hash is ' + h[i]);

  }

  console.log('\nH_0' + ' hash is ' + H[0]);

  for(let i = 1; i < H.length; i++){
    H[i] = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + H[i-1]).digest('hex');
    console.log('H_' + i + ' hash is ' + H[i]);

  }


  let lastKnownH = H[H.length - 1];
  console.log(lastKnownH);
  let HashesValues = [h[0], H[H.length - 1], lastKnownH ];
  
  
  
  

  return HashesValues;

}


//---------------------------------------------------- //
//---------------------------------------------------- //

//---------------------------------------------------- //
//Function to add purchaseInfo ----------------------- //

function addInfos( PurchaseCode, Infos ){

 


}

//---------------------------------------------------- //
//---------------------------------------------------- //

//---------------------------------------------------- //
//Function to buy with tokens (off-chain) ------------ //

async function transaction(stockID , amount , h, H){
  let PurchaseInfoIndex;
  for (let i = 0; i < Purchases.length; i++) {
    if(stockID == Purchases[i].stockID)
      PurchaseInfoIndex = i;
  }
  console.log(Purchases[PurchaseInfoIndex].remainingAmount)
  if(Purchases[PurchaseInfoIndex].remainingAmount < amount)
    return console.error('NOT SUFFICIENT FUNDS');
  
  BlockChainHashes = await contract.methods.getPurchaseInfos(PurchaseCode).call();
  console.log(BlockChainHashes[0] + '<----h0\n' + BlockChainHashes[1] + '<----H_N');

  index = Purchases[PurchaseInfoIndex].remainingAmount - amount;
  hToIndex = hashToN(h , index, values[0], values[1], parseInt(values[2]), values[3], values[4] );
  hBlockChainToIndex = hashToN(BlockChainHashes[0] , index, values[0], values[1], parseInt(values[2]), values[3], values[4] );

  // CHECKS IF BUYER HAS HAS TOKENS
  
  for (let i = index; i < Purchases[PurchaseInfoIndex].remainingAmount; i++) {
    if(hToIndex == hBlockChainToIndex ){
      console.log('correspond');
      console.log('Token used: ' + i);
      hToIndex = crypto.createHash('sha256').update(i + '' + values[0] + '' + values[1] + '' + values[2] + '' + values[3] + '' + values[4] + '' + hToIndex).digest('hex');
      hBlockChainToIndex = crypto.createHash('sha256').update(i + '' + values[0] + '' + values[1] + '' + values[2] + '' + values[3] + '' + values[4] + '' + hBlockChainToIndex).digest('hex');
    }else{
      return console.error('Token hashes do not correspond!');
    }
    
  }

  // RELEASE A BUY RECEIPT , VALIDATING THE LAST GIVEN HASH

  console.log(H + ' H at the start of purchase');
  H_Receipt = hashToN(H , index, values[0], values[1], parseInt(values[2]), values[3], values[4] ); // the new lastKnownH 

  console.log('Validating purchase...');

  if( validateReceipt(H_Receipt, index , Purchases[PurchaseInfoIndex].remainingAmount, values[0], values[1], parseInt(values[2]), values[3], values[4] , PurchaseInfoIndex)){
    console.log('Your receipt is valid');
    Purchases[PurchaseInfoIndex].remainingAmount = index;
    console.log('Transaction completed: tokens in your wallet ==> ' + Purchases[PurchaseInfoIndex].remainingAmount );
    console.log(Purchases[PurchaseInfoIndex]);
  }else{
    return console.error('Your receipt is not valid');
  }
  
  



  
  
  
  

}

function hashToN (StringToHash , index , BuyerAddress, stockID , stockSize , StartDate, EndDate){
  let h = StringToHash;
  console.log('h_0' +  ' hash is ' + h);
  for(let i = 1; i < index; i++){
    h = crypto.createHash('sha256').update(i + '' + BuyerAddress + '' + stockID + '' + stockSize + '' + StartDate + '' + EndDate + '' + h).digest('hex');
    console.log('h_' + i + ' hash is ' + h);

  }

  return h;
}

function validateReceipt(StringToHash , index , indexLastKnownH , BuyerAddress, stockID , stockSize , StartDate, EndDate, PurchaseInfoIndex){
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
    console.log('H_' + i + ' hash is ' + H)
  }
  
  console.log(Purchases[PurchaseInfoIndex]);
  console.log(H +' <========= H');
  
  if( H == Purchases[PurchaseInfoIndex].lastKnownH ){
    Purchases[PurchaseInfoIndex].lastKnownH = NewLastKnownH;
    return true;
  }
  else 
    return false;

}

setInterval(() => {
  console.log('Checking tokens validation...')
  let nowTime = Date.now();
  console.log('nowTime is ' + nowTime);
  let data = fs.readFileSync('Purchases.json');
  let obj = JSON.parse(data);
  for (let i = 0; i < obj["purchases"].length; i++) {

    
    dateToCheck = obj["purchases"][i].endDate;
    console.log('Stock EndTime is  ' + dateToCheck);
    if(dateToCheck < nowTime){
      console.log('Before removing stock ' + obj["purchases"][i]);
      getRest(i)
      //expireStock(i);
      //console.log('After removing stock ' + Purchases[i]);

    }
    
  }
}, 10000);

function expireStock(PurchaseIndex){
  Purchases.splice(PurchaseIndex, 1);
}

async function getRest(PurchaseIndex){

  tokens_unused = Purchases[PurchaseIndex].remainingAmount;
  AddressArray = await contract.methods.getPurchaseInfos(PurchaseCode).call();
  BuyerAddress = AddressArray[2];
  console.log('indirizzo  '+ Address);
  balanceOwner = await contract.methods.balanceOf(BuyerAddress).call();
  

  

}


//---------------------------------------------------- //
//---------------------------------------------------- //

}


init();


// const hash = crypto.createHash('sha256').update(pwd).digest('base64'); sha256



/* OLD code 

BlockChainHashes = await contract.methods.getPurchaseInfos(purchaseCode).call();
    console.log(BlockChainHashes[0] + '<----h0\n' + BlockChainHashes[1] + '<----H_N');
  
    index = tempRemainingAmount - amount;
    hToIndex = hashToN(h , index, values[0], values[1], parseInt(values[2]), values[3], values[4] );
    hBlockChainToIndex = hashToN(BlockChainHashes[0] , index, values[0], values[1], parseInt(values[2]), values[3], values[4] );
  
    // CHECKS IF BUYER HAS HAS TOKENS
    
    for (let i = index; i < Purchases[PurchaseInfoIndex].remainingAmount; i++) {
      if(hToIndex == hBlockChainToIndex ){
        console.log('correspond');
        console.log('Token used: ' + i);
        hToIndex = crypto.createHash('sha256').update(i + '' + values[0] + '' + values[1] + '' + values[2] + '' + values[3] + '' + values[4] + '' + hToIndex).digest('hex');
        hBlockChainToIndex = crypto.createHash('sha256').update(i + '' + values[0] + '' + values[1] + '' + values[2] + '' + values[3] + '' + values[4] + '' + hBlockChainToIndex).digest('hex');
      }else{
        return console.error('Token hashes do not correspond!');
      }
      
    }
  
    // RELEASE A BUY RECEIPT , VALIDATING THE LAST GIVEN HASH
  
    console.log(H + ' H at the start of purchase');
    H_Receipt = hashToN(H , index, values[0], values[1], parseInt(values[2]), values[3], values[4] ); // the new lastKnownH 
  
    console.log('Validating purchase...');
  
    if( validateReceipt(H_Receipt, index , Purchases[PurchaseInfoIndex].remainingAmount, values[0], values[1], parseInt(values[2]), values[3], values[4] , PurchaseInfoIndex)){
      console.log('Your receipt is valid');
      Purchases[PurchaseInfoIndex].remainingAmount = index;
      console.log('Transaction completed: tokens in your wallet ==> ' + Purchases[PurchaseInfoIndex].remainingAmount );
      console.log(Purchases[PurchaseInfoIndex]);
    }else{
      return console.error('Your receipt is not valid');
    }   
    
  
  }

  function validateReceipt(StringToHash , index , indexLastKnownH , BuyerAddress, stockID , stockSize , StartDate, EndDate, PurchaseInfoIndex){
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
      console.log('H_' + i + ' hash is ' + H)
    }
    
    console.log(Purchases[PurchaseInfoIndex]);
    console.log(H +' <========= H');
    
    if( H == Purchases[PurchaseInfoIndex].lastKnownH ){   // receipt validation
      Purchases[PurchaseInfoIndex].lastKnownH = NewLastKnownH;
      return true;
    }
    else 
      return false;
  
  }

  */