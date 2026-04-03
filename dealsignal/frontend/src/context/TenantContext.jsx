import React, { createContext, useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    // Tenant ID from the authenticated user
    const tenantId = user?.tenantId || null;

    return (
        <TenantContext.Provider value={{ tenantId }}>
            {children}
        </TenantContext.Provider>
    );
};
