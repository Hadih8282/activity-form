import { Component, Input, OnInit } from '@angular/core';
import {
  GetActivitiesByRoleIdModel,
  RoleActivitiesModel,
} from '../../../@core/models/sso/activity.model';
import { FindUserModel } from '../../../@core/models/sso/user-role.model';
import { ActivityService } from '../../../@core/services/api/sso/activity.service';
import { UserRoleService } from '../../../@core/services/api/sso/user-role.service';
import { I18nService } from '../../../@core/services/app/i18n.service';
import { NotificationService } from '../../../@core/services/app/notification.service';
import { CheckboxButtonRendererComponent } from '../../../shared/components/cell-renderer/checkbox-button-renderer/checkbox-button-renderer.component';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
})
export class ActivityFormComponent implements OnInit {
  @Input() id;
  @Input() dialogRef;
  @Input() context;
  all: GetActivitiesByRoleIdModel[];
  data: GetActivitiesByRoleIdModel[];
  title: string;
  roleActivities: RoleActivitiesModel;
  rowData = [];
  rowSelection;
  frameworkComponents;
  gridOption: any;

  constructor(
    private activityService: ActivityService,
    private notif: NotificationService,
    private appTranslate: I18nService,
  ) {
    this.gridOption = {
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
      animateRows: true,
      debug: false,
      context: {
        componentParent: this,
      },
      columnDefs: [
        // {
        //   headerName: '',
        //   field: 'isSpecial',
        //   resizable: true,
        //   width: 82,
        //   cellRenderer: 'showEditRenderer',
        //   cellRendererParams: {
        //     type: 'checkmark',
        //     propEdit: false,
        //     property: 'isSpecial',
        //   },
        // },



        { headerName: 'منو انگلیسی', field: 'activityName' },
        { headerName: 'منو فارسی', field: 'activityNationalName' },
        // {
        //   headerName: 'نمایش',
        //   maxWidth: 80,
        //   field: 'isView',
        //   cellRenderer: 'checkboxCellRenderer',
        //   cellRenderer: function (params) {
        //     var input = document.createElement('input');
        //     input.type = 'checkbox';
        //     input.checked = params.data.isView;
        //     input.addEventListener('click', function (event) {
        //       params.data.isView = !params.data.isView;
        //     });
        //     return input;
        //   },
        // },
        {
          headerName: 'نمایش',
          field: 'hasAccess',
          maxWidth: 150,
          editable: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: false,
          // checkboxSelection: true,
          cellRenderer: (params) => {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = params.data.hasAccess;
            input.addEventListener('click', (event) => {
              this.rowSelect(event , params)
              // params.data.hasAccess = !params.data.hasAccess;
            });
            return input;
          }
        },
        {
          headerName: 'درج',
          maxWidth: 80,
          field: 'isInsert',
          // cellRenderer: 'checkboxCellRenderer',
          cellRenderer: function (params) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = params.data.hasAccess ? params.data.isInsert : false;
            input.addEventListener('click', function (event) {
              params.data.isInsert = !params.data.isInsert;
            });
            return input;
          },
        },
        {
          headerName: 'ویرایش',
          maxWidth: 80,
          field: 'isUpdate',
          // cellRenderer: 'checkboxCellRenderer',
          cellRenderer: function (params) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = params.data.isUpdate;
            input.addEventListener('click', function (event) {
              params.data.isUpdate = !params.data.isUpdate;
            });
            return input;
          },
        },
        {
          headerName: 'حذف',
          maxWidth: 80,
          field: 'isDelete',
          // cellRenderer: 'checkboxCellRenderer',
          cellRenderer: function (params) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = params.data.isDelete;
            input.addEventListener('click', function (event) {
              params.data.isDelete = !params.data.isDelete;
            });
            return input;
          },
        },
      ],
      onCellClicked: (e) => {

      },
      // getRowStyle: function (params) {
      //   if (params.node.rowIndex % 2 === 0) {
      //     return { background: '#dfffdf' };
      //   }
      // },
      onRowDataChanged: (event) => {
        event.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.hasAccess) {
            rowNode.setSelected(true);
            rowNode.data.hasAccess = !rowNode.data.hasAccess;
          }
        });
      },
    };

    this.frameworkComponents = {
      checkboxCellRenderer: CheckboxButtonRendererComponent,
    };
  }

  // columnDefs = [
  //   {
  //     headerName: 'انتخاب',
  //     field: 'hasAccess',
  //     maxWidth: 120,
  //     headerCheckboxSelection: true,
  //     headerCheckboxSelectionFilteredOnly: true,
  //     CheckboxSelection: true,

  //   },
  //   { headerName: 'منو انگلیسی', field: 'activityName' },
  //   { headerName: 'منو فارسی', field: 'activityNationalName', maxWidth: 120 },
  //   {
  //     headerName: 'نمایش',
  //     field: 'isView',
  //     cellRenderer: 'checkboxRenderer',
  //     //   cellRenderer: function(params) {
  //     //     var input = document.createElement('input');
  //     //     input.type="checkbox";
  //     //     input.checked=params.data.isView;
  //     //     input.addEventListener('click', function (event) {
  //     //         params.data.isView=!params.data.isView;
  //     //     });
  //     //     return input;
  //     // }
  //   },

  //   {
  //     headerName: 'درج',
  //     field: 'isInsert',
  //     cellRenderer: 'checkboxRenderer',
  //   },
  //   {
  //     headerName: 'ویرایش',
  //     field: 'isUpdate',
  //     cellRenderer: 'checkboxRenderer',
  //   },
  //   {
  //     headerName: 'حذف',
  //     field: 'isDelete',
  //     cellRenderer: 'checkboxRenderer',
  //   },
  // ];

  defaultColDef = {
    sortable: false,
    // flex: 1,
    resizable: false,
    filter: false,
    enableCharts: false,
    cellStyle: {
      textAlign: 'center',
      borderLeft: 'solid 0.5px #e4e9f2',
      backgroundColor: 'white',
      alignItems: 'center',
    },
  };


  rowSelect($event , params){
    let newValue = $event.target.checked
    this.rowData[params.rowIndex]['hasAccess'] = newValue;
    this.rowData[params.rowIndex]['isView'] = newValue;
    if(newValue == false){
      this.rowData[params.rowIndex]['isDelete'] = newValue;
      this.rowData[params.rowIndex]['isInsert'] = newValue;
      this.rowData[params.rowIndex]['isUpdate'] = newValue;
      this.rowData[params.rowIndex]['isView'] = newValue;
      this.gridOption.api.redrawRows({ rowNodes: [params.node] })
    }
  }

  ngOnInit() {

    this.roleActivities = { Activites: [], roleId: null };

    if (this.id) {
      this.title = this.context.rowData.find(
        (x) => x.roleId == this.id,
      ).nationalName;
      this.activityService.getActivityByRoleId(this.id).subscribe(
        (res) => {
          this.data = (res as any).data.notOk;
          this.all = (res as any).data.ok;
          this.data.forEach((e, i) => {
            this.all.find((x) => x.activityId == e.activityId).hasAccess = true;
            this.all.find((x) => x.activityId == e.activityId).isView = this.data.find((x) => x.activityId == e.activityId).isView;
            this.all.find((x) => x.activityId == e.activityId).isInsert = this.data.find((x) => x.activityId == e.activityId).isInsert;
            this.all.find((x) => x.activityId == e.activityId).isUpdate = this.data.find((x) => x.activityId == e.activityId).isUpdate;
            this.all.find((x) => x.activityId == e.activityId).isDelete = this.data.find((x) => x.activityId == e.activityId).isDelete;
          });

          this.rowData = this.all;
        },
        (err) => {
          // this.rowData = this.data;
        },
      );
    }
  }
  submitForm() {
    this.roleActivities.roleId = this.id;
    this.all.forEach((e, i) => {
      if (e.hasAccess == true) this.roleActivities.Activites.push(e);
    });
    this.activityService
      .postCreatePermissions(this.roleActivities)
      .subscribe((x) => {
        this.notif.successToastr('ثبت با موفقیت انجام شد');
       // this.context.onSearchClick();
        this.dialogRef.close();
      });
  }
  close() {
    this.dialogRef.close();
  }

  onRowSelected(params) {
    params.data.hasAccess = !params.data.hasAccess;
    params.data['isView'] = params.data.hasAccess;
    if (!params.data.hasAccess) {
      params.data['isView'] = false;
      params.data['isInsert'] = false;
      params.data['isUpdate'] = false;
      params.data['isDelete'] = false;
      this.gridOption.api.setRowData(this.all);
    }
  }
}
