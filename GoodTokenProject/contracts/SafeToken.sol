pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract SafeToken is ERC20{

    mapping(address => uint256) depositedEther;
    mapping(address => uint256) tokensDeserved;
    mapping(string => PurchaseInfo) Payments;

    address public _owner;
    string[] PurchaseID;

    struct PurchaseInfo{

        address BuyerAddress;
        string stockId;
        uint256 stockSize;
        uint256 StartDate;
        uint256 EndDate;
        bool Expired;

    }

    constructor(uint256 initialSupply) ERC20("SafeToken", "ST"){
        _mint(msg.sender, initialSupply * (10 ** decimals()));
        _owner = msg.sender;
  
    }

    function getOwner() public view returns (address){

        return _owner;
    }  

    function approveTransfer(address sender, uint256 supply) public returns (uint256){
        
        approve(sender , supply );
        
        
        return allowance(_owner , sender);
        
    }

    function issue250Tokens(string memory PurchaseCode, string memory stockID, uint256 PaymentDate, uint256 TokensExpiration) public payable returns (bool){      // 1.000 tokens per ETH deposited
        // deposit ether in the contract
        require(msg.value == 3750000000000000 wei , '3750000000000000 wei are required to issue 250 tokens (0.00375 ether)');
        

        // transfer the equivalent amount to buyer adding infos to contract
        
        require( balanceOf(_owner) >= tokensDeserved[msg.sender] , 'Tokens not available at the moment, try later');
    

        addPayment(PurchaseCode, msg.sender, stockID,  250 , PaymentDate, TokensExpiration);
        //addInfos(PurchaseCode, h_0 , H_N);
        
        transferFrom(_owner, msg.sender ,  250 );

        depositedEther[msg.sender] += msg.value;
        tokensDeserved[msg.sender] += 250;
        
        
        return true;

    }
    
    function issue500Tokens(string memory PurchaseCode, string memory stockID, uint256 PaymentDate, uint256 TokensExpiration) public payable returns (bool){      // 1.000 tokens per ETH deposited
        // deposit ether in the contract
        require(msg.value == 7500000000000000 wei , '7500000000000000 wei are required to issue 500 tokens (0.0075 ether)');
        

        // transfer the equivalent amount to buyer adding infos to contract
        
        require( balanceOf(_owner) >= tokensDeserved[msg.sender] , 'Tokens not available at the moment, try later');
    

        addPayment(PurchaseCode, msg.sender, stockID,  500 , PaymentDate, TokensExpiration);
        //addInfos(PurchaseCode, h_0 , H_N);
        
        transferFrom(_owner, msg.sender ,  500 );

        depositedEther[msg.sender] += msg.value;
        tokensDeserved[msg.sender] += 500;
        
        
        return true;

    }

    function issue1000Tokens(string memory PurchaseCode, string memory stockID, uint256 PaymentDate, uint256 TokensExpiration) public payable returns (bool){ 
        
        
        require(msg.value == 15000000000000000 wei , '15000000000000000 wei are required to issue 1000 tokens (0.015 ether)');

        // transfer the equivalent amount to buyer adding stock infos to contract
        
    
        addPayment(PurchaseCode, msg.sender, stockID,  1000 , PaymentDate, TokensExpiration);
        

        transferFrom(_owner, msg.sender ,  1000 );

        // deposit ether into the contract
        depositedEther[msg.sender] += msg.value;
        tokensDeserved[msg.sender] += 1000;

        
        
        return true;

    }

    

    
    
    function withdraw(uint256 tokensUsed, string memory purchaseCode , uint256 nowDate) public {
        
        uint256 stockSize = Payments[purchaseCode].stockSize;

        require(Payments[purchaseCode].EndDate < nowDate , 'This stock is not yet expired!');

        // transfer all tokens of the stock to the owner
        transfer( _owner, stockSize );
        

        // Update expiration for the stock

        Payments[purchaseCode].Expired = true;
        
        // check ether's amount reserved for owner and buyer and transfer the equivalent amount
        uint256 weiToBuyer = (stockSize - tokensUsed) * 15000000000000;
        uint256 weiToOwner = (tokensUsed * 15000000000000);
        payable(msg.sender).transfer(weiToBuyer);
        payable(_owner).transfer(weiToOwner);

        // update amount of tokens still active and deposited ether
        depositedEther[msg.sender] = depositedEther[msg.sender] - (stockSize * 15000000000000);
        tokensDeserved[msg.sender] = tokensDeserved[msg.sender] - stockSize;

        
    }
    
    function checkAssets() public view returns(uint256){
        return address(this).balance;
        
    }

    function addPayment(string memory PurchaseCode , address buyerAddress, string memory stockID, uint256 stockSize , uint256 PaymentDate, uint256 TokenExpiration ) internal returns (bool){
        //bytes32 PurchaseHash = sha256(abi.encodePacked(PurchaseCode));

        //Checks if there is already this PurchaseCode in the array

        for (uint256 i = 0; i < PurchaseID.length; i++) {
            if(keccak256(abi.encodePacked((PurchaseCode))) == keccak256(abi.encodePacked((PurchaseID[i]))))
                revert('This PurchaseCode is already present, try again');
        }

        //==========================================================================//

        // Adds new PurchaseInfo, adds the purchaseID to PurchaseList and maps this value with the new Purchase //

        PurchaseInfo memory newPurchase = PurchaseInfo(buyerAddress, stockID , stockSize, PaymentDate, TokenExpiration, false);
        PurchaseID.push(PurchaseCode);
        Payments[PurchaseCode] = newPurchase;

        //==========================================================================//

        return true;     
    }

    function getPayment(string memory PurchaseCode) public view returns (address, string memory, uint256 , uint256, uint256){
        bool isInPayments = false;
        //bytes32 PurchaseHash = sha256(abi.encodePacked(PurchaseCode));

        // Checks if PurchaseCode is valid
        
        for (uint256 i = 0; i < PurchaseID.length; i++) {
            if(keccak256(abi.encodePacked((PurchaseCode))) == keccak256(abi.encodePacked((PurchaseID[i])))){ 
                isInPayments = true;
            }
        }
        if(!isInPayments)
            revert('There is no such PurchaseCode in here');


        //--------------------------------------------------------------------------//

        

        return (Payments[PurchaseCode].BuyerAddress, Payments[PurchaseCode].stockId, Payments[PurchaseCode].stockSize, Payments[PurchaseCode].StartDate , Payments[PurchaseCode].EndDate);

    }

    
    
    
    
    


}

    