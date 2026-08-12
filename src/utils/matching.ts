import { Student, GroupConfig, Group, MatchRecord, PairFrequency } from '../types';

export const FUN_GROUP_NAMES = [
  '무지개 모둠', '햇살 모둠', '은하수 모둠', '희망 모둠',
  '꿈나무 모둠', '초록숲 모둠', '비타민 모둠', '별빛 모둠',
  '단짝 모둠', '아침이슬 모둠', '드림팀', '우주탐험대',
  '너나들이', '도란도란', '새싹 모둠', '풀꽃 모둠'
];

/**
 * Builds a pair frequency map from past match records.
 * Key: `${id1}_${id2}` where id1 < id2 alphabetically
 */
export function buildPairFrequencyMap(history: MatchRecord[]): PairFrequency {
  const map: PairFrequency = {};

  for (const record of history) {
    for (const group of record.groups) {
      const members = group.members;
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          const idA = members[i].id;
          const idB = members[j].id;
          const pairKey = idA < idB ? `${idA}_${idB}` : `${idB}_${idA}`;
          map[pairKey] = (map[pairKey] || 0) + 1;
        }
      }
    }
  }

  return map;
}

export function getPairCount(
  freqMap: PairFrequency,
  id1: string,
  id2: string
): number {
  const pairKey = id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  return freqMap[pairKey] || 0;
}

/**
 * Fisher-Yates random shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Partition an array of active students into group sizes based on configuration
 */
function createPartition(
  students: Student[],
  config: GroupConfig
): Student[][] {
  const total = students.length;
  if (total === 0) return [];

  let targetSize = 2;
  let numGroups = 1;

  if (config.type === 'pair') {
    targetSize = 2;
    numGroups = Math.floor(total / 2);
  } else if (config.mode === 'by_count') {
    numGroups = Math.min(Math.max(1, config.targetCount), total);
    targetSize = Math.floor(total / numGroups);
  } else {
    targetSize = Math.max(2, config.groupSize);
    numGroups = Math.floor(total / targetSize);
  }

  if (numGroups <= 0) numGroups = 1;

  // Base partitioning: fill numGroups with base targetSize elements
  const groups: Student[][] = Array.from({ length: numGroups }, () => []);
  let studentIdx = 0;

  for (let g = 0; g < numGroups; g++) {
    for (let s = 0; s < targetSize; s++) {
      if (studentIdx < total) {
        groups[g].push(students[studentIdx++]);
      }
    }
  }

  // Handle remaining students
  const leftovers = students.slice(studentIdx);

  if (leftovers.length > 0) {
    if (config.leftoverOption === 'merge') {
      // Distribute leftovers one by one to existing groups
      leftovers.forEach((leftover, idx) => {
        groups[idx % groups.length].push(leftover);
      });
    } else {
      // Create separate smaller group for leftovers
      groups.push(leftovers);
    }
  }

  return groups;
}

/**
 * Calculate collision penalty score for a group partition
 */
function calculatePartitionScore(
  partition: Student[][],
  freqMap: PairFrequency
): number {
  let score = 0;

  for (const group of partition) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const count = getPairCount(freqMap, group[i].id, group[j].id);
        // Exponentially penalize repeatedly paired students
        score += Math.pow(count + 1, 2) * 10;
      }
    }
  }

  return score;
}

/**
 * Main matching algorithm with history collision reduction
 */
export function generateGroups(
  activeStudents: Student[],
  config: GroupConfig,
  history: MatchRecord[]
): Group[] {
  if (activeStudents.length === 0) return [];

  const freqMap = buildPairFrequencyMap(history);

  // If overlap minimization is disabled or no history, just do a random shuffle
  const TRIALS = config.minimizeOverlap && history.length > 0 ? 300 : 1;

  let bestPartition: Student[][] | null = null;
  let bestScore = Infinity;

  for (let i = 0; i < TRIALS; i++) {
    const shuffledStudents = shuffle(activeStudents);
    const candidatePartition = createPartition(shuffledStudents, config);
    const score = calculatePartitionScore(candidatePartition, freqMap);

    if (score < bestScore) {
      bestScore = score;
      bestPartition = candidatePartition;
    }
  }

  if (!bestPartition) {
    bestPartition = createPartition(shuffle(activeStudents), config);
  }

  // Convert partition to Group objects with clear names
  const useFunNames = config.type === 'group' && bestPartition.length <= FUN_GROUP_NAMES.length;
  const namePool = shuffle(FUN_GROUP_NAMES);

  return bestPartition.map((members, idx) => {
    let name = '';
    if (config.type === 'pair') {
      name = `${idx + 1}번째 짝`;
      if (members.length === 3) {
        name = `${idx + 1}번째 짝 (3인 드림팀)`;
      }
    } else {
      name = useFunNames ? namePool[idx] : `${idx + 1}모둠`;
    }

    return {
      id: `group-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      members,
    };
  });
}
