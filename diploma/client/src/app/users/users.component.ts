import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public items
  public sysNames
  public attendance = false
  selectedCar: string;
  public stdate = new Date(2020, 1, 20)
  constructor(
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(async ({ type, child }) => {
      this.getSysName(child)
      if (child == 'students') {
        this.apiService.GetAllStudents().subscribe(res => {
          this.items = res.user;
        });
      } else if (child == 'masters') {
        this.apiService.GetAllMaters().subscribe(res => {
          this.items = res.user;
        });
      } else if (child == 'credentials') {
        this.apiService.GetAllUsers().subscribe(res => {
          this.items = res.user;
          this.items.forEach(el => {
            el.usertype = el.usertype && el.usertype == 1 ? 'student' : el.usertype && el.usertype == 2 ? 'master' : 'admin';
            // el.usertype = el.usertype === 0?'admin':null;
          });
        });
      } else if (child == 'events') {
        let userType = sessionStorage.getItem('user')
        let userId = sessionStorage.getItem('userinfoid')
        if (userType == 'admin') {
          this.apiService.GetAllEvents().subscribe(res => {
            this.items = res.user;
          });
        } else if (userType == 'master') {
          this.attendance = true;
          this.apiService.GetAllEventsForMaster(userId).subscribe(res => {
            this.items = res.user;
            this.items.forEach(el => {
              el.upload = this.checktime(el.starttime, el.endtime)
            });
          });
        } else if (userType == 'student') {
          this.apiService.GetAllEventsForStudent(userId).subscribe(res => {
            this.items = res.user;
            this.items.forEach(el => {
              el.attend = el.attend && el.attend.length?el.attend.filter(x=>x == el.studentlist[0]):null
              el.apsent = el.apsent && el.apsent.length?el.apsent.filter(x=>x == el.studentlist[0]):null

            })
          })
        }

      }
    })
  }

  checktime(starttime, endtime) {
    if (new Date(starttime).getHours() == new Date().getHours() || new Date(endtime) >= new Date()) {
      return false
      // (new Date(endtime).getHours()>=new Date().getHours() && new Date(endtime).getMinutes()>=new Date().getMinutes() )
    } else {
      return true
    }
  }

  ngOnInit(): void {
    // console.log(this.items)
  }

  getSysName(child) {
    if (!child) return
    if (child == 'students') {
      this.sysNames = [
        { name: 'name', label: '??????', selected: '' },
        { name: 'surname', label: '??????????????', selected: '' },
        { name: 'fathername', label: '????????????????', selected: '' },
        { name: 'email', label: '??????????', selected: '' },
        { name: 'faculty', label: '??????????????????', selected: '' },
        { name: 'school', label: '??????????????', selected: '' },
        { name: 'speciality', label: '??????????????????????????', selected: '' },
        { name: 'group', label: '????????????', selected: '' },
        { name: 'enrollmentyear', label: '?????? ??????????????????????', selected: '' },
        { name: 'lang', label: '???????? ????????????????', selected: '' },
      ]
    } else if (child == 'masters') {
      this.sysNames = [
        { name: 'name', label: '??????', selected: '' },
        { name: 'surname', label: '??????????????', selected: '' },
        { name: 'fathername', label: '????????????????', selected: '' },
        { name: 'email', label: '??????????', selected: '' },
        { name: 'faculty', label: '??????????????????', selected: '' },
        { name: 'school', label: '??????????????', selected: '' }
      ]
    } else if (child == 'credentials') {
      this.sysNames = [
        { name: 'username', label: '??????????', selected: '' },
        { name: 'usertype', label: '?????? ????????????????????????', selected: '' },
        { name: 'created_at', label: '???????? ????????????????', selected: '', type: 'date' },
        { name: 'updated_at', label: '???????? ??????????????????', selected: '', type: 'date' },
        { name: 'password', label: '????????????', selected: '' }
      ]
    } else if (child == 'events') {
      this.sysNames = [
        { name: 'id', label: 'ID', selected: '' },
        { name: 'lection', label: '????????????', selected: '' },
        { name: 'master', label: '??????????????????????????', selected: '' },
        { name: 'starttime', label: '????????????', selected: '', type: 'date' },
        { name: 'endtime', label: '??????????', selected: '', type: 'date' },
        { name: 'studentlist', label: '????????????????', selected: '', type: 'array' },
        { name: 'attend', label: '??????????????????????????', selected: '', type: 'array' },
        { name: 'apsent', label: '????????????????????', selected: '', type: 'array' }
      ]
    }
  }

  handleFileInput(id,students,$event) {
    // console.log(stud, $event.target.files[0].type)

    this.apiService.UploadAttendance(id,students, $event.target.files[0]).subscribe(res => {
      console.log(res)
    });
  }
}
