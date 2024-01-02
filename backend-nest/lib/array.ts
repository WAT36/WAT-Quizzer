export function getDifferenceArray(arrayA: number[], arrayB: number[]) {
    const setA = new Set(arrayA)
    const setB = new Set(arrayB)
    return Array.from(new Set(
      [...setA].filter(element => !setB.has(element))
    ));
}