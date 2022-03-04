import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-apk-deployment',
    templateUrl: './apk-deployment.component.html',
    styleUrls: ['./apk-deployment.component.scss']
})
export class ApkDeploymentComponent implements OnInit {
    image;
    video;
    pdf;
    apk;

    constructor(
        private layoutUtilsService: LayoutUtilsService,
        private cdRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

    }

    // onFileChangeBkp(event, type) {
    //
    //     if (event.target.files && event.target.files[0]) {
    //         var filesAmount = event.target.files.length;
    //         var file = event.target.files[0];
    //
    //         var Name = file.name.split('.').pop();
    //         if (Name != undefined) {
    //             if(type == 'image'){
    //                 if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "png" || Name.toLowerCase() == "jpeg") {
    //
    //                     for (let i = 0; i < filesAmount; i++) {
    //                         var reader = new FileReader();
    //
    //                         reader.onload = (event: any) => {
    //                             //this.images.push(event.target.result);
    //                             this.image = file;
    //                         }
    //                         reader.readAsDataURL(event.target.files[i]);
    //                     }
    //                     this.cdRef.detectChanges();
    //                 } else {
    //                     this.layoutUtilsService.alertElement('', 'Only jpeg, png, jpg files are allowed');
    //
    //                     return;
    //                 }
    //             }else if(type == 'video'){
    //                 if (Name.toLowerCase() == "mp4" || Name.toLowerCase() == "webm" || Name.toLowerCase() == "mkv") {
    //
    //                     for (let i = 0; i < filesAmount; i++) {
    //                         var reader = new FileReader();
    //
    //                         reader.onload = (event: any) => {
    //                             //this.images.push(event.target.result);
    //                             this.video = file;
    //                         }
    //                         reader.readAsDataURL(event.target.files[i]);
    //                     }
    //                     this.cdRef.detectChanges();
    //                 } else {
    //                     this.layoutUtilsService.alertElement('', 'Only mp4, webm, mkv files are allowed');
    //
    //                     return;
    //                 }
    //             }else if(type == 'pdf'){
    //                 if (Name.toLowerCase() == "pdf") {
    //
    //                     for (let i = 0; i < filesAmount; i++) {
    //                         var reader = new FileReader();
    //
    //                         reader.onload = (event: any) => {
    //                             //this.images.push(event.target.result);
    //                             this.pdf = file;
    //                         }
    //                         reader.readAsDataURL(event.target.files[i]);
    //                     }
    //                     this.cdRef.detectChanges();
    //                 } else {
    //                     this.layoutUtilsService.alertElement('', 'Only pdf file is allowed');
    //
    //                     return;
    //                 }
    //             }else if(type == 'apk'){
    //                 if (Name.toLowerCase() == "apk") {
    //
    //                     for (let i = 0; i < filesAmount; i++) {
    //                         var reader = new FileReader();
    //
    //                         reader.onload = (event: any) => {
    //                             //this.images.push(event.target.result);
    //                             this.apk = file;
    //                         }
    //                         reader.readAsDataURL(event.target.files[i]);
    //                     }
    //                     this.cdRef.detectChanges();
    //                 } else {
    //                     this.layoutUtilsService.alertElement('', 'Only apk is file allowed');
    //
    //                     return;
    //                 }
    //             }
    //             console.log()
    //         }
    //
    //     }
    // }

    onFileChange(event) {

        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            var file = event.target.files[0];

            var Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == "jpg" || Name.toLowerCase() == "png" || Name.toLowerCase() == "jpeg") {

                    for (let i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = (event: any) => {
                            //this.images.push(event.target.result);
                            this.image = file;
                        }
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else if (Name.toLowerCase() == "mp4" || Name.toLowerCase() == "webm" || Name.toLowerCase() == "mkv") {

                    for (let i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = (event: any) => {
                            //this.images.push(event.target.result);
                            this.video = file;
                        }
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else if (Name.toLowerCase() == "pdf") {

                    for (let i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = (event: any) => {
                            //this.images.push(event.target.result);
                            this.pdf = file;
                        }
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else if (Name.toLowerCase() == "apk") {

                    for (let i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = (event: any) => {
                            //this.images.push(event.target.result);
                            this.apk = file;
                        }
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    this.cdRef.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement('', 'Please upload Image (png, jpg, jpeg), Video (mp4, webm, mkv), PDF or APK');

                    return;
                }
                console.log()
            }

        }
    }

    Upload() {
    }

    downloadFile() {
    }

}
