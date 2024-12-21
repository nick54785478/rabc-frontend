import { Component, DoCheck, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { UserRoleQueried } from '../../models/user-roles-query.model';
import { UserGroupQueried } from '../../models/user-group-query.model';
import { UserDetailQueried } from '../../models/user-detail-query.model';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personality',
  standalone: true,
  imports: [SharedModule, CoreModule],
  templateUrl: './personality.component.html',
  styleUrl: './personality.component.scss',
})
export class PersonalityComponent
  extends BaseFormCompoent
  implements OnInit, DoCheck
{
  groups: UserGroupQueried[] = []; // 群組
  roles: UserRoleQueried[] = []; // 角色
  // 編輯中的資料，需初始化，否則會報錯，Typescript 較嚴格
  userInfo: UserDetailQueried = new UserDetailQueried(); // 查詢後的資料

  previousValue: UserDetailQueried = new UserDetailQueried(); // 用來保存先前的值

  detailTabs: any[] = [];

  editingMode: boolean = false; // 模式

  constructor(
    private userService: UsersService,
    private messageService: SystemMessageService
  ) {
    super();

    // 初始化表單
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      nationalIdNo: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userService.getPersonality('').subscribe({
      next: (res) => {
        console.log(res);
        this.groups = res.groups;

        this.userInfo = res;
        this.roles = res.roles;
      },
      error: (error) => {
        this.messageService.error('取得資料發生錯誤', error.message);
      },
    });

    this.detailTabs = [
      {
        label: '編輯',
        icon: 'pi pi-pencil',
        command: () => {
          this.toggleEdit();
        },
        disabled: this.editingMode,
        visible: true,
      },
      {
        label: '提交',
        icon: 'pi pi-save',
        command: () => {},
        // 當在新增或編輯模式時，不能提交
        disabled: !this.editingMode,
        visible: true,
      },
      {
        label: '取消',
        icon: 'pi pi-times',
        command: () => {
          this.cancel();
        },
        disabled: !this.editingMode,
        visible: true,
      },
    ];
  }

  ngDoCheck(): void {
    this.detailTabs = [
      {
        label: '編輯',
        icon: 'pi pi-pencil',
        command: () => {
          this.toggleEdit();
        },
        disabled: this.editingMode,
        visible: true,
      },
      {
        label: '提交',
        icon: 'pi pi-save',
        command: () => {},
        // 當在新增或編輯模式時，不能提交
        disabled: !this.editingMode,
        visible: true,
      },
      {
        label: '取消',
        icon: 'pi pi-times',
        command: () => {
          this.cancel();
        },
        disabled: !this.editingMode,
        visible: true,
      },
    ];
  }

  /**
   * 切換編輯模式
   */
  toggleEdit() {
    this.editingMode = true;
    // 存取修改前的值
    this.previousValue = { ...this.userInfo };

    // this.previousValue = {
    //   id: this.userInfo.id,
    //   username: this.userInfo.username,
    //   name: this.userInfo.name,
    //   email: this.userInfo.email,
    //   address: this.userInfo.address,
    //   nationalIdNo: this.userInfo.nationalIdNo,
    //   birthday: this.userInfo.birthday,
    //   groups: this.userInfo.groups,
    //   roles: this.userInfo.roles,
    //   functions: this.userInfo.functions,
    // };
  }

  /**
   * 取消編輯
   */
  cancelEdit() {}

  /**
   * 確認修改
   *
   * @param target FormControlName 的 key
   * @param value 值
   */
  confirm(target: any, value: any) {
    this.editingMode = false;
  }

  /**
   * 取消修改
   */
  cancel() {
    this.editingMode = false;
    console.log(this.previousValue);
    // 返回原值
    this.userInfo = { ...this.previousValue };
  }
}