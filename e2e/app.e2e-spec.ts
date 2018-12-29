import { AppPage } from './app.po';

describe('super-firebase-angular App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display welcome message', async () => {
        page.navigateTo()
            .catch(reason => {
                console.error(reason);
            });

        return expect(page.getParagraphText())
            .toEqual('Welcome!');
    });
});
