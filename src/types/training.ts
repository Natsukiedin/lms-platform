export type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string | null; // SuperAdmin might not have a specific tenantId, or their tenantId represents the platform
  companyName: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  cloudflareVideoId: string;
}

export interface CourseLicense {
  tenantId: string;
  courseId: string;
  deadline: string | null; // ISO string
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  questions: Question[];
  passingScore: number;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  userId: string;
  courseId: string;
  tenantId: string;
  progressPercent: number;
  status: ProgressStatus;
  quizScore: number | null;
  feedback: string | null;
  completedAt: string | null;
}

export interface Report {
  tenantId: string;
  totalUsers: number;
  averageCompletionRate: number;
  averageQuizScore: number;
  incompleteUsers: number;
}
