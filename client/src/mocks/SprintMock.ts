import { SprintDTO } from "../models/sprint/SprintDto";


export const mockSprints: SprintDTO[] = [
    // ===== PROJECT 1 ===== (2 sprinta, po 4 nedelje)
    {
        sprint_id: 1,
        project_id: 1,
        sprint_title: "Sprint 1",
        sprint_description: "Planning & core setup",
        start_date: new Date("2024-06-01"),
        end_date: new Date("2024-06-28"),
    },
    {
        sprint_id: 2,
        project_id: 1,
        sprint_title: "Sprint 2",
        sprint_description: "Feature development",
        start_date: new Date("2024-06-29"),
        end_date: new Date("2024-07-26"),
    },

    // ===== PROJECT 2 ===== (3 sprinta, po 7 dana)
    {
        sprint_id: 3,
        project_id: 2,
        sprint_title: "Sprint 1",
        sprint_description: "Audio preparation",
        start_date: new Date("2024-07-01"),
        end_date: new Date("2024-07-07"),
    },
    {
        sprint_id: 4,
        project_id: 2,
        sprint_title: "Sprint 2",
        sprint_description: "Mixing & editing",
        start_date: new Date("2024-07-08"),
        end_date: new Date("2024-07-14"),
    },
    {
        sprint_id: 5,
        project_id: 2,
        sprint_title: "Sprint 3",
        sprint_description: "QA & delivery",
        start_date: new Date("2024-07-15"),
        end_date: new Date("2024-07-21"),
    },
];

export const getMockSprintsByProject = (projectId: number) =>
    mockSprints.filter((s) => s.project_id === projectId);
