import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleModel } from '../../models';
import { AlertService, SeoService } from '../../services';
import { ActivatedRoute, ActivatedRouteStub, angularFirestoreStub } from '../../testing/index.spec';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ArticleDetailComponent } from './article-detail.component';

const activatedRouteStub = new ActivatedRouteStub();

describe('ArticleDetailComponent', () => {
    let fixture: ComponentFixture<ArticleDetailComponent>;
    let comp: ArticleDetailComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ArticleDetailComponent,
                FooterComponent,
                SideBarComponent,
                AlertComponent
            ],
            providers: [
                AlertService, SeoService, TransferState,
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: AngularFirestore, useValue: angularFirestoreStub}
            ],
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([
                    {path: 'article/:id', component: ArticleDetailComponent},
                    {path: 'articles', component: ArticleDetailComponent},
                    {path: 'articles/:pageNo', component: ArticleDetailComponent},
                    {path: 'en/article/:id', component: ArticleDetailComponent},
                    {path: 'tr/article/:id', component: ArticleDetailComponent},
                    {path: 'en/article', component: ArticleDetailComponent},
                    {path: 'tr/article', component: ArticleDetailComponent}
                ])
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ArticleDetailComponent);
                comp = fixture.componentInstance;
                fixture.detectChanges();
            })
            .catch(reason => {
                expect(reason)
                    .toBeUndefined();
            });
    }));

    it('should create the app', async(() => {
        expect(comp)
            .toBeTruthy();
    }));

    it('should load first-article', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-article'});
        fixture.detectChanges();
        let lastArticle = new ArticleModel();
        comp.article$.subscribe(article => {
            lastArticle = article;
        });
        tick();
        expect(lastArticle.id)
            .toEqual('first-article');
    }));

    it('should redirection to translation of page', fakeAsync(() => {
        activatedRouteStub.setParamMap({id: 'first-article'});
        fixture.detectChanges();
        comp.checkTranslation(undefined);
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/tr/article/first-article');
    }));

    it("should redirection to '/article/first-article' if id is -1", fakeAsync(() => {
        activatedRouteStub.setParamMap({id: '-1'});
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(comp.router.url)
            .toEqual('/article/first-article');
    }));

    it('trackByIndex(2) should return 2', async(() => {
        expect(comp.trackByIndex(2, {}))
            .toBe(2);
    }));

});