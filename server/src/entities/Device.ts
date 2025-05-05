import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("devices")
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  publicKey: string;

  @Column({ type: "int", default: 0 })
  lastBlockSync: number;

  @Column({ type: "int", nullable: true })
  dataBlockIndex: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: "varchar", nullable: true })
  dataHash: string;

  @Column({ type: "timestamp", nullable: true })
  lastSeen: Date;

  @Column({ type: "int", default: 0 })
  providedResponses: number;

  @Column({ type: "decimal", precision: 18, scale: 9, default: 0 })
  rewardEarned: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
