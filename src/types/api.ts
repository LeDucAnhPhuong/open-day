// API Response Types for CSS Battle

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
}

export enum MemberRole {
  HOST = "host",
  PARTICIPANT = "participant",
}

// User/Auth Types
export interface User {
  _id: string;
  studentId: string;
  name: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  studentId: string;
  password: string;
}

export interface RegisterDto {
  studentId: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

// Challenge Types
export interface Challenge {
  _id: string;
  image: string;
  level: ChallengeLevel;
  materials?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeDto {
  image: string;
  materials?: string[];
}

export interface UpdateChallengeDto {
  image?: string;
  materials?: string[];
}

// Event Types
export interface Event {
  id: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  eventCode: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  startTime: string;
  endTime: string;
}

export interface JoinEventDto {
  code: string;
}

export interface MemberEvent {
  id: string;
  studentId: string;
  eventId: string;
  eventCode: string;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
}

// Battle Types
export interface Battle {
  id: string;
  eventId: string;
  eventCode: string;
  studentId: string;
  point: number;
  time: Date;
  hp: number;
  stage: number;
  isLive: boolean;
}

export interface BattleRecord {
  id: string;
  eventId: string;
  eventCode: string;
  stage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Socket Events
export interface ChatMessage {
  eventCode: string;
  studentId: string;
  msg: string;
  createdAt: Date;
}

export interface BattleUpdate {
  stage: number;
  challenge?: Challenge;
  challenges?: Record<string, Challenge>;
}

export interface BattleResult {
  studentId: string;
  eventCode: string;
  point: number;
  hp: number;
  stage: number;
  time: Date;
}

// API Error Response
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

// Generic API Response
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: ApiError;
}

// Upload Types
export interface UploadResponse {
  message: string;
  filename: string;
  originalName: string;
  size: number;
  url: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export enum ChallengeLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface CreateChallengeDto {
  image: string;
  materials?: string[];
}

export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {
  id?: string;
}

export interface Material {
  id: string;
  color: string;
  name: string;
  region: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dominance: number; // percentage of how much this color appears in the region
}

export interface MaterialAnalysisResult {
  materials: Material[];
  totalRegions: number;
  processingTime: number;
}
