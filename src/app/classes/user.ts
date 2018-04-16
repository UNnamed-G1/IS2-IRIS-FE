import { Career } from 'app/classes/career'
import { ResearchSubject } from 'app/classes/research-subject'

export class User {
  public id: number;
  public name: string;
  public lastname: string;
  public username: string;
  public password: string;
  public password_confirmation: string;
  public email: string;
  public professional_profile: string;
  public phone: string;
  public office: string;
  public cvlac_link: string;
  public full_name: string;
  public user_type: string;
  public career_id: number;
  public research_subjects: ResearchSubject[];
  public career: Career;
}
