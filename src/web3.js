// defining its type
import abi from "./abi.json" assert { type: "json" };


// creating a promise, whenever it is called the meta function will work
const polygon = new Promise((res, rej) => {

    // main function inside promise that handles promise 
    async function meta() {
        if (typeof window.ethereum == "undefined") {
            rej("You should install Metamask");
        }

        let web3 = new Web3(window.ethereum);
        let contract = new web3.eth.Contract(
            abi,
            "0x3322e6ecf29467270ceEbF10d8CdE82127a7850e"
        );

        let accounts = await  web3.eth.requestAccounts(); //array of accounts
        console.log("Connected account:", accounts[0]);

        let totalSupply = await contract.methods.totalSupply().call({ from: accounts[0] });
        console.log("Total Supply", totalSupply);

        let maxSupply = await contract.methods.maxSupply().call({ from: accounts[0] });
        console.log("Max Supply", maxSupply);

        let objects = await contract.methods.getOwnerObjects().call({ from: accounts[0] });
        console.log("Your objects", objects);

        web3.eth.requestAccounts()
        .then((accounts) => {contract.methods.totalSupply().call({ from: accounts[0] })  // yha se suply milegi
            .then((supply) => {contract.methods.getObjects().call({ from: accounts[0] })  //jab supply mil jae tab ye call hoga jisse kuch data milega
                .then((data) => {res({ supply: supply, nft: data });});  //data milne ke baad we will resolve it, ie upar ka supply or  getobject ka nft ka data so supply and nft   
            });
        });
    }

    meta();
    
});
export default polygon;