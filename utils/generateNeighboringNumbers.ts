const getStep = (target: number) => {
  switch (true) {
    case target >= 100: {
      return 50;
    }
    case target >= 1000: {
      return 100;
    }
    case target >= 5000: {
      return 500;
    }
    default: {
      return 1;
    }
  }
};

export const normalizeValue = (input: number, min: number, max: number) => {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  } else {
    return input;
  }
};

export interface NeighboringNumber {
  value: number;
  isMin: boolean;
  isMax: boolean;
  isCurrent: boolean;
}

const generateNeighboringNumbers = ({
  input,
  min,
  max,
  maxStep = 5,
}: {
  input: number;
  min: number;
  max: number;
  maxStep?: number;
}): NeighboringNumber[] => {
  const target = normalizeValue(input, min, max);
  const step = getStep(target);

  let numbers: number[];

  if (target === min) {
    numbers = Array.from({ length: maxStep }, (_, i) => min + i * step);
  } else if (target === max) {
    numbers = Array.from(
      { length: maxStep },
      (_, i) => max - (maxStep - 1 - i) * step
    );
  } else if (target - min < 2 * step) {
    numbers = Array.from({ length: maxStep }, (_, i) => min + i * step).slice(
      0,
      maxStep
    );
  } else if (max - target < 2 * step) {
    numbers = Array.from(
      { length: maxStep },
      (_, i) => max - (maxStep - 1 - i) * step
    ).slice(0, maxStep);
  } else {
    const middleIndex = Math.floor(maxStep / 2);
    numbers = Array.from(
      { length: maxStep },
      (_, i) => target + (i - middleIndex) * step
    );
  }

  return numbers.map((value) => ({
    value,
    isMin: value === min,
    isMax: value === max,
    isCurrent: value === target,
  }));
};

export default generateNeighboringNumbers;
