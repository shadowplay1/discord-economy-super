const squadsScores: number[] = [120, 112, 100, 100, 100, 95, 70]
const squads: string[] = []

function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

let prevScore = 0;
let prevPosition = 0;

for (let i = 0; i < squadsScores.length; i++) {
    const score = squadsScores[i];
    const position = i + 1;

    if (score === prevScore) {
        squads.push(`=${getOrdinal(prevPosition)}`);
    } else {
        squads.push(`${getOrdinal(position)}`);
        prevPosition = position;
    }

    prevScore = score;
}

console.log(squads);
