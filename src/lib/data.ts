// This file now only contains type definitions and mock functions
// that are still needed. The actual data is fetched from Firestore.

import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "management" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: Timestamp | Date | string; // Allow for Firestore Timestamp, Date object, or string
  status: "Active" | "Inactive";
  verificationStatus?: "New" | "Verified" | "Rejected"; // Verification status for the user
  // Asatizah specific fields
  contactNo?: string;
  gender?: "Male" | "Female";
  preferredLocations?: string[];
  availableDays?: string[];
  preferredTimeslots?: string[];
  referralSource?: string;
  preferredAudience?: string[];
  preferredSyllabus?: string[];
  canTeachSpecialNeeds?: "Yes" | "No";
  payNow?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: CourseModule[];
  teacherId: string;
  studentIds: string[];
}

export interface Group {
  id: string;
  name: string;
  location: string;
  teacherId: string;
  studentIds: string[];
}

// MOCK DATA is being phased out. Some functions might still use it temporarily.

export const users: User[] = [
  { id: "1", name: "Admin User", email: "admin@ihsan.edu", role: "admin", avatar: "https://picsum.photos/seed/avatar1/100/100", createdAt: "2023-01-15", status: "Active" },
  { 
    id: "3", 
    name: "Ustadh Ahmad", 
    email: "ahmad@ihsan.edu", 
    role: "teacher", 
    avatar: "https://picsum.photos/seed/avatar3/100/100", 
    createdAt: "2023-02-10", 
    status: "Active",
    preferredLocations: ["East", "Central"],
    availableDays: ["Weekends", "Evenings"]
  },
  { 
    id: "6", 
    name: "Ustadha Fatima", 
    email: "fatima@ihsan.edu", 
    role: "teacher", 
    avatar: "https://picsum.photos/seed/avatar6/100/100", 
    createdAt: "2023-03-05", 
    status: "Active",
    preferredLocations: ["West", "North"],
    availableDays: ["Weekdays", "Evenings"]
  },
  { 
    id: "8", 
    name: "Ustadh Bilal", 
    email: "bilal@ihsan.edu", 
    role: "teacher", 
    avatar: "https://picsum.photos/seed/avatar8/100/100", 
    createdAt: "2023-04-12", 
    status: "Active",
    preferredLocations: ["Central", "South"],
    availableDays: ["Weekends"]
  },
  { id: "4", name: "Student Ali", email: "ali@student.edu", role: "student", avatar: "https://picsum.photos/seed/avatar4/100/100", createdAt: "2023-05-20", status: "Active" },
  { id: "5", name: "Student Sarah", email: "sarah@student.edu", role: "student", avatar: "https://picsum.photos/seed/avatar5/100/100", createdAt: "2023-06-15", status: "Active" },
  { id: "7", name: "Student Omar", email: "omar@student.edu", role: "student", avatar: "https://picsum.photos/seed/avatar7/100/100", createdAt: "2023-07-01", status: "Active" },
  { id: "9", name: "Student Aisha", email: "aisha@student.edu", role: "student", avatar: "https://picsum.photos/seed/avatar9/100/100", createdAt: "2023-08-10", status: "Active" },
];

export const courses: Course[] = [
  {
    id: "C001",
    title: "Introduction to Islamic Jurisprudence",
    description: "A foundational course on the principles of Fiqh and its historical development.",
    thumbnail: "https://picsum.photos/seed/course1/600/400",
    teacherId: "3",
    studentIds: ["4", "5"],
    modules: [
      { id: "M1", title: "What is Fiqh?", content: "Detailed explanation of the meaning and scope of Fiqh." },
      { id: "M2", title: "Sources of Islamic Law", content: "Quran, Sunnah, Ijma, Qiyas." },
      { id: "M3", title: "The Four Madhhabs", content: "An overview of the major schools of thought." },
    ],
  },
  {
    id: "C002",
    title: "Arabic Language for Beginners",
    description: "Learn the basics of the Arabic alphabet, grammar, and simple conversation.",
    thumbnail: "https://picsum.photos/seed/course2/600/400",
    teacherId: "6",
    studentIds: ["4", "7"],
    modules: [
      { id: "M1", title: "The Alphabet (Alif-Baa-Taa)", content: "Mastering the 28 letters." },
      { id: "M2", title: "Basic Sentence Structure", content: "Forming nominal and verbal sentences." },
      { id: "M3", title: "Introduction to Grammar (Nahw)", content: "Understanding nouns, verbs, and particles." },
    ],
  },
];

export const groups: Group[] = [
    {
        id: "G01",
        name: "Al-Farabi Circle",
        location: "Community Hall, Main Campus",
        teacherId: "3",
        studentIds: ["4", "5"]
    },
    {
        id: "G02",
        name: "Ibn Khaldun Society",
        location: "Library Study Room 2",
        teacherId: "6",
        studentIds: ["4", "7"]
    }
]

// This function is now a mock and should be replaced with real user data from Firebase Auth
export const getCurrentUser = (): User => {
  return { id: "1", name: "Admin User", email: "admin@ihsan.edu", role: "admin", avatar: "https://picsum.photos/seed/avatar1/100/100", createdAt: "2023-01-15", status: "Active" };
};

// These functions still rely on mock data and will be updated later.
export const getUserById = (id: string): User | undefined => {
    return users.find(u => u.id === id);
}

export const getCourseById = (id:string): Course | undefined => {
    return courses.find(c => c.id === id);
}

export const getGroupById = (id:string): Group | undefined => {
    return groups.find(g => g.id === id);
}
