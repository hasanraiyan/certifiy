'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import initial mock data
import initialProducts from '@/lib/mock-api/data/products.json';
import initialBundles from '@/lib/mock-api/data/bundles.json';
import initialQuestions from '@/lib/mock-api/data/questions.json';
import initialUsers from '@/lib/mock-api/data/users.json';
import initialTeam from '@/lib/mock-api/data/team.json';
import initialTests from '@/lib/mock-api/data/tests.json';

const AdminContext = createContext();

const LOCAL_STORAGE_KEY = 'certify-admin-data';

// Helper function to get data from localStorage or fall back to initial data
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Ensure all keys are present
      return {
        products: parsed.products || initialProducts,
        bundles: parsed.bundles || initialBundles,
        questions: parsed.questions || initialQuestions,
        users: parsed.users || initialUsers,
        team: parsed.team || initialTeam,
        tests: parsed.tests || initialTests
      };
    }
  } catch (error) {
    console.error("Failed to parse admin data from localStorage", error);
  }

  // If nothing is in localStorage, use the initial JSON data
  return {
    products: initialProducts,
    bundles: initialBundles,
    questions: initialQuestions,
    users: initialUsers,
    team: initialTeam,
    tests: initialTests
  };
};

export const AdminProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [team, setTeam] = useState([]);
  const [tests, setTests] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const initialState = getInitialState();
    if (initialState) {
      setProducts(initialState.products);
      setBundles(initialState.bundles);
      setQuestions(initialState.questions);
      setUsers(initialState.users);
      setTeam(initialState.team);
      setTests(initialState.tests);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever any state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = JSON.stringify({ products, bundles, questions, users, team, tests });
      localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
    } catch (error) {
      console.error("Failed to save admin data to localStorage", error);
    }
  }, [products, bundles, questions, users, team, tests, isLoaded]);

  // CRUD Functions for Products
  const createProduct = (newProduct) => {
    const product = { ...newProduct, id: `prod_${Date.now()}` };
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // CRUD Functions for Bundles
  const createBundle = (newBundle) => {
    const bundle = { ...newBundle, id: `bundle_${Date.now()}` };
    setBundles(prev => [...prev, bundle]);
  };

  const updateBundle = (bundleId, updatedData) => {
    setBundles(prev => prev.map(b => b.id === bundleId ? { ...b, ...updatedData } : b));
  };

  const deleteBundle = (bundleId) => {
    setBundles(prev => prev.filter(b => b.id !== bundleId));
  };

  // CRUD Functions for Questions
  const createQuestion = (newQuestion) => {
    const question = { ...newQuestion, id: Date.now() };
    setQuestions(prev => [...prev, question]);
  };

  const updateQuestion = (questionId, updatedData) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, ...updatedData } : q));
  };

  const deleteQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  // CRUD Functions for Users
  const createUser = (newUser) => {
    const user = { ...newUser, id: Date.now() };
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // CRUD Functions for Team
  const createTeamMember = (newMember) => {
    const member = { ...newMember, id: `team_${Date.now()}` };
    setTeam(prev => [...prev, member]);
  };

  const updateTeamMember = (memberId, updatedData) => {
    setTeam(prev => prev.map(m => m.id === memberId ? { ...m, ...updatedData } : m));
  };

  const deleteTeamMember = (memberId) => {
    setTeam(prev => prev.filter(m => m.id !== memberId));
  };

  // CRUD Functions for Tests
  const createTest = (newTest) => {
    const test = { ...newTest, id: `test_${Date.now()}` };
    setTests(prev => [...prev, test]);
  };

  const updateTest = (testId, updatedData) => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, ...updatedData } : t));
  };

  const deleteTest = (testId) => {
    setTests(prev => prev.filter(t => t.id !== testId));
  };

  const value = {
    isLoaded,
    // Products
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    // Bundles
    bundles,
    createBundle,
    updateBundle,
    deleteBundle,
    // Questions
    questions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    // Users
    users,
    createUser,
    updateUser,
    deleteUser,
    // Team
    team,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    // Tests
    tests,
    createTest,
    updateTest,
    deleteTest
  };

  return (
    <AdminContext.Provider value={value}>
      {isLoaded ? children : <div>Loading Admin Data...</div>}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};