const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding........")

    const fundMeResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.2"),
    })
    await fundMeResponse.wait(1)
    console.log("Done........")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
