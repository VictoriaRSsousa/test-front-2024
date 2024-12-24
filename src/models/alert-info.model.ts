export class AlertInfo {
    constructor(

       public title?: string,
       public description?: string,
       public severity: "error" | "success" | "info" | "warning" = "error"
    ){}
  }


