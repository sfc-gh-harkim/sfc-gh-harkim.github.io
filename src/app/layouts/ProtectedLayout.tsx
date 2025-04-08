'use client';

import React from 'react';
import { PasswordProtection } from '../components/PasswordProtection';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <PasswordProtection>
      {children}
    </PasswordProtection>
  );
} 