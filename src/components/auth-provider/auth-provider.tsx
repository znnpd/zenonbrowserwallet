import * as React from "react";
import {Navigate, useLocation} from "react-router-dom";
import Zenon from "../../service/zenon";

interface AuthContextType {
    wallet: any;
    signin: (password: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [wallet, setWallet] = React.useState<any>(null);

    let znn = new Zenon();

    let signin = (password: string, callback: VoidFunction) => {
        return znn.encryptWallet(password,(wallet) => {
            setWallet(wallet);
            callback();
        });
    };

    let signout = (callback: VoidFunction) => {
        return znn.decryptWallet(() => {
            setWallet(null);
            callback();
        });
    };

    let value: AuthContextType = { wallet, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.wallet) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}
