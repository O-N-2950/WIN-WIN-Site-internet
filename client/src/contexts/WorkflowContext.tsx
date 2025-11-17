/**
 * WorkflowContext - Gestion de l'état du workflow client
 * Persiste les données dans localStorage pour éviter la perte lors des redirections
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WorkflowData {
  // Étape 1: Questionnaire
  questionnaireCompleted: boolean;
  questionnaireData?: Record<string, any>;
  
  // Étape 2: Informations client
  clientName: string;
  clientEmail: string;
  clientType: 'particulier' | 'entreprise';
  clientAge?: number;
  clientEmployeeCount?: number;
  clientAddress?: string;
  
  // Étape 3: Signature
  signatureDataUrl?: string;
  signatureS3Url?: string;
  signatureDate?: string;
  
  // Étape 4: Tarification
  annualPrice: number;
  isFree: boolean;
  
  // Étape 5: Paiement
  stripeSessionId?: string;
  paymentCompleted: boolean;
  
  // Étape 6: Confirmation
  mandatNumber?: string;
  airtableRecordId?: string;
}

interface WorkflowContextType {
  workflow: WorkflowData;
  updateWorkflow: (data: Partial<WorkflowData>) => void;
  resetWorkflow: () => void;
  isWorkflowComplete: () => boolean;
}

const defaultWorkflowData: WorkflowData = {
  questionnaireCompleted: false,
  clientName: '',
  clientEmail: '',
  clientType: 'particulier',
  annualPrice: 0,
  isFree: false,
  paymentCompleted: false,
};

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const STORAGE_KEY = 'winwin_workflow_data';

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState<WorkflowData>(() => {
    // Charger depuis localStorage au démarrage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Erreur lors du chargement du workflow:', e);
        }
      }
    }
    return defaultWorkflowData;
  });

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    }
  }, [workflow]);

  const updateWorkflow = (data: Partial<WorkflowData>) => {
    setWorkflow(prev => ({ ...prev, ...data }));
  };

  const resetWorkflow = () => {
    setWorkflow(defaultWorkflowData);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const isWorkflowComplete = () => {
    return (
      workflow.questionnaireCompleted &&
      workflow.clientName !== '' &&
      workflow.clientEmail !== '' &&
      workflow.signatureDataUrl !== undefined &&
      workflow.paymentCompleted
    );
  };

  return (
    <WorkflowContext.Provider value={{ workflow, updateWorkflow, resetWorkflow, isWorkflowComplete }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
