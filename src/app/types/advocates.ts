export interface Advocates {
  city: string;
  createdAt: string;
  degree: string;
  firstName: string;
  id: number;
  lastName: string;
  phoneNumber: number;
  specialties: string[];
  yearsOfExperience: number;
}

export enum Fields {
  "First Name" = "firstName",
  "Last Name" = "lastName",
  "City" = "city",
  "Degree" = "degree",
  "Specialties" = "specialties",
  "Years of Experience" = "yearsOfExperience",
  "Phone Number" = "phoneNumber",
}
