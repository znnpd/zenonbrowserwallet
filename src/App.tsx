import * as React from "react";
import {
  Routes,
  Route
} from "react-router-dom";
import {AuthProvider, RequireAuth} from "./components/auth-provider/auth-provider";
import {DashboardLayout} from "./components/dashboard/dashboard-layout";
import LogIn from "./pages/login";
import AddPage from "./pages/add";
import CreatePage from "./pages/create";
import WalletPage from "./pages/wallet";
import SendPage from "./pages/send";
import ReceivePage from "./pages/receive";
import TransactionsPage from "./pages/transactions";

export default function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
              <Route path="/login" element={<LogIn />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route
                  path="/"
                  element={
                      <RequireAuth>
                          <WalletPage />
                      </RequireAuth>
                  }
              />
              <Route
                    path="/send"
                    element={
                      <RequireAuth>
                        <SendPage />
                      </RequireAuth>
                    }
              />
              <Route
                  path="/receive"
                  element={
                      <RequireAuth>
                          <ReceivePage />
                      </RequireAuth>
                  }
              />
              <Route
                  path="/transactions"
                  element={
                      <RequireAuth>
                          <TransactionsPage />
                      </RequireAuth>
                  }
              />
          </Route>
        </Routes>
      </AuthProvider>
  );
}
