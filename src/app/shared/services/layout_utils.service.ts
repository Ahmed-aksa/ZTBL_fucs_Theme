// Angular
import {Injectable} from '@angular/core';

import {
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    AlertDialogWarnComponent,
    AlertDialogConfirmationComponent,
    AlertDialogCaptureComponent, AlertDialogComponent, AlertMessageComponent, AlertDialogSuccessComponent
} from "../crud";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

export enum MessageType {
    Create,
    Read,
    Update,
    Delete
}

@Injectable()
export class LayoutUtilsService {
    /**
     * Service constructor
     *
     * @param snackBar: MatSnackBar
     * @param dialog: MatDialog
     */
    constructor(private snackBar: MatSnackBar,
                private dialog: MatDialog) {
    }

    /**
     * Showing (Mat-Snackbar) Notification
     *
     * @param message: string
     * @param type: MessageType
     * @param duration: number
     * @param showCloseButton: boolean
     * @param showUndoButton: boolean
     * @param undoButtonDuration: number
     * @param verticalPosition: 'top' | 'bottom' = 'top'
     */
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
            //showUndoButton: _showUndoButton,
            //undoButtonDuration: _undoButtonDuration,
            verticalPosition: _verticalPosition,
            type: _type,
            action: 'Undo'
        };
        return this.snackBar.openFromComponent(ActionNotificationComponent, {
            duration: _duration,
            data: _data,
            verticalPosition: _verticalPosition
        });
    }

    /**
     * Showing Confirmation (Mat-Dialog) before Entity Removing
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    deleteElement(title: string = '', description: string = '', waitDesciption: string = '') {
        return this.dialog.open(DeleteEntityDialogComponent, {
            data: {title, description, waitDesciption},
            width: '440px'
        });
    }

    AlertElementWarn(title: string = '', description: string = '', waitDesciption: string = '', bit: number = 0) {
        return this.dialog.open(AlertDialogWarnComponent, {
            data: {title, description, waitDesciption, bit},
            width: '440px'
        });
    }


    AlertElementConfirmation(title: string = '', description: string = '', waitDesciption: string = '') {
        return this.dialog.open(AlertDialogConfirmationComponent, {
            data: {title, description, waitDesciption},
            width: '440px'
        });
    }

    AlertElementCapture(title: string = '', description: string = '', waitDesciption: string = '') {
        return this.dialog.open(AlertDialogCaptureComponent, {
            data: {title, description, waitDesciption},
            width: '440px'
        });
    }

    /**
     * Showing Confirmation (Mat-Dialog) before Entity Removing
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */

    alertElement(title: string = '', description: string = '', code: string = '') {

        return this.dialog.open(AlertDialogComponent, {
            data: {title, description, code},
            width: '440px',
            height: '450px'
        });
    }

    alertMessage(title: string = '', description: string = '') {

        return this.dialog.open(AlertMessageComponent, {
            data: {title, description},
            width: '440px'
        });
    }


    alertElementSuccess(title: string = '', description: string = '', code: string = '') {

        return this.dialog.open(AlertDialogSuccessComponent, {
            data: {title, description, code},
            width: '440px'
        });
    }

    /**
     * Showing Fetching Window(Mat-Dialog)
     *
     * @param _data: any
     */
    fetchElements(_data) {
        return this.dialog.open(FetchEntityDialogComponent, {
            data: _data,
            width: '400px'
        });
    }

    /**
     * Showing Update Status for Entites Window
     *
     * @param title: string
     * @param statuses: string[]
     * @param messages: string[]
     */
    updateStatusForEntities(title, statuses, messages) {
        return this.dialog.open(UpdateStatusDialogComponent, {
            data: {title, statuses, messages},
            width: '480px'
        });
    }
}
