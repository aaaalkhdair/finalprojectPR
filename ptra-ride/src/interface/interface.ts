export enum userrole {
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}
export interface CreatUser {
  fname: string;
  lname: string;
  email: string;
  password: string;
  userrole: userrole;
}
export interface UpdateUser {
  fname?: string;
  lname?: string;
  email?: string;
  password?:string;
} 
export interface Login {
  email : string;
  password : string;
}
