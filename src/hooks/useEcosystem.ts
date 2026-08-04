'use client';

import { useState, useEffect } from 'react';
import { Founder, Startup, Investor, Mentor, Technology, Industry, GraphNode, GraphEdge } from '@/types';
import { mockFounders, mockStartups, mockInvestors, mockMentors, mockTechnologies, mockIndustries, mockGraphNodes, mockGraphEdges, mockRecommendations, mockActivities } from '@/data/mockData';

export function useFounders(search = '', industry = 'All') {
  const [data, setData] = useState<Founder[]>(mockFounders);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFounders() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (industry && industry !== 'All') params.append('industry', industry);

        const res = await fetch(`/api/founders?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch founders');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching founders');
      } finally {
        setLoading(false);
      }
    }
    fetchFounders();
  }, [search, industry]);

  return { founders: data, loading, error };
}

export function useStartups(search = '', stage = 'All') {
  const [data, setData] = useState<Startup[]>(mockStartups);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStartups() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (stage && stage !== 'All') params.append('stage', stage);

        const res = await fetch(`/api/startups?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch startups');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching startups');
      } finally {
        setLoading(false);
      }
    }
    fetchStartups();
  }, [search, stage]);

  return { startups: data, loading, error };
}

export function useInvestors(search = '') {
  const [data, setData] = useState<Investor[]>(mockInvestors);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestors() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        const res = await fetch(`/api/investors?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch investors');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching investors');
      } finally {
        setLoading(false);
      }
    }
    fetchInvestors();
  }, [search]);

  return { investors: data, loading, error };
}

export function useMentors(search = '') {
  const [data, setData] = useState<Mentor[]>(mockMentors);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentors() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        const res = await fetch(`/api/mentors?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch mentors');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching mentors');
      } finally {
        setLoading(false);
      }
    }
    fetchMentors();
  }, [search]);

  return { mentors: data, loading, error };
}

export function useTechnologies(search = '') {
  const [data, setData] = useState<Technology[]>(mockTechnologies);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTech() {
      try {
        setLoading(true);
        const res = await fetch(`/api/technologies?search=${encodeURIComponent(search)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch {
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    }
    fetchTech();
  }, [search]);

  return { technologies: data, loading };
}

export function useIndustries() {
  const [data, setData] = useState<Industry[]>(mockIndustries);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        setLoading(true);
        const res = await fetch('/api/industries');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch {
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    }
    fetchIndustries();
  }, []);

  return { industries: data, loading };
}

export function useDashboardData() {
  const [stats, setStats] = useState({
    foundersCount: 20,
    startupsCount: 15,
    investorsCount: 10,
    mentorsCount: 10,
    technologiesCount: 15,
    industriesCount: 8,
  });
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [activities, setActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.stats) setStats(json.data.stats);
          if (json.data.recommendationsPreview) setRecommendations(json.data.recommendationsPreview);
          if (json.data.activitiesStream) setActivities(json.data.activitiesStream);
        }
      } catch {
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return { stats, recommendations, activities, loading };
}

export function useGraphData(type = 'All', depth = 2) {
  const [nodes, setNodes] = useState<GraphNode[]>(mockGraphNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(mockGraphEdges);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGraph() {
      try {
        setLoading(true);
        const res = await fetch(`/api/graph?type=${encodeURIComponent(type)}`);
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.nodes) setNodes(json.data.nodes);
          if (json.data.edges) setEdges(json.data.edges);
        }
      } catch {
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [type, depth]);

  return { nodes, edges, loading };
}
