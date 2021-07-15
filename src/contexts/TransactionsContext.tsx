import {createContext, ReactNode, useEffect, useState} from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode
}

interface TransactionsContextDate {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionsContextDate>({} as TransactionsContextDate);

export function TransactionsProvider({children}: TransactionsProviderProps) {  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('http://localhost:3000/api/transactions')
      .then(({data}) => setTransactions(data.transactions));
  }, []);

  function createTransaction(transaction: TransactionInput) {
    api.post("/transactions", transaction)
      .then(({data}) => console.log(data));
  }

  return (
    <TransactionsContext.Provider 
      value={{transactions, createTransaction}}
    >
      {children}
    </TransactionsContext.Provider>
  );
} 