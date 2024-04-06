const GoodToken = artifacts.require("GoodToken");

const StartDate = new Date();
console.log(StartDate);

contract("GoodToken" , (accounts) => {

    before(async () => {

        goodToken = await GoodToken.deployed(); 

    })

it("gives the owner the number of 1M tokens", async () => {
    let balance = await goodToken.balanceOf(accounts[0]);    
    balance = web3.utils.fromWei(balance , 'ether');
    assert.equal(balance, '1000000' , 'we need to have 1.000.000 tokens for account 0');
    console.log(StartDate.valueOf());
})

it("transfering 1000 tokens to this accounts..." , async () => {
    let amount = web3.utils.toWei('1000' , 'ether');
    await goodToken.transfer(accounts[1], amount , {from: accounts[0]} );

    let balance = await goodToken.balanceOf(accounts[1]);    
    balance = web3.utils.fromWei(balance , 'ether');
    console.log(balance);
    assert.equal(balance, '1000' , 'we need to transfer 1000 tokens to second account');

})



it("trasfering back tokens to main account...", async () => {

    let amount = await goodToken.balanceOf(accounts[1]);
    console.log(web3.utils.fromWei(amount, 'ether'));
    await goodToken.transfer(accounts[0], amount, {from: accounts[1]} );

    let balance = await goodToken.balanceOf(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    assert.equal(balance, '0', 'we need to transfer back all the tokens to the owner');

})


/*

it("verifing token's expiring date...", async() => {

    setInterval(() => {

        let newDate = new Date(); 
        if( (StartDate.valueOf() + 20000) < newDate.valueOf() ){
            console.log('Token is expired');
        }

    }, 1000);


})

*/

// Web3 send eth let send = web3.eth.sendTransaction({from:eth.coinbase,to:contract_address, value:web3.toWei(0.05, "ether")});






}) 