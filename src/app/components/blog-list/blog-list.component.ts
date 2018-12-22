import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoService } from '../../services';
import { BlogModel } from '../../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Blog List Component
 */
@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
    /** blog object array */
    blogs$: Observable<Array<BlogModel>>;
    /** current page`s title */
    title = 'Murat Demir\'s blog';
    /** current page`s description */
    description = 'This App is in development!';
    /** count of blogs */
    countItems: number;

    /**
     * constructor of BlogListComponent
     * @param afs: AngularFirestore
     * @param seo: SeoService
     */
    constructor(private afs: AngularFirestore,
                private seo: SeoService) {
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        this.blogs$ = this.afs.collection('blogs_en-US', ref => ref.orderBy('created', 'desc'))
            .snapshotChanges()
            .pipe(map(actions => {
                return actions.map(action => {
                    this.countItems = actions.length;
                    const id = action.payload.doc.id;
                    const data = action.payload.doc.data();
                    if (!data.hasOwnProperty('contentSummary'))
                        data['contentSummary'] = data['content'];

                    return { id, ...data as BlogModel };
                });
            }));

        this.seo.setHtmlTags({
            title: this.title,
            description: this.description
        });
    }

    /**
     * track blog object array by blog
     * @param index: blog index no
     * @param item: blog object
     */
    trackByBlog(index, item): number {
        return index;
    }
}
