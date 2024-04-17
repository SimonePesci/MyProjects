async function checkEMRIntegrity() {
    const emrIndexValue = document.getElementById('emrIndexValue').value;
    if (!emrIndexValue) {
        document.getElementById('integrityResult').innerText = 'Please enter a valid EMR index.';
        return;
    }
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
    const newValue = document.getElementById('newValue').value;
    if (!newValue) {
        document.getElementById('addNodeResult').innerText = 'Please enter a value.';
        return;
    }
    const response = await fetch('/add-new-EMR', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newValue }) // Ensure this matches the server's expected format
    });
    const data = await response.json();
    if (data.success) {
        document.getElementById('addNodeResult').innerText = 'New EMR added successfully.';
    } else {
        document.getElementById('addNodeResult').innerText = 'Failed to add new EMR: ' + (data.message || 'Unknown error');
    }
}

async function assignPermission() {
    const userType = document.getElementById('assignUserType').value;
    const tokenID = document.getElementById('assignTokenID').value;
    const hospitalID = document.getElementById('assignHospitalID').value;
    const permission = document.getElementById('assignPermission').value; // Assuming '0x08' is your permission code

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
        document.getElementById('assignPermissionResult').innerText = 'Failed to assign permission: ' + (data.message || 'Unknown error');
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



function login() {
    // Example login function (in real application, handle authentication securely)
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if (username === "" && password === "") { // Replace with real authentication
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
    } else {
        alert('Incorrect credentials'); // Improve error handling in real application
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

