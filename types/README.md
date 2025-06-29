# TypeScript Type Declarations

This directory contains global TypeScript type declarations for the Web3 Skill Platform project.

## Global Declarations

### `global.d.ts`

This file contains global type declarations that are used throughout the project:

- **Window Ethereum Provider**: Declares the `window.ethereum` property with the `MetaMaskInpageProvider` type from the `@metamask/providers` package. This ensures TypeScript properly recognizes the Ethereum provider injected by MetaMask and other Web3 wallets.

## Usage

These type declarations are automatically included in the TypeScript compilation process through the `tsconfig.json` configuration. You don't need to explicitly import them in your files.

### Using window.ethereum Safely

When using `window.ethereum` in your code, you should always follow these best practices:

1. **Check for existence before using it**:

```typescript
if (typeof window !== 'undefined' && window.ethereum) {
  // Safe to use window.ethereum here
  await window.ethereum.request({ method: 'eth_requestAccounts' });
}
```

2. **For event listeners, ensure proper cleanup**:

```typescript
// Adding event listeners
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', handleChainChanged);
  
  // Cleanup in useEffect return function
  return () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };
}
```

3. **Handle type compatibility with event handlers**:

The `MetaMaskInpageProvider` from `@metamask/providers` properly types the event handlers, so you don't need to add additional type declarations.

## Adding New Global Types

If you need to add more global type declarations:

1. Add them to the existing `global.d.ts` file if they're related to existing declarations
2. Create a new `.d.ts` file for distinct groups of declarations

## Best Practices

- Keep global declarations minimal and only use them for truly global objects
- Prefer module-based types when possible
- Document all global declarations thoroughly
- Always check for the existence of browser-specific objects before using them
- Use null checks when accessing potentially undefined properties