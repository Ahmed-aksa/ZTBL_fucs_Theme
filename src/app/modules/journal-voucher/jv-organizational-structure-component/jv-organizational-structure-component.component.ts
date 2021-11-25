import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {JournalVoucherService} from '../services/journal_voucher.service';
import {CollectionViewer, SelectionChange, SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FlatTreeControl} from "@angular/cdk/tree";
import {map} from "rxjs/operators";

export class DynamicFlatNode {
    constructor(
        public item: string,
        public level = 1,
        public expandable = false,
        public isLoading = false,
        public id: string = "50000"
    ) {

    }
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: "root" })
export class DynamicDatabase {
    /** Initial data from database */
    initialData(): DynamicFlatNode[] {

        return this.rootLevelNodes.map(
            (name) => new DynamicFlatNode(name, 0, true)
        );
    }
    //this.jv.getChildNodesWithCode()
    rootLevelNodes: string[] = ["ZTBL"];
    constructor(public _journalVoucherService: JournalVoucherService) {}
    dataMap = new Map<string, string[]>([]);

    async getChildren(node: string, id: string) {

        let baseResponse = await this._journalVoucherService.getChildNodesWithCode(
            id
        );
        this.cheeck(baseResponse, node);

        return this.dataMap.get(node);
    }

    cheeck(baseResponse, node) {
        var myTreeElements = [];
        if (baseResponse.Success == true) {
            baseResponse.JournalVoucher.ChildNodesList.forEach((element) => {

                myTreeElements.push(element.Description + "-" + element.OrgUnitID);
            });

            this.dataMap.set(node, myTreeElements);
        }
    }

    async getChildren_bkp(node: string, id: string) {


        let baseResponse = await this._journalVoucherService.getChildNodesWithCode(
            id
        );
        return baseResponse;
        // var myTreeElements =[];
        // if (baseResponse.Success === true) {
        //   
        //   baseResponse.JournalVoucher.ChildNodesList.forEach(element => {
        //
        //     myTreeElements.push(element.Description +'-'+element.OrgUnitID);
        //   });
        //   //push data
        //   this.dataMap.set(node, myTreeElements);
        //   //isLoading = true;
        // }

        // else {
        // }

        //let myId;
        // this._journalVoucherService
        // .getChildNodesWithCode(id)
        // .pipe(
        //   finalize(() => {

        //   })
        // )
        // .subscribe((baseResponse: BaseResponseModel) => {
        //
        //   var myTreeElements =[];
        //   if (baseResponse.Success === true) {
        //     
        //     baseResponse.JournalVoucher.ChildNodesList.forEach(element => {
        //
        //       myTreeElements.push(element.Description +'-'+element.OrgUnitID);
        //     });
        //     //push data
        //     this.dataMap.set(node, myTreeElements);
        //     //isLoading = true;
        //   }

        //   else {
        //   }

        // },
        //   (error) => {
        //
        //     
        //   });
        // return this.dataMap.get(node);
    }

    isExpandable(node: string): boolean {
        return true;
        //return this.dataMap.has(node);
    }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable({ providedIn: "root" })
export class DynamicDataSource {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] {
        return this.dataChange.value;
    }
    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(
        private _treeControl: FlatTreeControl<DynamicFlatNode>,
        private _database: DynamicDatabase
    ) {}

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe((change) => {
            if (
                (change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed
            ) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(
            map(() => this.data)
        );
    }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach((node) => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed
                .slice()
                .reverse()
                .forEach((node) => this.toggleNode(node, false));
        }
    }

    /**
     * Toggle the node, remove from display list
     */
    async toggleNode(node: DynamicFlatNode, expand: boolean) {

        const children = await this._database.getChildren(node.item, node.id);
        const index = this.data.indexOf(node);
        if (!children || index < 0) {
            // If no children, or cannot find the node, no op
            return;
        }
        node.isLoading = true;

        setTimeout(() => {
            if (expand) {
                const nodes = children.map(
                    (name) =>
                        new DynamicFlatNode(
                            name,
                            node.level + 1,
                            this._database.isExpandable(name),
                            false,
                            name.slice(name.lastIndexOf("-") + 1, name.length).toString()
                        )
                );

                this.data.splice(index + 1, 0, ...nodes);
            } else {
                let count = 0;
                for (
                    let i = index + 1;
                    i < this.data.length && this.data[i].level > node.level;
                    i++, count++
                ) {}
                this.data.splice(index + 1, count);
            }

            // notify the change
            this.dataChange.next(this.data);
            node.isLoading = false;
        }, 1000);
    }
}

@Component({
    selector: 'app-jv-organizational-structure-component',
    templateUrl: './jv-organizational-structure-component.component.html',
    styleUrls: ['./jv-organizational-structure-component.component.scss'],
    providers: [DynamicDatabase],
})
export class JvOrganizationalStructureComponentComponent implements OnInit {
    treeClick: any;
    treeCode: any;

    constructor(
        database: DynamicDatabase,
        public dialogRef: MatDialogRef<JvOrganizationalStructureComponentComponent>,
        public _journalVoucherService: JournalVoucherService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        this.treeControl = new FlatTreeControl<DynamicFlatNode>(
            this.getLevel,
            this.isExpandable
        );
        this.dataSource = new DynamicDataSource(this.treeControl, database);
        this.dataSource.data = database.initialData();
    }

    treeControl: FlatTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    getLevel = (node: DynamicFlatNode) => {
        return node.level;
    };

    isExpandable = (node: DynamicFlatNode) => {
        return node.expandable;
    };

    hasChild = (_: number, _nodeData: DynamicFlatNode) => {
        return _nodeData.expandable;
    };
    checklistSelection = new SelectionModel<DynamicFlatNode>(true /* multiple */);

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: DynamicFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some((child) =>
            this.checklistSelection.isSelected(child)
        );
        return result && !this.descendantsAllSelected(node);
    }

    todoItemSelectionToggle(node: DynamicFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every((child) => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: DynamicFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: DynamicFlatNode): void {
        let parent: DynamicFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: DynamicFlatNode): DynamicFlatNode | null {

        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {

            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: DynamicFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every((child) => {
                return this.checklistSelection.isSelected(child);
            });
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: DynamicFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every((child) => {
                return this.checklistSelection.isSelected(child);
            });
        return descAllSelected;
    }

    ngOnInit() {
    }

    onSelect() {

        this.treeClick = this.checklistSelection.selected;
        let itemArr = [];
        this.treeClick.forEach((element) => {
            let obj = element.item.slice(
                element.item.lastIndexOf(":") + 2,
                element.item.indexOf("-")
            );
            this.treeCode = obj;
        });
        this.close(this.treeCode);
    }

    close(result: any): void {
        this.dialogRef.close(result);
    }
}
