const { Web3 } = require('web3');
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const MyMerkleTree = require('./build/contracts/MerkleTree.json')
const HospitalToken = require('./build/contracts/HospitalToken.json')
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001; // You can choose any port

app.use(express.json()); // for parsing application/json

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



app.use(express.json()); // for parsing application/json
app.use(express.static('public2')); // Serve your static files from 'public' directory

// Your checkIntegrity function here, slightly modified to fit Express handler
async function checkIntegrity(req, res) {
    const EMR_index_value = req.body.EMR_index_value; // Now getting from request
    //... rest of your function, but send response back using res.json(...)
}



// Endpoint to call your function
app.post('/check-integrity', async (req, res) => {
    const { EMR_index_value } = req.body;
    const isValid = await checkIntegrity(EMR_index_value);
    res.json({ valid: isValid });
});

// Assuming you have Express and other necessary setups done
app.post('/create-user', async (req, res) => {
  try {
      // Extract user details from request body
      const { userType, address, name, surname, taxCode } = req.body;

      // Assuming createUser returns an array [address, tokenID, name, surname, taxCode]
      const userDetailsArray = await createUser(userType, address, name, surname, taxCode);

      // Convert array to object for easier usage in frontend
      const userDetails = {
          address: userDetailsArray[0],
          tokenID: userDetailsArray[1].toString(),       
          name: userDetailsArray[2],
          surname: userDetailsArray[3],
          taxCode: userDetailsArray[4]
      };

      // Respond with user details
      res.json({ success: true, userDetails });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});

app.post('/add-new-EMR', async (req, res) => {
  try {
      const { newValue } = req.body;

      let result = await add_New_EMR(newValue);
      res.json({ success: true, result }); 

  } catch (error) {
      console.error('Error adding new EMR:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});


app.post('/assign-permission', async (req, res) => {
  try {
      const { userType, tokenID, hospitalID, permission } = req.body;
      

      const result = await assignPermission(userType, tokenID, hospitalID, permission);

      res.json({ success: true, message: "Permission assigned successfully" });
  } catch (error) {
      console.error('Error assigning permission:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});

app.post('/update-emr', async (req, res) => {
  try {
      // Extract data from request body
      const { userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value } = req.body;

      // Call your function and get results
      const updateResults = await updateEMR(userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value);

      // Send results back to client
      res.json({ 
          success: true, 
          message: "EMR updated successfully",
          updateInfo: updateResults // Include additional data as needed
      });
  } catch (error) {
      console.error('Error updating EMR:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});








let EMRValues = [
    "0X5B38DA6A701C568545DCFCB03FCB875F56BEDDC4",
    "0X5A641E5FB72A2FD9137312E7694D42996D689D99",
    "0XDCAB482177A592E424D1C8318A464FC922E8DE40",
    "0X6E21D37E07A6F7E53C7ACE372CEC63D4AE4B6BD0",
    "0X09BAAB19FC77C19898140DADD30C4685C597620B",
    "0XCC4C29997177253376528C05D3DF91CF2D69061A",
    "0xdD870fA1b7C4700F2BD7f44238821C26f7392147"
  ];

const owner = "0x12b405F1a1a4A11479E670E0af39312E771Ff38F";

let web3;
let id;
let deployedNetwork;
let deployedNetwork_HospitalToken;
let contract;
let contract2;

let leafNodesHashes 
let EMR_Tree

let aLeaf 

let getEMR_TreeProof
let getEMR_Root

// ------------------------------------------------------------- //

function createJSONFile() {
    let data = JSON.stringify({ EMRValues }, null, 2);
    fs.writeFileSync('EMRValues.json', data);
    console.log('File created with initial EMR hashes');
}

//createJSONFile();


function updateEMRValues(newValue) {
    let data = JSON.parse(fs.readFileSync('EMRValues.json'));
    data.EMRValues.push(newValue);
    let updatedData = JSON.stringify(data, null, 2);
    fs.writeFileSync('EMRValues.json', updatedData);
    console.log('EMR hash added');
}

// Example usage
//updateEMRValues("0xNEWEMRHASH123456");


function getEMRValues() {
    let rawData = fs.readFileSync('EMRValues.json');
    let data = JSON.parse(rawData);
    return data.EMRValues;
}

// Example usage
//let EMRValuesArray = getEMRValues();
//console.log("Array returned with success:" , EMRValuesArray);



// ---------------------------------- //

function CreateMerkleTree(){

	let leafTestwithJSON = getEMRValues();
	//console.log("JsonArray:\n", leafTestwithJSON) Check if array is returned
	leafNodesHashes = EMRValues.map( EMR => keccak256(EMR) );
	//leafTestwithJSON = EMRValues.map( EMR => keccak256(EMR) );
	EMR_Tree = new MerkleTree(leafNodesHashes, keccak256 , {sortPairs: true});

	aLeaf = leafNodesHashes[1];
	leaf0Proof = EMR_Tree.getHexProof[leafNodesHashes[0]]

	getEMR_TreeProof = EMR_Tree.getHexProof(aLeaf);
	getEMR_Root = EMR_Tree.getHexRoot();


	console.log(aLeaf);
	console.log(getEMR_Root);
	console.log(getEMR_TreeProof);
	console.log("This the tree:\n", EMR_Tree.toString() );
	


}






async function checkIntegrity(EMR_index_value) {     // This function creates a merkleTree based on the values in the JSON file and verifies leaf n°0 using its proof against the smart-contract ==> returns true or false

	web3 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3.eth.net.getId();
    deployedNetwork = MyMerkleTree.networks[id];
    contract = new web3.eth.Contract(
      MyMerkleTree.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

  let isValid;

	// Retrieve EMR values stored
	let EMRValuesArray = getEMRValues();
	
	let leafNodes = EMRValuesArray.map( EMR => keccak256(EMR) ); // EMR's hashes Array (Buffer)
	EMR_Tree = new MerkleTree(leafNodes, keccak256 , {sortPairs: true}); // Create MerkleTree on these leaf nodes
	console.log("leafNodes:\n" , leafNodes);

	let leafTarget_Proof = EMR_Tree.getHexProof(leafNodes[EMR_index_value]); // Retrieve proof for leaf of index EMR_index_value
	console.log("leafTarget_Proof:\n" , leafTarget_Proof);


    // Now you can interact with the contract
    // verify a leaf target passing leaf[EMR_index_value] and leafTarget_Proof
    try {
        const data = await contract.methods.verify( leafNodes[EMR_index_value] , leafTarget_Proof ).call();
        isValid = data;
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }


    return isValid;
}


async function updateEMR(userType, tokenID, hospitalID, EMR_To_Update , new_EMR_Value){

  console.log('Start function\n');
  web3 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3.eth.net.getId();
    deployedNetwork_MerkleTree = MyMerkleTree.networks[id];
    deployedNetwork_HospitalToken = HospitalToken.networks[id];
    contract = new web3.eth.Contract(
      MyMerkleTree.abi,
      deployedNetwork_MerkleTree.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      })

    contract2 = new web3.eth.Contract(
      HospitalToken.abi,
      deployedNetwork_HospitalToken.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      });

    let updateResponse = {
        permissionGranted: false,
        EMRIndexValue: null,
        newEMRValue: null,
        newRoot: null,
        transactionInfo: null,
        errorMessage: null
    };

    console.log('End initializing functions\n');

  	try {

      let user;
      if(userType == 'doctor') { user = 1 } else if (userType == 'patient') { user = 2 } else if(userType == 'assistant') { user = 3 }

      console.log("Starting permissions");
      const permissionGranted = await contract2.methods.checkPermission(user , tokenID, hospitalID , '0x08').call(); // Verify user has permission to update the EMR of the User
      console.log("Is permission granted? " , permissionGranted);
      
      if(permissionGranted){ // If permission is granted --> then verify the integrity of the EMRValues by calling the Smart-Contract
      
        updateResponse.permissionGranted = true;

        let EMR_Index_Value;
        let data = fs.readFileSync('EMRValues.json');
        let obj = JSON.parse(data);
        data = JSON.stringify(obj , null , 2);
        readEMR_JSON = fs.readFileSync('EMRValues.json');
        let json_Array = JSON.parse(readEMR_JSON);
        console.log('json_Array is: ', json_Array);
        console.log('json_Array is: ', json_Array.EMRValues);

        EMR_Index_Value = -1;
        for (let i = 0; i < json_Array.EMRValues.length; i++) {
          if (json_Array.EMRValues[i] === EMR_To_Update) {
              EMR_Index_Value = i;
              break; // Exit the loop since we found the item
          }
        }
        
        if (EMR_Index_Value === -1) {
        
          console.log('No such EMR found, function stopped');
            return updateResponse;
           
        } else {
            // Proceed with the code as EMR was found
            console.log('EMR found at index:', EMR_Index_Value);
            
            
        }

        if( await checkIntegrity(EMR_Index_Value) ){ // If the integrity check is verified, we update the JSON, create a merkle tree on it and update the new Root
          
          // Update the JSON
          json_Array.EMRValues[EMR_Index_Value] = new_EMR_Value;
          let newFile = JSON.stringify(json_Array , null, 2);
          fs.writeFileSync('EMRValues.json', newFile);
          console.log("EMR Updated");

          // Create the merkle tree

          // Retrieve EMR values stored
          let EMRValuesArray = getEMRValues();
          
          let leafNodes = EMRValuesArray.map( EMR => keccak256(EMR) ); // EMR's hashes Array (Buffer)
          EMR_Tree = new MerkleTree(leafNodes, keccak256 , {sortPairs: true}); // Create MerkleTree on these leaf nodes
          console.log("New leaf Nodes:\n" , leafNodes);

          let newRoot = EMR_Tree.getHexRoot(); // Store the new Root

          console.log( "New Root: \n", newRoot );

          // Contract call to Update the Root
          try{
          let info = await contract.methods.updateMerkleRoot(newRoot).send();
          console.log("Info about root update" , info);
          updateResponse.EMRIndexValue = EMR_Index_Value;
          updateResponse.newEMRValue = new_EMR_Value;
          console.log('this the new EMR VALUE \n', updateResponse.newEMRValue);
          updateResponse.newRoot = newRoot;
          } catch {
            console.error('Error:', error);
          }

          

        } // End of function

      } //End of permission granted
      console.log('\n\nEMR Correctly Updated'); 
      return updateResponse; 
      }
    catch (error) {
      console.error('Error:', error);
      updateResponse.errorMessage = error.toString();
    }


/*
    let EMR_Index_Value;
    let data = fs.readFileSync('EMRValues.json');
    let obj = JSON.parse(data);
    data = JSON.stringify(obj , null , 2);
    readEMR_JSON = fs.readFileSync('EMRValues.json');
    let json_Array = JSON.parse(readEMR_JSON);
    for (let i = 0; i < json_Array.length; i++) {
        
        if(json_Array[i] == EMR_To_Update){
          EMR_Index_Value = i;
        }
            
    }

    if( await checkIntegrity(EMR_Index_Value) ){
      json_Array[i] = new_EMR_Value;
      let newFile = JSON.stringify(json_Array , null, 2);
    }


  */



}


async function add_New_EMR(newValue){

	web3 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3.eth.net.getId();
    deployedNetwork = MyMerkleTree.networks[id];
    contract = new web3.eth.Contract(
      MyMerkleTree.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

	
	updateEMRValues(newValue);

	// Retrieve EMR values stored
	let EMRValuesArray = getEMRValues();
	
	// Create the tree based on the new value to get the new Root Value
	let leafNodes = EMRValuesArray.map( EMR => keccak256(EMR) ); // EmR's hashes Array (Buffer)
	EMR_Tree = new MerkleTree(leafNodes, keccak256 , {sortPairs: true}); // Create MerkleTree on these leaf nodes
	console.log("leafNodes:\n" , leafNodes);

	// Get the new Root to update the Root stored in the contract
	let newRoot = EMR_Tree.getHexRoot();


	try {
		const data = await contract.methods.updateMerkleRoot(newRoot).send();
		console.log(data);  
		}
	catch (error) {
		console.error('Error:', error);
	}

}




async function createUser1(){ //userType, address , Name, Surname, TaxCode

	web3_2 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3_2.eth.net.getId();
    deployedNetwork = HospitalToken.networks[id];
    contract = new web3_2.eth.Contract(
      HospitalToken.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

    let userType = "doctor";

    console.log(userType);
  
    if(userType == "doctor"){
      let data = await contract.methods.mintDoctor('0x186Df72607314C629297e952cC87212491ECC096' , 'Franco' , 'Scotti' , 'FS99').send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 // Adjust the gas limit here
      });
      console.log(data);
    } else if(userType == "assistant"){
      let data = await contract.methods.mintAssistant(address, Name, Surname, TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 // Adjust the gas limit here
      });
      console.log(data);
    } else if(userType == "patient"){
      let data = await contract.methods.mintPatient(address, Name, Surname, TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 // Adjust the gas limit here
      });
    }

}



async function createUser(userType , address , Name , Surname , TaxCode){ //userType, address , Name, Surname, TaxCode

	web3_2 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3_2.eth.net.getId();
    deployedNetwork = HospitalToken.networks[id];
    contract = new web3_2.eth.Contract(
      HospitalToken.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

    console.log(userType);
  
    if(userType == "doctor"){
      let data = await contract.methods.mintDoctor(address , Name , Surname , TaxCode).send({
          from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
          gas: 5000000 // Adjust the gas limit here
        });
        console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(1 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + '(Doctor) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    } else if(userType == "assistant"){
      let data = await contract.methods.mintAssistant(address , Name , Surname , TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 // Adjust the gas limit here
      });
      console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(3 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + '(Assistant) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    } else if(userType == "patient"){
      let data = await contract.methods.mintPatient(address , Name , Surname , TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 // Adjust the gas limit here
      });
      console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(2 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + ' (Patient) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    }

}


async function assignPermission(userType, tokenID, hospitalID, permission){ //userType, address , Name, Surname, TaxCode

	web3_2 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3_2.eth.net.getId();
    deployedNetwork = HospitalToken.networks[id];
    contract = new web3_2.eth.Contract(
      HospitalToken.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

  let user;
  if(userType == 'doctor') { user = 1 } else if (userType == 'patient') { user = 2 } else if(userType == 'assistant') { user = 3 }


    let setAccess = await contract.methods.setHospitalAccess( user , tokenID , hospitalID , permission).send({
      from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
      gas: 5000000 // Adjust the gas limit here
    });
    console.log("Access Tx", setAccess);
    let hasPermission = await contract.methods.checkPermission( user , tokenID , hospitalID , permission).call();
    console.log("Has the permission?", hasPermission);

}


async function assignPermission(userType, tokenID, hospitalID, permission){ //userType, address , Name, Surname, TaxCode

	web3_2 = new Web3('HTTP://127.0.0.1:7545');
    id = await web3_2.eth.net.getId();
    deployedNetwork = HospitalToken.networks[id];
    contract = new web3_2.eth.Contract(
      HospitalToken.abi,
      deployedNetwork.address,  {
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F'
      }
    );

  let user;
  if(userType == 'doctor') { user = 1 } else if (userType == 'patient') { user = 2 } else if(userType == 'assistant') { user = 3 }


    let setAccess = await contract.methods.setHospitalAccess( user , tokenID , hospitalID , permission).send({
      from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
      gas: 5000000 // Adjust the gas limit here
    });
    console.log("Access Tx", setAccess);
    let hasPermission = await contract.methods.checkPermission( user , tokenID , hospitalID , permission).call();
    console.log("Has the permission?", hasPermission);

}


module.exports.add_New_EMR = add_New_EMR;
module.exports.checkIntegrity = checkIntegrity;
module.exports.CreateMerkleTree = CreateMerkleTree;
module.exports.updateEMR = updateEMR;
module.exports.createUser = createUser;
module.exports.assignPermission = assignPermission;


