export type MatchingType = 'pair' | 'group';

export type StudentTrait =
  | 'learning_support' // 학습부진 / 학습지원 필요
  | 'special_support'  // 도움반 / 배려 필요
  | 'quiet_isolated'   // 소극적 / 소외 우려
  | 'popular'          // 인기있는 / 친화력 높음
  | 'leader_helper'    // 리더 / 또래도우미
  | 'none';            // 기본

export interface Student {
  id: string;
  name: string; // Nickname or number
  isExcluded: boolean; // Attendance / excluded from match today
  trait?: StudentTrait;
  avoidWithIds?: string[]; // 특정 학생과 같은 조 피하기
  note?: string;
  createdAt: number;
}

export type LeftoverOption = 'merge' | 'separate'; // 'merge': add to existing group (e.g., 3-person pair), 'separate': create a smaller group

export interface GroupConfig {
  type: MatchingType;
  groupSize: number; // e.g. 2 for pair, 3 or 4 for group
  mode: 'by_size' | 'by_count'; // 'by_size': N students per group, 'by_count': total N groups
  targetCount: number; // Used when mode is 'by_count'
  leftoverOption: LeftoverOption;
  minimizeOverlap: boolean; // Historical collision reduction
  considerTraits: boolean;  // 학생 성향 및 특성 자동 고려
}

export interface Group {
  id: string;
  name: string;
  members: Student[];
}

export interface MatchRecord {
  id: string;
  title: string;
  timestamp: number;
  type: MatchingType;
  groupSize: number;
  groups: Group[];
  excludedStudents: Student[];
}

export interface PairFrequency {
  [studentIdPair: string]: number; // key: `${id1}_${id2}` where id1 < id2
}
