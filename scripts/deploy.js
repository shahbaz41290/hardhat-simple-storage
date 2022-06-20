const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStoragFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract.....");
  const simpleStorage = await SimpleStoragFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contrct to: ${simpleStorage.address}`);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  //Update the current value
  const transcationResponse = await simpleStorage.store(7);
  await transcationResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.logg("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
