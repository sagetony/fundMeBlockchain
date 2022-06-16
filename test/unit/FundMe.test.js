const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat")
let aa = 000
let fundMe
let deployer
let MockV3Aggregator
const sendValue = ethers.utils.parseEther("1")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture()
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("set address correctly!!", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("Fail if ETH is below the required amount", async function () {
                  await expect(fundMe.fund()).to.be.reverted
              })
              it("Updates the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Update the sender database", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("check if its the getOwner!!", async function () {
                  const getOwner = await fundMe.getOwner()
                  assert.equal(getOwner, deployer)
              })
              it("withdrawal has been made!!", async function () {
                  const startedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startedAmountDeployer =
                      await fundMe.provider.getBalance(deployer)
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endAmountDeployer = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endedAmount, 0)
                  assert.equal(
                      startedAmount.add(startedAmountDeployer).toString(),
                      endAmountDeployer.add(gasCost).toString()
                  )
              })

              it("is allows us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startedAmountDeployer =
                      await fundMe.provider.getBalance(deployer)
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endAmountDeployer = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endedAmount, 0)
                  assert.equal(
                      startedAmount.add(startedAmountDeployer).toString(),
                      endAmountDeployer.add(gasCost).toString()
                  )
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the getOwner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
              })
          })
          describe("cheaperWithdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("check if its the getOwner!!", async function () {
                  const getOwner = await fundMe.getOwner()
                  assert.equal(getOwner, deployer)
              })
              it("withdrawal has been made!!", async function () {
                  const startedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startedAmountDeployer =
                      await fundMe.provider.getBalance(deployer)
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endAmountDeployer = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endedAmount, 0)
                  assert.equal(
                      startedAmount.add(startedAmountDeployer).toString(),
                      endAmountDeployer.add(gasCost).toString()
                  )
              })

              it("is allows us to cheaperWithdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startedAmountDeployer =
                      await fundMe.provider.getBalance(deployer)
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endedAmount = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endAmountDeployer = await fundMe.provider.getBalance(
                      deployer
                  )
                  assert.equal(endedAmount, 0)
                  assert.equal(
                      startedAmount.add(startedAmountDeployer).toString(),
                      endAmountDeployer.add(gasCost).toString()
                  )
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the getOwner to cheaperWithdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(fundMeConnectedContract.cheaperWithdraw()).to.be
                      .reverted
              })
          })
      })
