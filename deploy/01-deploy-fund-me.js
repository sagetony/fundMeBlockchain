const { network, run } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log({ deployer })
    let ethUsdPriceFeed
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeed = ethUsdAggregator.address
    } else {
        ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeed]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmation || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-----------------------------")
}

module.exports.tags = ["tags", "fundme"]
