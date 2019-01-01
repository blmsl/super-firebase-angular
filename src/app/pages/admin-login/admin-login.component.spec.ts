import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { from, Subject } from 'rxjs';
import { APP_CONFIG, APP_UNIT_TEST_CONFIG } from '../../app-config';
import { AuthService, SeoService } from '../../services';
import { AdminLoginComponent } from './admin-login.component';

const credentialsMock = {
    email: 'abc@123.com',
    password: 'password'
};

const userMock = {
    uid: 'ABC123',
    email: credentialsMock.email
};

const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and
        .returnValue(
            {
                valueChanges: jasmine.createSpy('valueChanges').and
                    .returnValue(from([userMock]))
            })
};

const fakeAuthState = new Subject();

const angularFireAuthStub = {
    authState: {
        pipe(): any {
            return fakeAuthState;
        }
    },
    auth: {
        async createUserWithEmailAndPassword(email, password): Promise<any> {
            fakeAuthState.next(userMock);

            return Promise.resolve(userMock);
        },
        async signInWithEmailAndPassword(email, password): Promise<any> {
            fakeAuthState.next(userMock);

            return Promise.resolve(userMock);
        },
        async signOut(): Promise<any> {
            fakeAuthState.next(undefined);

            return Promise.resolve();
        }
    }
};

describe('AdminLoginComponent', () => {
    let fixture: ComponentFixture<AdminLoginComponent>;
    let comp: AdminLoginComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                SeoService, AuthService,
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: AngularFireAuth, useValue: angularFireAuthStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AdminLoginComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create', async(() => {
        expect(comp)
            .toBeTruthy();
    }));
});

describe('AdminLoginComponentAuthService', () => {
    let fixture: ComponentFixture<AdminLoginComponent>;
    let comp: AdminLoginComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminLoginComponent
            ],
            providers: [
                SeoService, AuthService,
                {provide: AngularFirestore, useValue: angularFirestoreStub},
                {provide: AngularFireAuth, useValue: angularFireAuthStub},
                {provide: APP_CONFIG, useValue: APP_UNIT_TEST_CONFIG}
            ],
            imports: [
                RouterTestingModule.withRoutes([{path: '', component: AdminLoginComponent}])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AdminLoginComponent);
                comp = fixture.componentInstance;
                fakeAuthState.next(undefined);
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should be created', fakeAsync(() => {
        expect(comp.auth)
            .toBeTruthy();
    }));

    it('should not be initially authenticated', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));

    it('should be authenticated after register', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.register(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should be authenticated after logging in', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        comp.auth.logIn(credentialsMock)
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();

        expect(lastUser)
            .toBeDefined();
        expect(lastUser.email)
            .toEqual(credentialsMock.email);
    }));

    it('should not be authenticated after logging out', fakeAsync(() => {
        let lastUser;
        comp.auth.user$.subscribe(user => {
            lastUser = user;
        });
        fakeAuthState.next(userMock);
        comp.auth.signOut()
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
        tick();
        expect(lastUser)
            .toBe(undefined);
    }));
});