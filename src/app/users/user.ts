import { Career } from 'app/classes/career'

export class User {
  public id: number;
  public name: string;
  public lastname: string;
  public username: string;
  public password: string;
  public email: string;
  public professional_profile: string;
  public phone: string;
  public office: string;
  public cvlac_link: string;
  public full_name: string;
  public user_type: number;
  public career_id: number;
  public career: Career;
}
