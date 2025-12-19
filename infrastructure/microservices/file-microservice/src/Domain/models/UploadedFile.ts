import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("uploaded_files")
export class UploadedFile {
  @PrimaryGeneratedColumn()
  file_id?: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  original_file_name!: string;

  @Column({ type: "varchar", nullable: false, length: 100 })
  file_type!: string;

  @Column({ type: "varchar", nullable: false, length: 50 })
  file_extension!: string;

  @Column({ type: "int", nullable: false })
  author_id!: number;

  @Column({ type: "varchar", nullable: false, length: 500 })
  path_to_file!: string;
}