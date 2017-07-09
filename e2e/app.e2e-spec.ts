import { FaceemotionPage } from './app.po';

describe('faceemotion App', () => {
  let page: FaceemotionPage;

  beforeEach(() => {
    page = new FaceemotionPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
