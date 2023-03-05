// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// 0x3322e6ecf29467270ceEbF10d8CdE82127a7850e

 import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";        
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract MetaVerse is ERC721, Ownable {
    // ERC721 ke ander is out nft ka naam, and symbol-BB
    constructor() ERC721("MetaVerse", "MV") {}

    using Counters for Counters.Counter;  // importing counters from counter library

    Counters.Counter private supply; // this function has access to all functions of Counters

    uint256 public maxSupply = 100;
    uint256 public cost = 10 wei;

    struct Object {
        // height,width,depth,x-axis...
        string name;
        int8 w;
        int8 h;
        int8 d;
        int8 x;
        int8 y;
        int8 z;
    }

    mapping(address => Object[]) NFTOwners;

    Object[] public objects;  // creating a array of datatype object

    function getObjects() public view returns (Object[] memory) {
        return objects; // gives an array 
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();  // current() is a function of Counters library ans supply is its variable
    }

    function mint(
        string memory _object_name,
        int8 _w,
        int8 _h,
        int8 _d,
        int8 _x,
        int8 _y,
        int8 _z
    ) public payable {
        require(supply.current() <= maxSupply, "Supply exceeds maximum");
        require(msg.value >= cost, "Insufficient Payment");

        supply.increment();  // a function of counter library

        _safeMint(msg.sender, supply.current());  // it is a function of erc721 to mint safely

        Object memory _newObject = Object(_object_name, _w, _h, _d, _x, _y, _z);  // creating a variable that has object info
        objects.push(_newObject);  // putting this new variable into the array aobjects, it is to keep track    

        NFTOwners[msg.sender].push(_newObject);  // pushing the new variable object to the mapp as assigning that object to the address
    }

    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());  //owner() is a func that declare who deployed the contract 
        _owner.transfer(address(this).balance);
    }

    function getOwnerObjects() public view returns (Object[] memory) {
        return NFTOwners[msg.sender];  // to see whAT all objects a person owns
    }
}
