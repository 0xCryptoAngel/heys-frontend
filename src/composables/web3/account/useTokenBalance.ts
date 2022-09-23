import { useQuery } from 'vue-query'
import { ethers } from 'ethers'
import { computed, unref } from 'vue'
import useRPCProvider from './useRPCProvider'

export default function useTokenBalance(account: any, tokenAddress: string, network: number) {
  const isEnabled = computed(() => {
    return Boolean(unref(account))
  })

  const { data: balance, ...other } = useQuery(
    ['tokenBalance', tokenAddress, account],
    () => {
      console.log('Checking token balance')
      if (!account.value) {
        return 'Not connected'
      } else {
        const { provider } = useRPCProvider()
        // const provider = new AlchemyProvider("maticmum")

        const abi = [
          'function balanceOf(address account) view returns (uint256)',
          'function decimals() view returns (uint256)',
        ]
        const tokenContract = new ethers.Contract(tokenAddress, abi, provider)

        return tokenContract.balanceOf(account.value)
      }
    },
    {
      enabled: isEnabled,
    }
  )

  return { balance, ...other }
}
