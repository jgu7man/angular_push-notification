import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs'
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';



@Injectable({providedIn:'root'})
export class NotificacionesService {

  currentMessage = new BehaviorSubject(null)
  public uid

    constructor(
      private fs: AngularFirestore,
      private afAuth: AngularFireAuth,
      private messaging: AngularFireMessaging
    ) {
      var user = JSON.parse(localStorage.getItem('needlog'))
      this.uid = user.uid
     }


  updateToken(token) {
    this.afAuth.authState.subscribe(user => {
      if (!user) return;
      const data = { token: token }
      this.fs.doc(`usuarios/${user.uid}/tokens/token_notificaciones`).set(data)
    })
  }

  getPermission() {
    this.messaging.requestPermission
      .pipe(mergeMapTo(this.messaging.tokenChanges))
      .subscribe(
      (token) => {
        console.log('Dio permiso para notificaciones.');
        this.updateToken(token)
        
      },(err) => {
        console.log('No dio permisos', err);
      });
    }

    receiveMessage() {
       this.messaging.messages.subscribe((payload) => {
        console.log("Mensaje recibido. ", payload);
        this.currentMessage.next(payload)
      });

  }
  
  async getUserNotidfications() {
    
    var userDoc = this.fs.collection('usuarios').ref.doc(this.uid)
    var notiRef = userDoc.collection('notificaciones')
    var orderNotif = notiRef.orderBy('time', 'desc')
    var notiRes = await orderNotif.get()
    var notificaciones = []
    if (notiRes.size > 0) {
      notiRes.forEach(noti => {
        notificaciones.push({
          id: noti.id,
          title: noti.data().title,
          body: noti.data().body,
          fecha: noti.data().time,
          eventoId: noti.data().eid
        })
      })
    }
    return notificaciones
  }
}