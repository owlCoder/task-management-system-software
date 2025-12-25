import type { BurnupDto } from "../models/analytics/BurnupDto";
import { getMockTasksBySprint } from "./TaskMock";
import { mockSprints } from "./SprintMock";
import { BurnupPointDto } from "../models/analytics/BurnupPointDto";

export const getMockBurnupBySprint = (sprintId: number): BurnupDto => {
    const sprint = mockSprints.find((s) => s.sprint_id === sprintId);
    if (!sprint) throw new Error("Sprint not found in mock data");

    const { start_date: start, end_date: end, project_id } = sprint;

    const sprintDuration = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ); // broj dana sprinta

    const tasks = getMockTasksBySprint(sprintId);

    const totalWork = tasks.reduce((sum, t) => sum + t.estimated_cost!, 0);

    const today = new Date();
    const points: BurnupPointDto[] = [];

    // prolazimo kroz svaki dan sprinta
    for (let day = 0; day <= sprintDuration; day++) {
        const currentDate = new Date(start.getTime());
        currentDate.setDate(start.getDate() + day);

        // kumulativni work do tog dana
        let cumulativeWork = 0;
        tasks.forEach((t) => {
            if (t.finished_at && t.finished_at <= currentDate) {
                // ako je završeno do trenutnog dana
                cumulativeWork += t.estimated_cost!;
            } else if (!t.finished_at && t.progress && t.progress > 0) {
                // task u toku: uračunavamo deo posla proporcionalno progresu
                cumulativeWork += Math.round((t.progress / 100) * t.estimated_cost!);
            }
        });

        points.push({
            x: day + 1, // da dan 0 ne postoji
            y: cumulativeWork,
        });
    }

    return {
        project_id,
        sprint_id: sprintId,
        sprint_duration_date: sprintDuration,
        work_amount: totalWork,
        points,
    };
};
