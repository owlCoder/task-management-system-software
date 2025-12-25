import { Repository } from "typeorm";
import { ITaskService } from "../Domain/services/ITaskService";
import { Task } from "../Domain/models/Task";  
import { TaskStatus } from "../Domain/enums/TaskStatus";
import { Result } from "../Domain/types/Result";
import { ErrorCode } from "../Domain/enums/ErrorCode";
export class TaskService implements ITaskService {

    constructor(
        private readonly taskRepository: Repository<Task>,
    ) {}
//#region Dummy data for development

   private readonly dummyTasks: Task[] = [
    {
        task_id: 1,
        sprint_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 1",
        task_description: "Opis dummy taska 1",
        task_status: TaskStatus.IN_PROGRESS,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 1, user_id: 5, comment: "Pocetni komentar na task 1",created_at: new Date()},
            { comment_id: 2, user_id: 10, comment: "Project manager dodaje napomenu", created_at: new Date()}
        ]
    },
    {
        task_id: 2,
        sprint_id: 100,
        worker_id: 5,
        project_manager_id: 10,
        title: "Dummy task 2",
        task_description: "Opis dummy taska 2",
        task_status: TaskStatus.IN_PROGRESS,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 3, user_id: 5, comment: "Komentar radnika na task 2", created_at: new Date() }
        ]
    },
    {
        task_id: 3,
        sprint_id: 100,
        worker_id: 6,
        project_manager_id: 11,
        title: "Dummy task 3",
        task_description: "Opis dummy taska 3",
        task_status: TaskStatus.CREATED,
        attachment_file_uuid: 1,
        estimated_cost: 10,
        total_hours_spent: 15,
        created_at: new Date(),
        comments: [
            { comment_id: 4, user_id: 6, comment: "Prvi komentar na novi task", created_at: new Date()   },
            { comment_id: 5, user_id: 11, comment: "Project manager dodaje instrukcije", created_at: new Date() }
        ]
    }
];


//#endregion
    //#region  TASK METHODS
    async getAllTasksForSprint(sprint_id: number) : Promise<Result<Task[]>>{
        try {
            //TODO: Proveriti da li korisnik ima pravo da vidi taskove za dati projekat
            //TODO: proveriti da li projekat postoji
            const tasks = await this.taskRepository.find({
                where: { sprint_id },
                relations: ["comments"]
            });
            return {success: true,data : tasks}
        } catch (error) {
            return {success: false,errorCode:ErrorCode.NONE}
        }
    }
    
    
    async addTaskForSprint(sprint_id: number, worker_id: number, project_manager_id : number, title: string, task_description: string, estimated_cost: number): Promise<Result<Task>> {
        //Estimated cost mozda da se izracuna popust (cena sata radnika) * (broj sati ocekivanih za zadatak)
            //TODO: Proveriti da li projekat postoji
            //TODO: Proveriti da li worker postoji i da li je dodeljen na dati projekat
        if (!title || title.trim().length === 0) {
            throw new Error("Title is required");
        }
        if (!task_description || task_description.trim().length === 0) {
            throw new Error("Task description is required");
        }
        //Treba videti sa ostalima kako ovo da se izracuna,da li moj servis ili da to dodje kao parametar
        if (estimated_cost < 0) {
            throw new Error("Estimated cost cannot be negative");
        }

        const newTask = this.taskRepository.create({
            sprint_id,
            worker_id,
            project_manager_id,
            title,
            task_description,
            estimated_cost,
            task_status: TaskStatus.CREATED,
            total_hours_spent: 0
        });

        const savedTask = await this.taskRepository.save(newTask);
        return {success: true,data: savedTask};
    }
    async getAllDummyTasksForSprint() : Promise<Result<Task[]>>{
        //Vracamo dummy podatke ako nema zadataka u bazi dok smo u developmentu
            return {success:true,data:this.dummyTasks};
    }

    async getTaskById(task_id: number): Promise<Result<Task>> {
        try {
            const task = await this.taskRepository.findOne({
                where: { task_id },
                relations: ["comments"]
            });
            console.log(task);
            if (!task) {
                return {success:false,errorCode: ErrorCode.TASK_NOT_FOUND};
            }
            return {success: true,data: task}
        } catch (error) {
            console.log(error);
            return {success:false,errorCode: ErrorCode.INTERNAL_ERROR};

        }
    }
    

    //#endregion
}

