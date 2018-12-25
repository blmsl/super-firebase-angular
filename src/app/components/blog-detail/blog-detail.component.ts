import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { BlogModel } from '../../models/blog-model';
import { startWith, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';

/** State key of current blog */
const BLOG_KEY = makeStateKey<any>('blog');

/**
 * Blog Detail Component
 */
@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
    /** current blog object */
    blog$: Observable<BlogModel>;
    /** current blog ID */
    blogID = '';

    /**
     * constructor of BlogDetailComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     * @param router: Router
     * @param route: ActivatedRoute
     * @param state: TransferState
     * @param locale: LOCALE_ID
     */
    constructor(
        private afs: AngularFirestore,
        private seo: SeoService,
        public router: Router,
        private route: ActivatedRoute,
        private state: TransferState,
        @Inject(LOCALE_ID) public locale: string
    ) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => {
            const pID = Number(pmap.get('id'));
            if (pID || pID === 0) {
                this.afs.collection(`blogs_${this.locale}`,
                    ref => ref.where('orderNo', '==', pID)
                        .limit(1)
                )
                    .snapshotChanges()
                    .subscribe(data => {
                        if (data && data.length > 0)
                            data.map(pld => {
                                this.router.navigate(['/blog', pld.payload.doc.id]);
                            });
                        else if (pID === 0)
                            this.router.navigate(['/blogs']);
                        else
                            this.router.navigate(['/blog', pID + 1]);
                    });

                return;
            }
            this.blogID = pmap.get('id');
            this.initBlog();
        });
        // this will create a split second flash
        // this.page$ = this.afs.doc(`articles_${this.locale}/${id}`).valueChanges();
    }

    /**
     * init blog
     */
    initBlog(): void {
        this.blog$ = this.ssrFirestoreDoc(`blogs_${this.locale}/${this.blogID}`, true);
        this.blog$.subscribe(blog => {
            if (blog)
                this.seo.setHtmlTags(blog);
            else
                this.checkTranslation(undefined);
        });
    }

    /**
     * check if there is another translation and redirect to it
     */
    checkTranslation(checkInLocale): void {
        if (checkInLocale)
            this.afs.doc<BlogModel>(`blogs_${checkInLocale}/${this.blogID}`)
                .valueChanges()
                .subscribe(blog => {
                    if (blog) {
                        const languageCode2 = checkInLocale.substring(0, 2);
                        this.seo.http301(`/${languageCode2}/blog/${this.blogID}`);
                    } else
                        this.seo.http404();
                });
        else if (this.locale === 'en-US')
            this.checkTranslation('tr-TR');
        else if (this.locale === 'tr-TR')
            this.checkTranslation('en-US');
    }

    /**
     * Get blog object from firestore by path
     * @param path: blog path
     * @param checkTranslation: check translation if current blog is not exist
     */
    ssrFirestoreDoc(path: string, checkTranslation: boolean): Observable<BlogModel> {
        const exists = this.state.get(BLOG_KEY, new BlogModel());

        return this.afs.doc<BlogModel>(path)
            .valueChanges()
            .pipe(tap(blog => {
                    if (blog)
                        this.state.set(BLOG_KEY, blog);
                }),
                startWith(exists)
            );
    }

    /**
     * track content object array by index
     * @param index: index no
     * @param item: object
     */
    trackByIndex(index, item): number {
        return index;
    }

}
