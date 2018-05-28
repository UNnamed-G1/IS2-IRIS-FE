import { SweetAlertType } from 'sweetalert2';

export interface Swal {
  title: string,
  text?: string,
  type: SweetAlertType,
  errorMsg?: boolean,
  confirm?: (() => void),
  confirmParams?: Array<any>
}