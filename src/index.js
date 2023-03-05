import Movements from "./movement.js"
import polygon from "./Web3.js";
import abi from "./abi.json" assert { type: "json" };

const scene = new THREE.Scene();
// to change the color of the scene(background) with hexa decimal code
scene.background = new THREE.Color(0xCFCBDC)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//to use lighting,use AmbientLight, give it DirectionalLight-for this changed material to MeshPhongMaterial
const ambient_light = new THREE.AmbientLight(0xA495D3)
const direction_light = new THREE.DirectionalLight(0x8971D5)
ambient_light.add(direction_light);  // have to add direc to amb
scene.add(ambient_light)  // have to add the changes to the scene

// now creating an area
const geometry_area = new THREE.BoxGeometry(300, 1, 300);
const material_area = new THREE.MeshPhongMaterial({ color: 0xffffff });
const area = new THREE.Mesh(geometry_area, material_area);
scene.add(area);

// now we create a cube
const geometry_cube = new THREE.BoxGeometry(3, 3, 3);   // it makes a cude
const material_cube = new THREE.MeshPhongMaterial({ color: 0x6D57AC }); //it makes material of cube, can check its docs
const cube = new THREE.Mesh(geometry_cube, material_cube);  // mesh adds both the property to the cube
scene.add(cube);  //scene.add adds the object to the scene
cube.position.set(0, 0, 0);

// creating a cylinder
const geometry_cyl = new THREE.CylinderGeometry(2, 2, 15, 5); // the last no. determine the sides of cylinder, 1,2 should be same as as to get sym, 3rdis for height
const material_cyl = new THREE.MeshPhongMaterial({ color: 0x110142 });
const cylinder = new THREE.Mesh(geometry_cyl, material_cyl);
scene.add(cylinder);
cylinder.position.set(10, 0, 0);  // setting the position as per the plane 

// creating cone
const geometry_cone = new THREE.ConeGeometry(5, 20, 32);
const material_cone = new THREE.MeshPhongMaterial({ color: 0x1be3ef });
const cone = new THREE.Mesh(geometry_cone, material_cone);
scene.add(cone);
cone.position.set(-10, 0, 0);



// it tells which angle we want to see it from, it should be below all the objects
camera.position.z = 1;
camera.position.set(1, 6, 37);

// adding animations function
function animate() {
    // - means opposite side movements
    // here we rotate the object and can gie the speed of rotation
    cube.rotation.x -= 0.05;
    cube.rotation.y += 0.05;
    cube.rotation.z += 0.05;
    cylinder.rotation.x += 0.11;
    cylinder.rotation.y += 0.11;
    cone.rotation.x += 0.1;
    cone.rotation.y += 0.11;
    requestAnimationFrame(animate); // it is kept below the object rotations


// to change it position (actually camera moves not posi)
// camera.position.x -= 0.01;

    // noting key movements
    if (Movements.isPressed(37)) {
        //left
        camera.position.x -= 2;
      }
      if (Movements.isPressed(38)) {
        //up
        camera.position.x += 2;
        camera.position.y += 2;
      }
      if (Movements.isPressed(39)) {
        //right
        camera.position.x += 2;
      }
      if (Movements.isPressed(40)) {
        //down
        camera.position.x -= 2;
        camera.position.y -= 2;
        
      }
    
    camera.lookAt(area.position);  //lookAt is used to look to a particular object in the scene

    renderer.render(scene, camera);
}
animate();

// now to render we input scene and carema to renderer, it should always be in the last of the codes
renderer.render(scene, camera);

// hee we will code for our forn in the html
// getting mint button  
const button = document.querySelector("#mint");
// hearing click event
button.addEventListener("click", mintNFT);


async function mintNFT() {
  // getting values of the input
  let nft_name = document.querySelector("#nft_name").value;
  let nft_width = document.querySelector("#nft_width").value;
  let nft_height = document.querySelector("#nft_height").value;
  let nft_depth = document.querySelector("#nft_depth").value;
  let nft_x = document.querySelector("#nft_x").value;
  let nft_y = document.querySelector("#nft_y").value;
  let nft_z = document.querySelector("#nft_z").value;

  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask");
  }

  // setting the instance wweb3
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0x3322e6ecf29467270ceEbF10d8CdE82127a7850e"
  );

  // requesting the account who will contact with the contract and will call the mint function
  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
      .send({
        from: accounts[0],
        // sending 10 wei as value is already in the form of wei  
        value: 10,
      })
      .then((data) => {
        console.log("NFT is minted");
      });
  });
}


//now using the polygon promises
polygon.then((result) => {
  result.nft.forEach((object, index) => {
    if (index <= result.supply) {  // means run the loop tab tak jab tak index is less then the supplly
      const geometry_cube = new THREE.BoxGeometry(object.w, object.h, object.d);
      const material_cube = new THREE.MeshPhongMaterial({ color: 0x1be3ef });
      const nft = new THREE.Mesh(geometry_cube, material_cube);

      nft.position.set(object.x, object.y, object.z);
      scene.add(nft);
    }
  });
});