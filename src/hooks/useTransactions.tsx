import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
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
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextDate>({} as TransactionsContextDate);

export function TransactionsProvider({children}: TransactionsProviderProps) {  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('http://localhost:3000/api/transactions')
      .then(({data}) => setTransactions(data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post("/transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });
    const {transaction} = response.data;

    setTransactions(transactions => [...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider 
      value={{transactions, createTransaction}}
    >
      {children}
    </TransactionsContext.Provider>
  );
} 

export function useTransactions() {
  const context = useContext(TransactionsContext);
  
  return context;
}