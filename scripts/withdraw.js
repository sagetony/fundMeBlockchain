const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const FundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contract")
    const withdrawResponse = await FundMe.withdraw()
    console.log("Withdraw Function")
    await withdrawResponse.wait(1)
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch()
