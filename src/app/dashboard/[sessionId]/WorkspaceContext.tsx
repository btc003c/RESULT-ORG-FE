"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getAuthToken } from "@/lib/api";

type WorkspaceContextType = {
  activeWorkspace: any;
  setActiveWorkspace: (workspace: any) => void;
  workspaces: any[];
  isLoading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  activeWorkspace: null,
  setActiveWorkspace: () => {},
  workspaces: [],
  isLoading: true,
});

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom setter to also persist to localStorage
  const setActiveWorkspace = (workspace: any) => {
    setActiveWorkspaceState(workspace);
    if (typeof window !== 'undefined' && workspace) {
      const id = workspace.id || workspace._id;
      if (id) {
        localStorage.setItem('rh_active_workspace_id', id);
      }
    } else if (typeof window !== 'undefined' && !workspace) {
      localStorage.removeItem('rh_active_workspace_id');
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadWorkspaces = async () => {
      try {
        const response = await api.workspaces.getMyWorkspaces(0, 50);
        if (response.content) {
          const loadedWorkspaces = response.content.map((ws: any) => ({
            ...ws,
            id: ws.id || ws._id
          }));
          setWorkspaces(loadedWorkspaces);
          
          if (loadedWorkspaces.length > 0) {
            const savedId = typeof window !== 'undefined' ? localStorage.getItem('rh_active_workspace_id') : null;
            if (savedId) {
              const found = loadedWorkspaces.find((w: any) => (w.id || w._id) === savedId);
              setActiveWorkspaceState(found || loadedWorkspaces[0]);
            } else {
              setActiveWorkspaceState(loadedWorkspaces[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load workspaces", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkspaces();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, setActiveWorkspace, workspaces, isLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
