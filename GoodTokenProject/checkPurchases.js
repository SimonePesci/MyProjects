const Web3 = require('web3');
const SafeToken = require('./build/contracts/SafeToken.json');
const fs = require('fs');


const owner = '0xE5e7776c5A33c523591C6740ce6C574e02025e97'; 

// Verifies stock expiration time and gives rest if expired

async function giveRest(purchaseCode) {
  console.log('Checking stock expiration Date...');
  let IndexToUpdate;
  let nowTime = Date.now();
  console.log('Time is ' + nowTime);
  let data = fs.readFileSync('Purchases.json');
  let obj = JSON.parse(data);

  let stockFound = false;

  for (let i = 0; i < obj["purchases"].length; i++) {
    
    if(purchaseCode == obj["purchases"][i].purchaseCode){  // Checks for this purchaseCode stored

      stockFound = true;
      IndexToUpdate = i;
      let dateToCheck = obj["purchases"][IndexToUpdate].endDate;

      if(dateToCheck < nowTime){   // if found, check for expiration date ==>  getRest (blockchain rest and update) ==> updateStock (Purchases.json update )
            console.log('This stock is being set EXPIRED');
            console.log(obj["purchases"][IndexToUpdate]);
            await getRest(obj["purchases"][IndexToUpdate].stockSize - obj["purchases"][IndexToUpdate].remainingAmount , obj["purchases"][IndexToUpdate].purchaseCode , obj["purchases"][IndexToUpdate].BuyerAddress , nowTime)
            console.log('Blockchain Updated');
            updateStock(IndexToUpdate, obj);
      } else {
        console.error("This stock is not Expired yet, try later");
      } // end if

    } //execution end 
    

  } // end for cycle

  if(!stockFound)
    console.error("Stock you were looking for is not here");

}


  // Gives the buyer the rest according to the remaining amount in the stock (on-chain) //

  async function getRest(tokensUsed , purchaseCode , buyerAddress , now_Date){

    console.log('trying to get rest...')

    web3 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3.eth.net.getId();
    deployedNetwork = SafeToken.networks[id];
    contract = new web3.eth.Contract(
      SafeToken.abi,
      deployedNetwork.address,  {
        from: '0xE5e7776c5A33c523591C6740ce6C574e02025e97'
      }
    );


    web3.eth.getBalance(buyerAddress, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Buyer ETH balance before withdraw");
      }
    }) 

    await contract.methods.withdraw(tokensUsed , purchaseCode , now_Date).send({
      from: buyerAddress,
      gas: 400000,
      gasPrice: 1000
    });

    console.log('Rest received successfully')


    web3.eth.getBalance(buyerAddress, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Buyer ETH new balance");
      }
    })

    web3.eth.getBalance(owner, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(web3.utils.fromWei(result, "ether") + " Owner ETH new balance");
      }
    })

  }

  // ================================================================ //


  // Set stock to 'Expired'
  function updateStock(IndexToUpdate, purchases){

    purchases["purchases"][IndexToUpdate].Rest_Given = true;
    let data = JSON.stringify(purchases , null , 2);
    fs.writeFileSync("Purchases.json", data);
    console.log('Rest_Given set to TRUE');

  }


module.exports.giveRest = giveRest;