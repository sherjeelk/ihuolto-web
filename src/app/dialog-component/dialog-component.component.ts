import {Component, Inject, OnInit} from '@angular/core';
import {DataserviceService} from "../services/dataservice.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponentComponent implements OnInit {


  constructor(public  dataShare : DataserviceService, @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DialogComponentComponent>,) { }

  ngOnInit(): void {
  }
  close(type: number) {
    if (type === 1) {
      this.dataShare.removeProduct(this.data.data);
      this.dataShare.index = 0;
      this.dialogRef.close();
    } else {
      this.dialogRef.close();
    }


  }

  changeSize(type: number) {
    if (type === 1) {
      this.dataShare.serviceData.brandValue = [];
      this.dataShare.total = 0;
      this.dataShare.subTotal = 0;
      this.dialogRef.close(1);
    } else {
      this.dialogRef.close(2);
    }

  }
}
