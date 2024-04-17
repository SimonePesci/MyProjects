const { Web3 } = require('web3');
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const MyMerkleTree = require('./build/contracts/MerkleTree.json')
const HospitalToken = require('./build/contracts/HospitalToken.json')
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});



app.use(express.json()); // for parsing application/json
app.use(express.static('public')); // Serve static files from 'public' directory


async function checkIntegrity(req, res) {
    const EMR_index_value = req.body.EMR_index_value; 
    
}


app.post('/access-radiology-room', async (req, res) => {
  try {
      const { userType, tokenID, hospitalID } = req.body; 

      let permissionGranted = await checkPermission(userType, tokenID, hospitalID, 0x10);

      console.log('The permission check result is:\n ' , permissionGranted);

      if (permissionGranted) {
          res.json({ success: true, message: "Access granted to Radiology Room" });
      } else {
          throw new Error("Access denied to Radiology Room");
      }
  } catch (error) {
      console.error('Error accessing radiology Room:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});

app.post('/access-cardiology-room', async (req, res) => {
  try {
      const { userType, tokenID, hospitalID } = req.body; 

      let permissionGranted = await checkPermission(userType, tokenID, hospitalID, 0x20);

      console.log('---------------------\nThe permission check result is:\n ' , permissionGranted);


      if (permissionGranted) {
          res.json({ success: true, message: "Access granted to Cardiology Room" });
      } else {
          throw new Error("Access denied to Cardiology Room");
      }
  } catch (error) {
      console.error('Error accessing Cardiology Room:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});



app.post('/check-integrity', async (req, res) => {
    const { EMR_index_value } = req.body;
    const isValid = await checkIntegrity(EMR_index_value);
    res.json({ valid: isValid });
});


app.post('/create-user', async (req, res) => {
  try {
      
      const { userType, address, name, surname, taxCode } = req.body;

     
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
      
      const { userType, tokenID, hospitalID, newValue } = req.body;

      // Calls add_New_EMR to get results
      const addResults = await add_New_EMR(userType, tokenID, hospitalID, newValue);
      
      // Set a message according to result
      let finalMessage = "New EMR added successfully";
      if(addResults.permissionGranted == false) { 
          finalMessage = "Permissions not granted"; 
      }

      // Sends to client
      res.json({ 
          success: true, 
          message: finalMessage,
          newEMRValue: addResults.newEMRValue, 
          newRoot: addResults.newRoot ? addResults.newRoot.toString() : null // Converti in stringa se è un BigInt

      });
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

app.post('/verify-permission', async (req, res) => {
  try {
      
      const { userType, tokenID, hospitalID } = req.body;

      // Returns permissions set for an hospital
      const permissionSet = await getHospitalPermissions(userType, tokenID, hospitalID);

      
      // Sends to client
      res.json({ success: true,
                   message: "Permissions retrieved successfully." ,
                   permission: permissionSet
                   });
    
  } catch (error) {
      console.error('Error verifying permission:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }

});



app.post('/update-emr', async (req, res) => {
  try {
      
      const { userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value } = req.body;

      // Returns functions results
      const updateResults = await updateEMR(userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value);
      
      let finalMessage = "EMR updated successfully";
      if(updateResults.permissionGranted == false ){ finalMessage = "Permissions not granted"}
      
      // Sends to client
      res.json({ 
          success: true, 
          message: finalMessage,
          updateInfo: updateResults
      });
  } catch (error) {
      console.error('Error updating EMR:', error);
      res.status(500).json({ success: false, message: error.toString() });
  }
});



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




async function checkIntegrity(EMR_index_value) {     // This function creates a merkleTree based on the values in the JSON file and verifies leaf n°*IndexValue* using its proof against the smart-contract ==> returns true or false

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
  console.log("Root:\n" , EMR_Tree.getHexRoot());

	let leafTarget_Proof = EMR_Tree.getHexProof(leafNodes[EMR_index_value]); // Retrieve proof for leaf of index EMR_index_value
	console.log("leafTarget_Proof:\n" , leafTarget_Proof);


    
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


async function updateEMR(userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value) {
  console.log('Start function\n');
  const web3 = new Web3('HTTP://127.0.0.1:7545');
  const id = await web3.eth.net.getId();
  const deployedNetwork_MerkleTree = MyMerkleTree.networks[id];
  const deployedNetwork_HospitalToken = HospitalToken.networks[id];

  const contract = new web3.eth.Contract(
      MyMerkleTree.abi,
      deployedNetwork_MerkleTree.address,
      { from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F' }
  );

  const contract2 = new web3.eth.Contract(
      HospitalToken.abi,
      deployedNetwork_HospitalToken.address,
      { from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F' }
  );

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
      if (userType == 'doctor') {
          user = 1;
      } else if (userType == 'patient') {
          user = 2;
      } else if (userType == 'assistant') {
          user = 3;
      }

      console.log("Starting permissions");
      const permissionGranted = await contract2.methods.checkPermission(user, tokenID, hospitalID, '0x08').call();
      const tokenAddress = await contract2.methods.getAddressForToken(user, tokenID).call();

      console.log("Is permission granted?", permissionGranted);

      if (permissionGranted) {
          updateResponse.permissionGranted = true;

          let data = fs.readFileSync('EMRValues.json');
          let json_Array = JSON.parse(data);
          let EMR_Index_Value = json_Array.EMRValues.indexOf(EMR_To_Update);

          if (EMR_Index_Value === -1) {
              console.log('No such EMR found, function stopped');
              return updateResponse;
          }

          console.log('EMR found at index:', EMR_Index_Value);

          json_Array.EMRValues[EMR_Index_Value] = new_EMR_Value;
          fs.writeFileSync('EMRValues.json', JSON.stringify(json_Array, null, 2));
          console.log("EMR Updated");

          let EMRValuesArray = json_Array.EMRValues;
          let leafNodes = EMRValuesArray.map(EMR => keccak256(EMR));
          let EMR_Tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
          let newRoot = EMR_Tree.getHexRoot();

          console.log("New Root:", newRoot);

          let info = await contract.methods.updateMerkleRoot(newRoot).send({ from: tokenAddress });
          console.log("Info about root update", info);

          updateResponse.EMRIndexValue = EMR_Index_Value;
          updateResponse.newEMRValue = new_EMR_Value;
          updateResponse.newRoot = newRoot;
      } else {
          console.log('Permission not granted');
      }
      
      console.log('\n\nEMR Correctly Updated');
      return updateResponse;

  } catch (error) {
      console.error('Error:', error);
      updateResponse.errorMessage = error.toString();
      return updateResponse;
  }
}



async function add_New_EMR(userType, tokenID, hospitalID, newValue) {
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


    let addResponse = {
        permissionGranted: false,
        newEMRValue: null,
        newRoot: null,
        transactionInfo: null,
        errorMessage: null
    };

    console.log('End initializing functions\n');

    try {
        let user;
        if (userType == 'doctor') {
            user = 1;
        } else if (userType == 'patient') {
            user = 2;
        } else if (userType == 'assistant') {
            user = 3;
        }

        console.log("Starting permissions");
        const permissionGranted = await contract2.methods.checkPermission(user, tokenID, hospitalID, '0x08').call(); // Verify user has permission to add a new EMR
        console.log("Is permission granted?", permissionGranted);

        // Recupera l'indirizzo del proprietario del token
        const tokenAddress = await contract2.methods.getAddressForToken(user, tokenID).call();
        const integrity = await checkIntegrity('0');
        console.log("Is integro?", integrity);

        if (permissionGranted & integrity) {
            addResponse.permissionGranted = true;

            // Update the JSON with the new EMR value
            updateEMRValues(newValue);

            // Retrieve EMR values stored
            let EMRValuesArray = getEMRValues();

            // Create the tree based on the new values to get the new Root Value
            let leafNodes = EMRValuesArray.map(EMR => keccak256(EMR)); // EMR's hashes Array (Buffer)
            let EMR_Tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true }); // Create MerkleTree on these leaf nodes
            console.log("New leaf Nodes:\n", leafNodes);

            // Get the new Root to update the Root stored in the contract
            let newRoot = EMR_Tree.getHexRoot();
            console.log("New Root: \n", newRoot);

            // Contract call to Update the Root
            const data = await contract.methods.updateMerkleRoot(newRoot).send({ from: tokenAddress });
            console.log("Info about root update", data);

            addResponse.newEMRValue = newValue;
            addResponse.newRoot = newRoot;
            addResponse.transactionInfo = data;
        }

        console.log('\n\nNew EMR Added Successfully');
        return addResponse;
    } catch (error) {
        console.error('Error:', error);
        addResponse.errorMessage = error.toString();
        return addResponse;
    }
}




async function createUser(userType , address , Name , Surname , TaxCode){ 

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
          gas: 5000000 
        });
        console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(1 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + '(Doctor) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    } else if(userType == "assistant"){
      let data = await contract.methods.mintAssistant(address , Name , Surname , TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 
      });
      console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(3 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + '(Assistant) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    } else if(userType == "patient"){
      let data = await contract.methods.mintPatient(address , Name , Surname , TaxCode).send({
        from: '0x12b405F1a1a4A11479E670E0af39312E771Ff38F',
        gas: 5000000 
      });
      console.log('this the receipt', data)
      let data2 = await contract.methods.getLastMintedUser(2 , address).call();
      console.log('This is the getUser result:\nAddress:' , data2[0] + ' \nTokenID: ' + data2[1] + ' (Patient) \nName: ' + data2[2] + ' \nSurname: ' + data2[3] + ' \nTaxCode: ' + data2[4]);
        return data2;
    }

}


async function assignPermission(userType, tokenID, hospitalID, permission){ 

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
      gas: 5000000 
    });
    console.log("Access Tx", setAccess);
    let hasPermission = await contract.methods.checkPermission( user , tokenID , hospitalID , permission).call();
    console.log("Has the permission?", hasPermission);

}


async function checkPermission(userType, tokenID, hospitalID, permission){ 

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

    let hasPermission = await contract.methods.checkPermission( user , tokenID , hospitalID , permission).call();
    console.log("Has the permission?", hasPermission);

    return hasPermission;

}


async function getHospitalPermissions(userType, tokenID, hospitalID) {
  
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
  // Call smart-contract method to retreive token's permissions related to specified hospital
  const permissions = await contract.methods.getHospitalPermissions(user, tokenID, hospitalID).call();
  
  // Print permissions on console
  console.log("Permissions for token:", permissions);

  return permissions; // Ritorna i permessi
}


module.exports.add_New_EMR = add_New_EMR;
module.exports.checkIntegrity = checkIntegrity;
module.exports.CreateMerkleTree = CreateMerkleTree;
module.exports.updateEMR = updateEMR;
module.exports.createUser = createUser;
module.exports.assignPermission = assignPermission;
module.exports.getHospitalPermissions = getHospitalPermissions;
module.exports.checkPermission = checkPermission;



