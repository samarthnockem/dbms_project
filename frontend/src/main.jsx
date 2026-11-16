import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateAccountPage from './pages/CreateAccountPage.jsx'
import AccountSelectionPage from './pages/AccountSelectionPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MoneyActionPage from './pages/MoneyActionPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import LoansPage from './pages/LoansPage.jsx'
import TransferPage from './pages/TransferPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<SignUpPage />} path="/signup" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<CreateAccountPage />} path="/create-account" />
        <Route element={<AccountSelectionPage />} path="/select-account" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<MoneyActionPage action="deposit" />} path="/deposit" />
        <Route element={<MoneyActionPage action="withdraw" />} path="/withdraw" />
        <Route element={<TransactionsPage />} path="/transactions" />
        <Route element={<LoansPage />} path="/loans" />
        <Route element={<TransferPage />} path="/transfer" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

