const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")
let aa = 000
let fundMe
let deployer
let MockV3Aggregator
const sendValue = ethers.utils.parseEther("1")
describe("FundMe", async function () {
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture()
        fundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    // console.log(aa)
    // console.log(deployer)
    describe("constructor", async function () {
        it("set address correctly!!", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, MockV3Aggregator.address)
        })
    })
    describe("fund", async function () {
        it("Fail if ETH is below the required amount", async function () {
            await expect(fundMe.fund()).to.be.reverted
        })
        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
    })
})
