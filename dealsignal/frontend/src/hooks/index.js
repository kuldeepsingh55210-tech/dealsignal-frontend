import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TenantContext } from '../context/TenantContext';

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useTenant = () => {
    return useContext(TenantContext);
};
