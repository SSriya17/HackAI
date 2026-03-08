import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  firstName: 'userFirstName',
  lastName: 'userLastName',
  email: 'userEmail',
  role: 'userRole',
  year: 'userYear',
  major: 'userMajor',
  university: 'userUniversity',
  department: 'userDepartment',
  title: 'userTitle',
  labName: 'labName',
  labSpots: 'labSpots',
  labHours: 'labHours',
};

export function saveUser(updates) {
  Object.entries(updates).forEach(([k, v]) => {
    const key = STORAGE_KEYS[k] || `user${k.charAt(0).toUpperCase()}${k.slice(1)}`;
    if (v != null && v !== '') localStorage.setItem(key, String(v));
  });
}

function getStored(key) {
  try {
    return localStorage.getItem(STORAGE_KEYS[key] || key) || '';
  } catch {
    return '';
  }
}

export function useUser() {
  const [user, setUser] = useState(() => ({
    firstName: getStored('firstName'),
    lastName: getStored('lastName'),
    email: getStored('email'),
    role: getStored('role') || 'student',
    year: getStored('year'),
    major: getStored('major'),
    university: getStored('university'),
    department: getStored('department'),
    title: getStored('title'),
    labName: getStored('labName'),
    labSpots: getStored('labSpots'),
    labHours: getStored('labHours'),
  }));

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || null;

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      Object.entries(updates).forEach(([k, v]) => {
        const key = STORAGE_KEYS[k] || k;
        if (v != null) localStorage.setItem(key, String(v));
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const sync = () => {
      setUser({
        firstName: getStored('firstName'),
        lastName: getStored('lastName'),
        email: getStored('email'),
        role: getStored('role') || 'student',
        year: getStored('year'),
        major: getStored('major'),
        university: getStored('university'),
        department: getStored('department'),
        title: getStored('title'),
        labName: getStored('labName'),
        labSpots: getStored('labSpots'),
        labHours: getStored('labHours'),
      });
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return {
    ...user,
    fullName,
    updateUser,
    displayName: user.firstName || fullName || 'there',
  };
}
