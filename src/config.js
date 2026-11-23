// Launch configuration. Enter only VERIFIED information; never substitute a reference token's address.
// UI deliberately refuses to send traders to a generic, fabricated swap URL.
const CONFIG = Object.freeze({
  name: 'Ethereum Cat', symbol: 'ETHCAT', network: 'Ethereum Mainnet', chainId: 1,
  contractAddress: '0x73a869579309ef7a41ceff600547a3f6fabae34c',
  tokenSupply: '1B',
  transferTax: '0%',
  buyUrl: '', // optional verified swap route for the deployed token
  socials: {X:'https://x.com/ethereumcat_eth',Telegram:'https://t.me/ethereumcat_eth',GitHub:''},
  rpcUrls: ['https://ethereum-rpc.publicnode.com','https://cloudflare-eth.com'],
  blockPollMs: 15000, blockRequestTimeoutMs: 6500
});
