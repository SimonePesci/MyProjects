async function checkEMRIntegrity() {
    const emrIndexValue = '0'; // Imposta l'indice EMR a '0' direttamente nel codice
    const response = await fetch('/check-integrity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ EMR_index_value: emrIndexValue })
    });
    const data = await response.json();
    document.getElementById('integrityResult').innerText = 'EMR Integrity is ' + (data.valid ? 'Valid' : 'Invalid');
}


async function add_New_EMR() {
    // Ottieni i valori da tutti i campi di input necessari
    const userType = document.getElementById('userType').value;
    const tokenID = document.getElementById('tokenID').value;
    const hospitalID = document.getElementById('hospitalID').value;
    const newValue = document.getElementById('newValue').value;

    // Verifica che tutti i campi siano stati compilati
    if (!userType || !tokenID || !hospitalID || !newValue) {
        document.getElementById('addNodeResult').innerText = 'Please fill in all fields.';
        return;
    }

    // Effettua la richiesta al server
    const response = await fetch('/add-new-EMR', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID, newValue }) 
    });

    const data = await response.json();

    // Mostra il risultato 
    if (data.success) {
        let resultMessage = `${data.message}<br>`;
        if (data.newEMRValue) {
            resultMessage += `New EMR Value: ${data.newEMRValue}<br>`;
        }
        if (data.newRoot) {
            resultMessage += `New Root: ${data.newRoot}<br>`;
        }
        document.getElementById('addNodeResult').innerHTML = resultMessage;
    } else {
        document.getElementById('addNodeResult').innerText = 'Failed to add new EMR: ' + (data.message || 'Unknown error');
    }
}


async function assignPermission() {
    const userType = document.getElementById('assignUserType').value;
    const tokenID = document.getElementById('assignTokenID').value;
    const hospitalID = document.getElementById('assignHospitalID').value;
    const permission = document.getElementById('assignPermission').value; 

    if (!userType || !tokenID || !hospitalID) {
        document.getElementById('assignPermissionResult').innerText = 'Please fill in all fields.';
        return;
    }

    const response = await fetch('/assign-permission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID, permission })
    });
    const data = await response.json();
    if (data.success) {
        document.getElementById('assignPermissionResult').innerText = 'Permission assigned successfully.';
    } else {
        document.getElementById('assignPermissionResult').innerText = 'Failed to assign permission: Token might not exist'; //+ (data.message || 'Unknown error');
    }
}

async function verifyPermission() {
    const userType = document.getElementById('verifyUserType').value;
    const tokenID = document.getElementById('verifyTokenID').value;
    const hospitalID = document.getElementById('verifyHospitalID').value;

    if (!userType || !tokenID || !hospitalID ) {
        document.getElementById('verifyPermissionResult').innerText = 'Please fill in all fields.';
        return;
    }

    const response = await fetch('/verify-permission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID})
    });
    const data = await response.json();
    if (data.success) {
        // Qui costruiamo direttamente la stringa basandoci su hospitalID e il permesso restituito
        const permissionsText = `Ospedale ${hospitalID} -> Permesso ${data.permission}`; 
        document.getElementById('verifyPermissionResult').innerHTML = `
        <p>${data.message}</p>
        <p>Hospital: ${hospitalID} </p>
        <p>Permission: ${data.permission} </p>
        `;
    } else {
        document.getElementById('verifyPermissionResult').innerText = 'Failed to verify permission: Token might not exist'
    }
}


async function updateEMR() {
    const userType = document.getElementById('updateUserType').value;
    const tokenID = document.getElementById('updateTokenID').value;
    const hospitalID = document.getElementById('updateHospitalID').value;
    const EMR_To_Update = document.getElementById('emrToUpdate').value;
    const new_EMR_Value = document.getElementById('newEmrValue').value;

    if (!userType || !tokenID || !hospitalID || !EMR_To_Update || !new_EMR_Value) {
        document.getElementById('updateEmrResult').innerText = 'Please fill in all fields.';
        return;
    }

    const response = await fetch('/update-emr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID, EMR_To_Update, new_EMR_Value })
    });
    const data = await response.json();
    if (data.success) {
        document.getElementById('updateEmrResult').innerHTML = `
            <p>${data.message}</p>
            <p>EMR Index: ${data.updateInfo.EMRIndexValue}</p>
            <p>New EMR Value: ${data.updateInfo.newEMRValue}</p>
            <p>New Root: ${data.updateInfo.newRoot}</p>
        `;
    } else {
        document.getElementById('updateEmrResult').innerText = 'Failed to update EMR: ' + data.message;
    }
}





async function createUser() {
    const userType = document.getElementById('userType').value.toLowerCase(); // Convert to lower case
    const address = document.getElementById('ethereumAddress').value;
    const name = document.getElementById('userName').value;
    const surname = document.getElementById('userSurname').value;
    const taxCode = document.getElementById('userTaxCode').value;

    if (!userType || !address || !name || !surname || !taxCode) {
        document.getElementById('createUserResult').innerText = 'Please fill in all fields.';
        return;
    }

    const response = await fetch('/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userType: document.getElementById('userType').value.toLowerCase(), // Ensure case is correct
            address: document.getElementById('ethereumAddress').value,
            name: document.getElementById('userName').value,
            surname: document.getElementById('userSurname').value,
            taxCode: document.getElementById('userTaxCode').value
        })
    });
    
    const data = await response.json();
    if (data.success && data.userDetails) {
        // Construct the HTML with user details
        document.getElementById('createUserResult').innerHTML = `
            User creation status: Success<br>
            Address: ${data.userDetails.address}<br>
            TokenID: ${data.userDetails.tokenID}<br>
            Name: ${data.userDetails.name}<br>
            Surname: ${data.userDetails.surname}<br>
            TaxCode: ${data.userDetails.taxCode}
        `;
    } else {
        // Display error message
        document.getElementById('createUserResult').innerText = 'Failed to create user: ' + (data.message || 'Unknown error');
    }
}


async function accessradiologyRoom() {
    // These lines get the input values from the form fields for the radiology Room
    const userType = document.getElementById('radiologyUserType').value;
    const tokenID = document.getElementById('radiologyTokenID').value;
    const hospitalID = document.getElementById('radiologyHospitalID').value;

    // This sends the request to your backend with the values obtained from the form
    const response = await fetch('/access-radiology-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID }) // Sends the collected data
    });
    const data = await response.json();

    // These lines display the result of the attempt to access the radiology Room
    if (data.success) {
        document.getElementById('radiologyRoomAccessResult').innerHTML = `
        <p>${data.message}</p>
        `;
        
       // alert('Access granted to Radiology Room.');
    } else {
        document.getElementById('radiologyRoomAccessResult').innerHTML = `
        <p>Access Denied</p>
        `;
        //alert('Failed to access Radiology Room: ' + (data.message || 'Unknown error'));
    }
}

async function accesscardiologyRoom() {
    // These lines get the input values from the form fields for the cardiology Room
    const userType = document.getElementById('cardiologyUserType').value;
    const tokenID = document.getElementById('cardiologyTokenID').value;
    const hospitalID = document.getElementById('cardiologyHospitalID').value;

    // This sends the request to your backend with the values obtained from the form
    const response = await fetch('/access-cardiology-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType, tokenID, hospitalID }) // Sends the collected data
    });
    const data = await response.json();

    // These lines display the result of the attempt to access the cardiology Room
    if (data.success) {
        document.getElementById('cardiologyRoomAccessResult').innerHTML = `
        <p>${data.message}</p>
        `;
        //alert('Access granted to Cardiology Room.');
    } else {
        document.getElementById('cardiologyRoomAccessResult').innerHTML = `
        <p>Access Denied</p>
        `;
        //alert('Failed to access Cardiology Room: ' + (data.message || 'Unknown error'));
    }
}




function login(userType) {
    var username, password;

    if (userType === 'admin') {
        // Get admin credentials from input fields
        username = document.getElementById('adminUsername').value;
        password = document.getElementById('adminPassword').value;
        // Placeholder for admin authentication, replace with real authentication
        if (username === "" && password === "") {
            // Hide login page and show admin control room
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainPage').style.display = 'block';
            // Additional admin-specific initializations can be added here
        } else {
            alert('Incorrect admin credentials'); // Improve error handling in real application
        }
    } else {
        // Get user credentials from input fields
        username = document.getElementById('userUsername').value;
        password = document.getElementById('userPassword').value;
        // Placeholder for user authentication, replace with real authentication
        if (username === "" && password === "") {
            // Hide login page and show user specific controls
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainPage2').style.display = 'block';
            // Additional user-specific initializations can be added here
        } else {
            alert('Incorrect user credentials'); // Improve error handling in real application
        }
    }
}


function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

