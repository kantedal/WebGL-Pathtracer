import { WebGLPathtracerPage } from './app.po';

describe('web-gl-pathtracer App', function() {
  let page: WebGLPathtracerPage;

  beforeEach(() => {
    page = new WebGLPathtracerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
