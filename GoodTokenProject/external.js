//const Web3 = require('web3');
const Index = require('./Index.tryBought');
const fs = require('fs');

//addnCheck();

//addnCheckSync();

Index.tryBought('1' , '0x6E7B5Ba9ec538C879651FB13777a931256ac863f');
//Index.tryTokenTransact('h0VMI1yJWc3ZMKXXWDoylBeZtsMYgA9tcL0L9o1xPF6iSP5ZqhGx9dpRnMB1MaBF' , 'EVCtGHQ8' , '0x6E7B5Ba9ec538C879651FB13777a931256ac863f' , '100' , '6YwyKJ7wAaJFkOpXT02hZiqOnQtV13wmHqy5FdQG1ARcCpedXsD2bf62FImTYW1F' , 'QuSK8kL4WiRZep6LFErzyeifbPrELp7NTr3KLkosrYw8V7wMOhVoZRyQw5DeCwZI' );


async function addnCheck(){

    await fs.readFile('Purchases.json', async function (err, data) {
    
    let obj = JSON.parse(data);
    obj["purchases"].push({ stockID: "thisstockID5", stockSize: 52 , startDate: 123, endDate: 123, remainingAmount: 10, });  
    data = JSON.stringify(obj , null , 2);
    

    await fs.writeFile("Purchases.json", data , () => {
        console.log('success');
    })


  });

  


  await fs.readFile('Purchases.json', function (err, data) {
    
    let obj = JSON.parse(data);
    data = JSON.stringify(obj , null , 2);
    for (let i = 0; i < obj["purchases"].length; i++) {
        console.log('index ' + i);
        console.log(obj["purchases"][i]);
        if(obj["purchases"][i].stockID == 'thisstockID5')
            console.log('found');
        
    }

    }); 
}


function addnCheckSync(){

    data = fs.readFileSync('Purchases.json');
    let obj = JSON.parse(data);
    obj["purchases"].push({ stockID: "thisstockID6", stockSize: 52 , startDate: 123, endDate: 123, remainingAmount: 10, });  
    data = JSON.stringify(obj , null , 2);
    fs.writeFileSync("Purchases.json", data);

    checkRead = fs.readFileSync('Purchases.json');
    let objRead = JSON.parse(checkRead);
    for (let i = 0; i < objRead["purchases"].length; i++) {
        console.log('index ' + i);
        console.log(objRead["purchases"][i]);
        if(objRead["purchases"][i].stockID == 'thisstockID6')
            console.log('found');

        
    }

}

function issueTokens(etherToDeposit, buyerAddress){

    // Connect to Smart-Contract
    //     ...

    if(etherToDeposit == 0.015){

        //...
  
        hashValues = makeTokensHashes(buyerAddress, stockID , 1000 , nowDate , endDate);
  
        await contract.methods.issue1000Tokens(purchaseCode , stockID, nowDate , endDate).send()
      }

    else{
         // Other stock amounts...    
    } 


    let values = await contract.methods.getPayment(purchaseCode).call();

    // Print all stock Values ...

    // Save stock's off-chain informations ...

}



function tokenTransaction(stockID, buyerAddress , amount , h , H){

    
    // ...
    
    // Release Receipt
    console.log('Validating purchase...');
  
    if( validateReceipt(H_Receipt, index , tempRemainingAmount , buyerAddress, tempStockID ,
    tempStockSize , tempStartDate ,tempEndDate , purchaseInfoIndex , tempLastKnownH) ){ 

      console.log('Your receipt is valid');

      data = fs.readFileSync('Purchases.json');
      let obj = JSON.parse(data);
      obj["purchases"][purchaseInfoIndex].remainingAmount = index;
      data = JSON.stringify(obj , null , 2);
      fs.writeFileSync("Purchases.json", data);

      console.log('Transaction completed: tokens in your wallet ==> '
       + obj["purchases"][purchaseInfoIndex].remainingAmount );

    }else{ 

      return console.error('Your receipt is not valid');

    }   
    
}












/* RUN FROM CMD COMMANDS



                                                                 node -p "require('./Index.js').issueTokens('0.1' , '0x132faBF202567b94E183789A60F0C1ac537D24A2')"

                                                                                                                      node -p "require('./Index.js').tokenTransaction('e4Exu0cb' , '0x132faBF202567b94E183789A60F0C1ac537D24A2' , '2500' , 'qZzenkK2WROhrvne9MWoNLmQNDeNXmqfURzrujvTcz5AWVTHx9utnTRlH32tqNdv' , 'KVFkdxFuTRQbbonvVaXMD0ZnzdSh0nsATBjF68ApY1m0gyehmrYSYoIgaTxpB6sU' )"


node -p "require('./checkPurchases.js').giveRest('GBpj2fbvQ6KyWTG0ceSRgN6GWaK21T2cxN7JcwsgR2v0mbRRDiztkytuLb7XIKI9')"          



|||=======================================|||

node -p "require('./Index.js').issueTokens('0.015' , '0x132faBF202567b94E183789A60F0C1ac537D24A2')"

node -p "require('./Index.js').tokenTransaction('7Q4vEC3F' , '0x132faBF202567b94E183789A60F0C1ac537D24A2' , '500' , 'NaJZB0MQEYUOKMOJGpVi37NIUQ3EU2rNzV8hlIZHeKR7vvpqchqvjzy0UEcPSvL8' , 'yzJEjQT2UclHHIb4faJpgQ0ovDAqEDoDXoH7p0oWb5GB60e3gvQlXL8i8zMxHX1C' )"

node -p "require('./checkPurchases.js').giveRest('RfkgFbwXjT5xbBRZuvLeRNYA4iqCPPfID7H3RlafKZ3MJYVTrwsCHFcQllEZTWC0')"          



/======================================================================================== */