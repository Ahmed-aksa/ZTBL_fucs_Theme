import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
    AlertDialogComponent,
    AlertDialogSuccessComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent
} from '../crud';


export enum MessageType {
    Create,
    Read,
    Update,
    Delete
}

@Injectable()
export class LayoutUtilsService {
    constructor(private snackBar: MatSnackBar,
                private dialog: MatDialog) {
    }


    showActionNotification(
        _message: string,
        _type: MessageType = MessageType.Create,
        _duration: number = 10000,
        _showCloseButton: boolean = true,
        _showUndoButton: boolean = true,
        _undoButtonDuration: number = 3000,
        _verticalPosition: 'top' | 'bottom' = 'bottom'
    ) {
        const _data = {
            message: _message,
            snackBar: this.snackBar,
            showCloseButton: _showCloseButton,
            verticalPosition: _verticalPosition,
            type: _type,
            action: 'Undo'
        };
        // return this.snackBar.openFromComponent(ActionNotificationComponent, {
        //   duration: _duration,
        //   data: _data,
        //   verticalPosition: _verticalPosition
        // });
    }

    deleteElement(title: string = '', description: string = '', waitDesciption: string = '') {
        return this.dialog.open(DeleteEntityDialogComponent, {
            data: {title, description, waitDesciption},
            width: '440px'
        });
    }

    alertElement(title: string = '', description: string = '', code: string = '') {
        return this.dialog.open(AlertDialogComponent, {
            data: {title, description, code},
            width: '440px'
        });
    }

    alertElementSuccess(title: string = '', description: string = '', code: string = '') {

        return this.dialog.open(AlertDialogSuccessComponent, {
            data: {title, description, code},
            width: '440px'
        });
    }

    fetchElements(_data) {
        return this.dialog.open(FetchEntityDialogComponent, {
            data: _data,
            width: '400px'
        });
    }

}
