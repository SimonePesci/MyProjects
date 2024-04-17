// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract HospitalToken is ERC1155, Ownable {
    using Strings for uint256;

    uint256 constant Doctor = 1;
    uint256 constant Patient = 2;
    uint256 constant Assistant = 3;

    // Access rights within each Hospital
    struct HospitalAccess {
        uint256 hospitalId;
        bytes accessRights;
    }
    //mapping(uint256 => HospitalAccess[]) public tokenHospitalAccessRights;  
    mapping(uint256 => mapping(uint256 => HospitalAccess[])) public tokenHospitalAccessRights;

    // Data associated to every person 
    struct PersonalData {
        string name;
        string surname;
        string taxCode;
    }
    mapping(uint256 => mapping(uint256 => PersonalData)) public tokenPersonalData;  // userType , tokenID -> personalData
    mapping(uint256 => mapping(uint256 => address)) private addressTokenPossession; // userType , tokenID -> address

    mapping(address => mapping(uint256 => uint256)) private tokenPossession; //  indirizzo , userType -> tokenID


    //mapping(uint256 => mapping(uint256 => string)) private tokenMetadata2;

    uint256 private tokenIdDoctor = 0;
    uint256 private tokenIdPatient = 0;
    uint256 private tokenIdAssistant = 0;

    // Define hospital identifiers as constants
    uint256 private constant H1 = 1;
    uint256 private constant H2 = 2;
    uint256 private constant H3 = 3;
    uint256 private constant H4 = 4;

    constructor() ERC1155("https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/{id}.json") Ownable(0x12b405F1a1a4A11479E670E0af39312E771Ff38F) {
        // The owner is set as the deployer of the contract

    }

    // Define constants for each permission bit
    uint8 constant PERMISSION_READ_HISTORY = 0x01;
    uint8 constant PERMISSION_READ_PRESCRIPTIONS = 0x02;
    uint8 constant PERMISSION_READ_TEST_RESULTS = 0x04;
    uint8 constant PERMISSION_UPDATE_EMR = 0x08;  // Example new permission bit for updating EMR
    uint8 constant PERMISSION_RADIOLOGY_ROOM = 0x10;
    uint8 constant PERMISSION_CARDIOLOGY_ROOM = 0x20;
    




    // Functions to mint tokens for doctors, assistants, and patients
    function mintDoctor(address account, string memory name, string memory surname, string calldata taxCode) public onlyOwner{
        require(balanceOf(account, 1) == 0, "This address already own this token type.");
        tokenIdDoctor++;
        _mint(account, Doctor, 1, "");
        tokenPersonalData[Doctor][tokenIdDoctor] = PersonalData(name, surname, taxCode);
        tokenPossession[account][Doctor] = tokenIdDoctor;
        addressTokenPossession[Doctor][tokenIdDoctor] = account;
        // Initialize with empty permissions
        initializeHospitalAccess(Doctor , tokenIdDoctor);

    }

    
    function mintPatient(address account, string memory name, string memory surname, string calldata taxCode) public onlyOwner {
        require(balanceOf(account, 2) == 0, "This address already own this token type.");
        tokenIdPatient++;
        _mint(account, Patient, 1, "");
        tokenPersonalData[Patient][tokenIdPatient] = PersonalData(name, surname, taxCode);
        tokenPossession[account][Patient] = tokenIdPatient;
        addressTokenPossession[Patient][tokenIdPatient] = account;
        // Initialize with empty permissions
        initializeHospitalAccess(Patient , tokenIdPatient);
    }


    function mintAssistant(address account, string memory name, string memory surname, string calldata taxCode) public onlyOwner {
            require(balanceOf(account, 3) == 0, "This address already own this token type.");
            tokenIdAssistant++;
            _mint(account, Assistant, 1, "");
            tokenPersonalData[Assistant][tokenIdAssistant] = PersonalData(name, surname, taxCode);
            tokenPossession[account][Assistant] = tokenIdAssistant;
            addressTokenPossession[Assistant][tokenIdAssistant] = account;
            // Initialize with empty permissions
            initializeHospitalAccess(Assistant , tokenIdAssistant);
        }

    // Function used to retrieve informations about last user minted
    function getLastMintedUser(uint256 tokenType, address accountowner) public view returns (address account, uint256 tokenId, string memory name , string memory surname, string memory taxCode) {
        uint256 tokenID;
        require(balanceOf(accountowner, tokenType) > 0, "Address does not own this token type.");

        tokenID = tokenPossession[accountowner][tokenType];
        
        
     return (accountowner, tokenID, tokenPersonalData[tokenType][tokenID].name , tokenPersonalData[tokenType][tokenID].surname , tokenPersonalData[tokenType][tokenID].taxCode);
    
    }

    // Function used to inizialize the Array containing permissions for each Hospital (Sets permission to 0x00 for each hospital)
    function initializeHospitalAccess(uint256 tokenType, uint256 tokenID) internal {
    // Iterate over each hospital ID
        for (uint256 i = H1; i <= H4; i++) {
            // Initialize access rights for this token at the given index for each hospital
            tokenHospitalAccessRights[tokenType][tokenID].push(HospitalAccess({
                hospitalId: i,
                accessRights: new bytes(0) // Empty access rights
            }));
        }
    }


    // Function used to update hospital access rights for a specific token instance
    function setHospitalAccess(uint256 tokenType, uint256 tokenID, uint256 hospitalId, bytes memory accessRights) public onlyOwner {

        address owner = addressTokenPossession[tokenType][tokenID];
        require(owner != address(0), "Token does not exist or has no owner.");

        // Find and update the specific hospital access rights for the given token instance
        bool hospitalFound = false;
        for (uint256 i = 0; i < tokenHospitalAccessRights[tokenType][tokenID].length; i++) {
            if (tokenHospitalAccessRights[tokenType][tokenID][i].hospitalId == hospitalId) {
                tokenHospitalAccessRights[tokenType][tokenID][i].accessRights = accessRights;
                hospitalFound = true;
                break;
            }
        }
        
        // If the hospital ID is not found, add a new entry
        if (!hospitalFound) {
            tokenHospitalAccessRights[tokenType][tokenID].push(HospitalAccess({
                hospitalId: hospitalId,
                accessRights: accessRights
            }));
        }
    }

    // Checks if the permission is granted for the specified hospital
    function checkPermission(uint256 tokenType, uint256 tokenID, uint256 hospitalId, uint8 permission) public view returns (bool) {
        for (uint256 i = 0; i < tokenHospitalAccessRights[tokenType][tokenID].length; i++) {
            if (tokenHospitalAccessRights[tokenType][tokenID][i].hospitalId == hospitalId) {
                bytes memory accessRights = tokenHospitalAccessRights[tokenType][tokenID][i].accessRights;
                return (uint8(accessRights[0]) & permission) == permission;
            }
        }
        return false;
    }

    // Returns the access rights for a specified hospital associated with a specific token
    function getHospitalPermissions(uint256 tokenType, uint256 tokenID, uint256 hospitalId) public view returns (bytes memory) {
        address owner = addressTokenPossession[tokenType][tokenID];
        require(owner != address(0), "Token does not exist or has no owner.");
        
        for (uint256 i = 0; i < tokenHospitalAccessRights[tokenType][tokenID].length; i++) {
            if (tokenHospitalAccessRights[tokenType][tokenID][i].hospitalId == hospitalId) {
                return tokenHospitalAccessRights[tokenType][tokenID][i].accessRights;
            }
        }
        // Return an empty byte array if no permissions are set or if the hospitalId is not found
        return new bytes(0);
    }

    function getAddressForToken(uint256 tokenType, uint256 tokenID) public view returns (address) {
        address owner = addressTokenPossession[tokenType][tokenID];
        require(owner != address(0), "Token does not exist or has no owner.");
        return owner;
    }



}
