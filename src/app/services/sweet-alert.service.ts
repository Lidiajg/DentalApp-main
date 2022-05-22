import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  alert(icon: SweetAlertIcon, text: string, time: number) {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (resp) => {
          resp.addEventListener('mouseenter', Swal.stopTimer);
          resp.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    toast.fire({
        icon,
        title: text
    });
}
}
