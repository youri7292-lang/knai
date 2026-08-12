import { Student, MatchRecord } from '../types';

const STUDENTS_KEY = 'class_matcher_students_v1';
const HISTORY_KEY = 'class_matcher_history_v1';
const CONFIG_KEY = 'class_matcher_config_v1';

export const DEFAULT_STUDENTS: Student[] = [
  { id: '1', name: '꿈꾸는사자', isExcluded: false, trait: 'leader_helper', createdAt: 1 },
  { id: '2', name: '지혜로운여우', isExcluded: false, trait: 'none', createdAt: 2 },
  { id: '3', name: '날아라독수리', isExcluded: false, trait: 'popular', createdAt: 3 },
  { id: '4', name: '호기심돌고래', isExcluded: false, trait: 'learning_support', createdAt: 4 },
  { id: '5', name: '용감한호랑이', isExcluded: false, trait: 'none', createdAt: 5 },
  { id: '6', name: '미소지은토끼', isExcluded: false, trait: 'quiet_isolated', createdAt: 6 },
  { id: '7', name: '성실한다람쥐', isExcluded: false, trait: 'none', createdAt: 7 },
  { id: '8', name: '푸른나무팬더', isExcluded: false, trait: 'leader_helper', createdAt: 8 },
  { id: '9', name: '반짝이는별', isExcluded: false, trait: 'none', createdAt: 9 },
  { id: '10', name: '슬기로운부엉이', isExcluded: false, trait: 'special_support', createdAt: 10 },
  { id: '11', name: '단단한거북이', isExcluded: false, trait: 'none', createdAt: 11 },
  { id: '12', name: '상냥한디어', isExcluded: false, trait: 'quiet_isolated', createdAt: 12 },
];

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) {
      saveStudents(DEFAULT_STUDENTS);
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students from localStorage:', e);
    return DEFAULT_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage:', e);
  }
}

export function getStoredHistory(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from localStorage:', e);
    return [];
  }
}

export function saveHistory(history: MatchRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }
}

export function addMatchRecord(record: MatchRecord): MatchRecord[] {
  const current = getStoredHistory();
  const updated = [record, ...current];
  saveHistory(updated);
  return updated;
}

export function deleteMatchRecord(id: string): MatchRecord[] {
  const current = getStoredHistory();
  const updated = current.filter((r) => r.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STUDENTS_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(CONFIG_KEY);
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
