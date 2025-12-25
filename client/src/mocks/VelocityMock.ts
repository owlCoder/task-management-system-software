// VelocityMock.ts
import { mockSprints } from "./SprintMock";

// Funkcija koja vraća prosečnu brzinu tima kroz završene sprintove
export const getMockVelocityForProject = (projectId: number): number => {
    // Pronađi sprintove za projekat koji su završeni (pretpostavimo da svi imaju start i end date)
    const sprints = mockSprints.filter(
        (s) => s.project_id === projectId && new Date(s.end_date) <= new Date()
    );

    if (sprints.length === 0) return 0;

    // Sumiramo trajanje sprintova u satima
    const totalHours = sprints.reduce((sum, sprint) => {
        const start = new Date(sprint.start_date).getTime();
        const end = new Date(sprint.end_date).getTime();
        return sum + (end - start) / (1000 * 60 * 60); // milisekunde u sate
    }, 0);

    // Prosečna brzina tima po sprintu
    const avgHours = totalHours / sprints.length;

    // Za mock možemo i dodati random faktor da izgleda realnije
    const velocity = parseFloat((avgHours * (0.8 + Math.random() * 0.4)).toFixed(2));

    return velocity;
};
