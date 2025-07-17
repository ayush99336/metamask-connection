import { ethers } from 'ethers';

export async function connectWallet(): Promise<string | null> {
  if (!(window as any).ethereum) {
    alert('MetaMask is not installed!');
    return null;
  }
  try {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (err) {
    alert('Wallet connection failed.');
    return null;
  }
}

export async function payETH(to: string, amountEth: string): Promise<string | null> {
  if (!(window as any).ethereum) {
    alert('MetaMask is not installed!');
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amountEth),
    });
    await tx.wait();
    return tx.hash;
  } catch (err) {
    alert('Payment failed.');
    return null;
  }
}
