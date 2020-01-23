# Notificaciones push FIREBASE CLOUD MESSENGING

## Dependencias
1. @angular/fire/: `npm i --save @angular/fire`
2. rxjs: `npm i --save rxjs`

## Instrucciones de instalación
1. Se necesita tener instalado toda la dependencia de **@angular/fire** y con sus respectivas credenciales.
2. En la **consola de Firebase** ir a **Configuración del proyecto => Mensajería en la nube =>  Configuración web** y Generar par de claves.
3. En el proyecto de angular copiar el archivo del SERVICE WORKER:  **firebase-messanging-sw.js** en la carpeta **src** y pegar las respectivas credenciales, incluyendo las claves generadas recientemente.
4. **Por seguridad** agregar el archivo al **.gitignore**
5. Copiar el archivo de SERVICIO **notificaciones.service.ts** en la carpeta de servicios del proyecyo de angular o donde mejor convenga para el proyecto
6. En **notificaciones.service.ts** modificar las rutas como convenga. Están configuradas por default para solicitar permisos de notificación por usuario

## Usos

### Solicitar permisos de notificaciones push
En cualquiera de los componentes que se requiera solcitar permisos *(se recomienda en un component más cercano al **root**)* importar el servicio y hacer el llamado `getPermission`.

```typescript
import { NotificacionesService } from '../../../services/notificaciones.service';

export class Component implements OnInit {

    constructor( private _notificaciones: NotificacionesService ) { }

    ngOnInit() {
        this._notificaciones.getPermission()
    }

}
```

### Recibir notificaciones
En cualquiera de los componentes que se requiera obtener las notificaciones desde la base de datos importar el servicio y hacer el llamado `receiveMessage` el cuál recibirá en tiempo real las notificaciones y suscribirse al nuevo mensaje entrante.

```typescript
import { NotificacionesService } from '../../../services/notificaciones.service';

export class Component implements OnInit {

    public nueva_notificacion: any
    constructor( private _notificaciones: NotificacionesService ) { }

    ngOnInit() {
        this._notificaciones.receiveMessage()
        this.nueva_notificacion = this._notificaciones.currentMessage
    }

}
```

### Mostrar noticifaciones en el front-end
En el componente que se desee mostrar las notificaciones es necesario solicitarlas  la base de datos mediante el método `getUserNotidfications`

```typescript
import { NotificacionesService } from '../../../services/notificaciones.service';

export class Component implements OnInit {

    public notificaciones: any
    constructor( private _notificaciones: NotificacionesService ) { }

    async ngOnInit() {
        this.notificaciones = await this._notificaciones.getUserNotidfications()
    }

}
```

Ejemplo descriptivo de como pintar las notificaciones en el front-end

```html
<div *ngIf="notificaciones">
    <ul>
        <li *ngFor="let notificacion of notificaciones">
            <!-- Muestra el título de la notificacion y mantiene un link a donde quiera que se desee -->
            <div class="col s10" [routerLink]="['']">
                <h6 class="resaltado"> {{notificacion.title}} </h6>
            </div>
            <div class="col s2">
                <!-- Si se desea eliminar notificaciones desde el front-end -->
                <i class="fas fa-trash-alt grey-text" (click)="delNotificacion(notificacion.id)"></i>
            </div>
            <div class="col s12" [routerLink]="['']">
                <p class="grey-text noti-body">{{notificacion.body}}</p>
            </div>
        </li>
    </ul>
</div>

```

### Combo solicitud de permisos y recibir notificaiones
Se recomienda que en el mismo componente que se desea recibir notificaciones hacer la solicitud de permisos para el service worker

```typescript
import { NotificacionesService } from '../../../services/notificaciones.service';

export class Component implements OnInit {

    public nueva_notificacion: any
    constructor( private _notificaciones: NotificacionesService ) { }

    ngOnInit() {
        this.getNotificaciones()
    }

    getNotificaciones(){
        this._notificaciones.getPermission()
        this._notificaciones.receiveMessage()
        this.nueva_notificacion = this._notificaciones.currentMessage
    }

}
```