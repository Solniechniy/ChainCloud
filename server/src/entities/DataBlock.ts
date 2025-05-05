import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("data_blocks")
export class DataBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", unique: true })
  blockIndex: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "int", default: 0 })
  accessCount: number;

  @Column({ type: "varchar", length: 64, nullable: true })
  latestDataHash: string;

  @Column({ type: "timestamp", nullable: true })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
