export class Department {
  id: number;
  name: string;
  // Relations
  faculty: Faculty;
  careers: Array<Career>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Career {
  id: number;
  name: string;
  snies_code: number;
  // Types
  degree_type: string;
  // Relations
  department: Department;
  users: Array<User>;
  research_groups: Array<ResearchGroup>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Event {
  id: number;
  name: string;
  topic: string;
  description: string;
  date: Date;
  duration: string;
  // Types
  event_type: string;  // Received
  type_ev: string;     // Send
  frequence: string;
  state: string;
  // Relations
  research_group: ResearchGroup;
  users: Array<User>;
  photos: Array<Photo>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Faculty {
  id: number;
  name: string;
  // Relations
  departments: Array<Department>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Photo {
  id: number;
  picture: string;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class ResearchGroup {
  id: number;
  name: string;
  description: string;
  strategic_focus: string;
  research_priorities: string;
  foundation_date: Date;
  date_classification: Date;
  url: string;
  // Types
  classification: string;
  // Relations
  photo: Photo;
  careers: Array<Career>;
  events: Array<Event>;
  publications: Array<Publication>;
  members: Array<Member>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class ResearchSubject {
  id: number;
  name: string;
  // Relations
  research_groups: Array<ResearchGroup>;
  users: Array<User>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Schedule {
  id: number;
  start_hour: Date;
  duration: TimeRanges;
  // Relations
  users: Array<User>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class Publication {
  id: number;
  name: string;
  date: Date;
  abstract: string;
  brief_description: string;
  document: Array<File>;
  // Type
  publication_type: string;  // Received
  type_pub: string;          // Send
  // Relations
  members: Array<User>;
  research_groups: Array<ResearchGroup>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export class User {
  id: number;
  name: string;
  lastname: string;
  username: string;
  password: string;
  password_confirmation: string;
  email: string;
  professional_profile: string;
  phone: string;
  office: string;
  cvlac_link: string;
  full_name: string;
  // Types
  user_type: string;   // Received
  type_u: string;      // Send
  // Relations
  career_id: number;
  photo: Photo;
  career: Career;
  events: Array<Event>;
  publications: Array<Publication>;
  research_groups: Array<ResearchGroup>;
  research_subjects: Array<ResearchSubject>;
  following: Array<User>;
  followers: Array<User>;
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

/* Join Tables */

class Member {
  joining_date: Date;
  end_joining_date: Date;
  // Relations
  user_id: number;
  research_group_id: number;
  user: User;
  research_group: ResearchGroup;
  // Types
  state: string;
  member_type: string;  // Received
  type_urg: string;     // Send
  // Timestamps
  created_at: Date;
  updated_at: Date;
}
